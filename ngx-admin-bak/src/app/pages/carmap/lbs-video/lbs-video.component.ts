import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList, Renderer } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, Menu, MenuItem } from 'primeng/primeng';
import { LbsTreeComponent } from 'app/pages/common-util/lbstree/lbstree.component';

@Component({
  selector: 'lbs-video',
  templateUrl: './lbs-video.component.html',
  styleUrls: ['./lbs-video.component.scss']
})
export class LbsVideoComponent implements OnInit {

  serverIp: any;
  serverPort: any;
  phone: any;

  //选中状态 0为未选中 1为选中
  force: number = 0;
  //视屏对应的参数信息
  controlScreen: any[] = [];
  blueScreen: any[] = [];
  //高度
  height: any;
  //视屏窗口占尺寸
  firstNum: any;
  divNum: any;
  //视频窗口数
  //是否全屏(对浏览器)
  fullScreen=false;
  //父页面是否全屏(对对显示器)
  parentFullFlag=false;
  total: number = 4;
  //当前选中视频数
  curr: number = -1;
  videoTd: any[]=[];
  videoObj: any[]=[];
  rootNode: any;
  treeNode: any;

  msgs: Message[] = [];
  menuItems: MenuItem[];
  menuPopup: boolean = true;

  visibleSidebar2 = false;

  iframeShow = false;

  // @ViewChildren('myActiveX') myActiveX: QueryList<ElementRef>;

  @ViewChild('videoDiv') videoDiv: ElementRef;

  @ViewChild('menu') menu: Menu;

  constructor(private elementRef: ElementRef, private renderer: Renderer) {
    this.serverIp = "202.102.112.17";
    this.serverPort = "2290";
    this.phone = "64788852959";

    this.treeNode = {
      "id": this.phone,
      "p": this.serverIp,
      "r": this.serverPort,
      "v": 4,
    }

    this.rootNode = {
      "p": this.serverIp,
      "r": this.serverPort,
    }

    this.InitMenuItems();

  }

  private title: string;
  private display: boolean;

  ngOnInit() {

    this.height = window.innerHeight*0.65;
    this.initVideoDiv(2,1);
    // 页面监听
　　Observable.fromEvent(window, 'resize')
　　.debounceTime(100) // 以免频繁处理
　　.subscribe((event:any) => {
　　　 // 这里处理页面变化时的操作
      this.height = event.target.innerHeight*0.65;
      this.initVideoDiv(this.divNum,this.firstNum);
　　});
    
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    // this.destoryVideo();
  }

  InitMenuItems() {
    this.menuItems = [
      {
        label: '全部打开',
        icon: 'fa-gear',
        command: (event: any) => {
          console.log(event);
          this.videoShowRole(this.treeNode);
        }
      },
      {
        label: '全部关闭',
        icon: 'fa-gear',
        command: (event: any) => {
          console.log(event);
          this.onEndVideo();
        }
      }];
    for(let i=1;i<=4;i++) {
      this.menuItems.push(
        {
          label: '视频通道'+i,
          icon: 'fa-gear',
          command: (event: any) => {
            console.log(event);
            this.showOneVideo(this.treeNode,i);
          }
        });
    }
    this.menuItems.push(
      {
        label: '车辆监控',
        icon: 'fa-gear',
      },
      {
        label: '历史视频',
        icon: 'fa-gear',
      },
      {
        label: '历史轨迹',
        icon: 'fa-gear',
      },
      {
        label: '维修管理',
        icon: 'fa-gear',
      },
      {
        label: '参数设置',
        icon: 'fa-gear',
      });
  }

  phoneChange(phone) {
    this.treeNode.id = phone;
    console.log(this.treeNode);
  }

  initVideoDiv(divSize,firstSize){
    if(firstSize==null||firstSize==''){
      firstSize=1;
    }
    this.firstNum=firstSize;
		this.divNum=divSize;
    if(this.curr>=divSize*divSize-firstSize*firstSize+1)
    {
      this.curr=divSize*divSize-firstSize*firstSize;
      this.force=0;
    }
    this.total=divSize*divSize-firstSize*firstSize+1;
    var table=this.initTable(divSize, firstSize,this.height);
    var tableTd=table.getElementsByTagName('td');
    var videoObj = copyArr(this.videoObj);
    
    //初始化未显示视频窗口
    for(var i=this.videoTd.length;i<tableTd.length;i++){
      this.initObject(tableTd[i],"video"+i);
    }

    //获取已有的视屏窗口
    for(var i=0;i<this.videoTd.length;i++){
      if(this.curr==i){
        this.renderer.setElementStyle(tableTd[i],"border","2px red solid");
      }
      if(i<tableTd.length){
        tableTd[i].appendChild(videoObj[i]);
      }else{
        if(this.controlScreen[i]!=null){	
          videoObj[i].EndRecord();
          videoObj[i].EndVideo();
          videoObj[i].EndAudio();
          videoObj[i].EndTalk();
          this.controlScreen[i]=null;
        }
      }
    }
    //删除之前的视频表格
    if(this.videoDiv.nativeElement.hasChildNodes()){
      this.videoDiv.nativeElement.removeChild(this.videoDiv.nativeElement.getElementsByTagName("table")[0]);
    }
    //添加新的视频表格
    this.videoDiv.nativeElement.appendChild(table);
    this.videoTd=this.videoDiv.nativeElement.getElementsByTagName("td");
    this.videoObj=this.videoDiv.nativeElement.getElementsByTagName("object");
    //加载视频窗口相应的事件
    for(var i=0;i<this.videoTd.length;i++)
    {
      this.initMouseScript(i);
    }
  }

  //视频自动显示
  videoShowRole(treeNode) {
    var index=this.curr;

    for ( var channel = 1; channel <= treeNode.v; channel++) {
      //如果为选中状态(从当前选中窗口开始)
      if(this.force==1){
        if(this.videoIsExist(treeNode,channel)==false){
          this.endVideo(index);
        }
      }else{
        //否则从当前标记窗口下一个窗口开始
        if(this.controlScreen[index]!=null||index==-1){
          index++;
        }
        if (index >= this.total){
          index = 0;
        }	
      }

      var flag = 0;
      //从当前选中窗口向后自动检索 如果存在未打开窗口 在该窗口打开视频
      for ( var i = index; i < this.total; i++) {
        if (this.controlScreen[i] == null) {
          if(this.videoIsExist(treeNode,channel)==true) {
            if(this.force==0) {
              index--;
            }
          }else{
            this.openVideo(i,treeNode,channel);
          }
          flag = 1;
          console.log("after",i);
          break;
        }
      }
      if (flag == 1) {
        this.force=0;
        continue;
      }
      //向后未检索到窗口 则在其前面检索
      for ( var i = 0; i < index; i++) {
        if (this.controlScreen[i] == null) {
          if(this.videoIsExist(treeNode,channel)) {
            if(this.force==0) {
              index--;
            }
          }else{
            this.openVideo(i,treeNode,channel);
          }
          flag = 1;
          console.log("before",i);
          break;
        }
      }

      if (flag == 1) {
        this.force=0;
        continue;
      }

      //如果都没有检索到 则表示视频窗口已被占满 则从当前窗口向后占据 如果视频已存在则跳过   
      for(var i=index;i<this.total;i++) {
        if(this.videoIsExist(treeNode,channel)) {
          if(this.force==0) {
            index--;
          }
          continue;
        }
        
        this.openVideo(i, treeNode, channel);
        
        flag=1;
        break;
      }
      if (flag == 1) {
        this.force=0;
        continue;
      }

      //在沾满的情况下 如果过执行到最后一个 则从头开始覆盖
      for(var i=0;i<index;i++) {
        if(this.videoIsExist(treeNode,channel)) {
          if(this.force==0) {
            index--;
          }
          continue;
        }
        flag=1;
        this.openVideo(i, treeNode, channel);
        break;
      }
      this.force=0;
    }
  }

  //播放单个视频
  showOneVideo(treeNode,channel) {
    if(!this.videoIsExist(treeNode,channel))
    {
      if(this.force==0)
      {		
        var flag=0;
        //先查找是否存在未播放的视频窗口
        for(var j=0;j<this.total;j++)
        {
          //存在未播放的视频窗口,在该窗口播放视频
          if(this.controlScreen[j]==null)
          {
            this.openVideo(j,treeNode,channel);
            flag=1;
            break;
          }
        }
        //不存在未播放的视频窗口 则获取当前窗口的下一个窗口
        if(flag==0)
        {
          this.curr=this.curr+1;
          this.curr=this.curr-this.curr/this.total*this.total;
          this.openVideo(this.curr,treeNode,channel);
        }
        return ;
      }
      //如果当前窗口为选中状态
      this.openVideo(this.curr,treeNode,channel);
    }
    
  }

  //判断要打开的视频是否存在
	videoIsExist(treeNode,channel)
	{
		var flag=false;
		for(var i=0;i<this.total;i++)
		{
			if(this.controlScreen[i]!=null&&treeNode.id==this.controlScreen[i].phone&&channel==this.controlScreen[i].channel)
			{
        this.controlScreen[i].blue=true;
				this.renderer.setElementStyle(this.videoTd[i],"border","2px blue solid");
				flag=true;
				break;
			}
		}
		return flag;
  }
  
  //打开视频文件 记录视频相应的连接参数
	openVideo(index,treeNode,channel) {
		if(this.controlScreen[index]!=null)
		{
			this.endVideo(index);
		}
		this.controlScreen[index]=new Object();
		this.controlScreen[index].serverPort=this.rootNode.r;
		this.controlScreen[index].serverIp=this.rootNode.p;
		this.controlScreen[index].phone=treeNode.id;
		this.controlScreen[index].name=treeNode.name;
		this.controlScreen[index].channel=channel;
		//controlScreen[index].carNo=treeNode.carNo;
    var video=this.videoObj[index];
		
		if(!!treeNode.r && !!treeNode.p && treeNode.r!=null&&treeNode.r!=""&&treeNode.p!=null&&treeNode.p!=""){
			this.controlScreen[index].serverPort=treeNode.r;
			this.controlScreen[index].serverIp=treeNode.p;
			video.Connect(treeNode.p,treeNode.r);
		}else{
			this.controlScreen[index].serverPort=this.rootNode.r;
			this.controlScreen[index].serverIp=this.rootNode.p;
			video.Connect(this.rootNode.p,this.rootNode.r);
		}
		
    // video.Connect(this.rootNode.p,this.rootNode.r);
		
    video.BeginVideo2(treeNode.id,channel,treeNode.name);
		//recodeLog(treeNode.id,channel,"3",treeNode.name);
		var tds=this.videoTd;
		for(var i=0;i<this.total;i++)
		{
			if(this.controlScreen[i]!=null&&this.controlScreen[i].blue==true)
			{
        tds[i].style['border']='2px blue solid';
			}else
			{
				tds[i].style['border']='2px gray solid';
			}
		}
		tds[index].style['border']='2px red solid';
		this.curr = index ;

		// add by gehengzhi 2015-06-24
		// 定时关闭
		// clearTimeout(vtime);
		// 	vtime = setTimeout('controlPtz(\'EndAll\')', "1200000"); 
		// // end add
		
  }
  
  //结束 清空视频参数
	endVideo(index) {
    this.controlScreen[index]=null;
		if(this.videoObj[index]!=null) {
			this.videoObj[index].EndRecord();
			this.videoObj[index].EndVideo();
			this.videoObj[index].EndAudio();
      this.videoObj[index].EndTalk();
    }
  }

  //视频销毁
	destoryVideo() {
		for(var i=0;i<this.total;i++)
		{  
      this.endVideo(i);
			if(this.videoObj[i]!=null)
			{
				this.videoObj[i].DisConnect();
			}
    }
	}

  //去除蓝色标志
	removeBlueLine()
	{
		for(var i=0;i<this.total;i++)
		{
			if(this.controlScreen[i]!=null&&this.controlScreen[i].blue==true)
			{
				this.controlScreen[i].blue=null;
				if(this.curr!=i)
				{ 
          this.renderer.setElementStyle(this.videoTd[i],"border","2px gray solid");
				}
			}
		}
	}
  
  ondblClick(message) {
    console.log("message",message);
    deepCopy(message.data,this.treeNode);
    //暂时给节点添加的信息
    this.treeNode.id = this.phone;
    this.treeNode.p = this.serverIp;
    this.treeNode.r = this.serverPort;
    this.treeNode.v = 4;
    console.log("this.treeNode",this.treeNode);
    this.removeBlueLine();
    this.videoShowRole(this.treeNode);
  }

  onrightClick(message) {
    console.log("message",message);
    if(!message.node.hasChildren){
      deepCopy(message.node.data,this.treeNode);
      //暂时给节点添加的信息
      this.treeNode.id = this.phone;
      this.treeNode.p = this.serverIp;
      this.treeNode.r = this.serverPort;
      this.treeNode.v = 4;
      this.menu.show(message.$event);
      console.log(this.menu.el);
      
    }else{
      this.stopDefault(message.$event);
    }
  }

  //阻止浏览器的默认行为 
  stopDefault( e ) { 
    //阻止默认浏览器动作(W3C) 
    if ( e && e.preventDefault ) 
        e.preventDefault(); 
    //IE中阻止函数器默认动作的方式 
    else
        window.event.returnValue = false; 
    return false; 
  }


  showMessage(_severity,_detail,_summary?) {
    this.msgs = [];
    this.msgs.push({severity:_severity, detail:_detail, summary:_summary});
  }
  
  showSuccessMessage(_detail) {
    this.showMessage('success',_detail);
  }

  showErrorMessage(_detail) {
    this.showMessage('error',_detail);
  }

  showWarnMessage(_detail) {
    this.showMessage('warn',_detail);
  }

  //播放视频
  onBeginVideo() {
    if(this.phone == ""){
      this.showErrorMessage("请输入手机号");
      return;
    }
    console.log("onBeginVideo",this.treeNode);

    this.removeBlueLine();
    this.videoShowRole(this.treeNode);
    
    // this.openVideo(0,this.treeNode,1);
    // this.openVideo(1,this.treeNode,2);
    // this.openVideo(2,this.treeNode,3);
    // this.openVideo(3,this.treeNode,4);

    // this.videoObjets.forEach((activex,index) => {
    //   let result = activex.beginVideo(this.phone,index+1);
    //   if(result != 0) {
    //     this.showErrorMessage("通道"+(index+1)+"打开录像失败");
    //   }
    // });
  }

  //关闭视频
  onEndVideo() {
    this.curr = -1;
    this.removeBlueLine();
    for(var i=0;i<this.total;i++) {
    this.endVideo(i);
    }
  }

  //初始化table
  initTable(divSize,firstSize,height)
  {
    var table=document.createElement("table");
    table.id="content";
    table.style.width="100%";
    table.cellPadding="0";
    table.cellSpacing="0";
    var index=0;
    for(var i=0;i<divSize;i++)
    {
      var tr=document.createElement("tr");
      for(var j=0;j<divSize;j++)
      {
        
        if(i==0&&j==0)
        {
          var td=document.createElement("td");
          td.colSpan = firstSize;
          td.rowSpan = firstSize;
          td.style.width=100/divSize*firstSize+"%";
          td.style.height=(height-(divSize+1)*2)/divSize*(firstSize)+2*(firstSize-1)+"px";
          td.style.border="2px gray solid";
          // td.name=index;
          index++;
          tr.appendChild(td);
        }
        else if(j<firstSize&&i<firstSize)
        {
          continue;
        }
        else
        {
          var td=document.createElement("td");
          td.style.width=100/divSize+"%";
          td.style.height=(height-(divSize+1)*2)/divSize+"px";
          td.style.border="2px gray solid";
          // td.name=index;
          index++;
          tr.appendChild(td);
        }
      }
      table.appendChild(tr);
    }
    
    return table;
  }

  //初始化object
  initObject(obj,id)
  { 
    var activeObject=document.createElement("object");
    activeObject.id = id;
    activeObject.setAttribute("classid","CLSID:AA165CB1-28FD-4368-8758-31BA53AAF377");
    activeObject.codeBase="./assets/LVP_JT_HXSDK.cab#version=1,0,0,1126";
    activeObject.style.backgroundColor = "black";
    activeObject.style.width = "100%";
    activeObject.style.height = "100%";  
    var param=document.createElement("param");
    param.name = "wmode";
    param.value = "transparent";
    activeObject.appendChild(param);
    obj.appendChild(activeObject);
  }

  //初始化左击事件和右击事件
  initMouseScript(i){
    var obj=this.videoObj[i];
    this.initVideoScript(obj.getAttribute("id"),"OnLeftButtonDown(param)","leftButtonDown");
    this.initVideoScript(obj.getAttribute("id"),"OnLeftButtonUp(param)","leftButtonUp");
    this.initVideoScript(obj.getAttribute("id"),"OnRightButtonUp(param)","rightButtonUp");
    //IE10下监听ocx回调事件
    // obj.attachEvent('OnLeftButtonDown', function(){
    //  leftButtonDown(obj);
    // });
    //  obj.attachEvent('OnLeftButtonUp',function(){
    //    leftButtonUp(obj);
    //  });
    //  obj.attachEvent('OnRightButtonUp', function(){
    //    rightButtonUp(obj);
    //  });
  }

  initVideoScript(htmlFor,event,id){
    let videoScript = document.createElement("script");
    videoScript.type = "text/javascript";
    videoScript.htmlFor = htmlFor;
    videoScript.event = event;
    videoScript.text = this.initVideoTxt(id,htmlFor);
    let head = document.getElementsByTagName("head");
    head[0].appendChild(videoScript);
  }

  initVideoTxt(id,objectId){
    return `
      var ele = document.getElementById("`+id+`");
      ele.innerHTML = param;
      ele.title = "`+objectId+`";
      ele.click();
      `;
  }

  OnLeftButtonDown(event){
    let title = document.getElementById("leftButtonDown").title;
    let obj:any = document.getElementById(title);
    console.log(title);
    let k = title.substring(5);
		this.curr=parseInt(k);
		this.force=1;
    var tds;
    $("#listen").removeClass("tb13click");
		$("#record").removeClass("tb11click");
    $("#voice").removeClass("tb16click");
    if(this.controlScreen[this.curr]!=null)
		{
			if(this.controlScreen[this.curr].audio==1)
			{
				$("#listen").addClass("tb13click");
			}
			if(this.controlScreen[this.curr].record==1)
			{
				$("#record").addClass("tb11click");
			}
			if(this.controlScreen[this.curr].talk==1)
			{
				$("#voice").addClass("tb16click");
			}
    }
    if(this.fullScreen==true)
		{
			tds=$("#videoDiv td",window.parent.document);
		}
		else
		{
			tds=this.videoTd;
    }
    this.getOldVideo(obj,k);	
		for(var i=0;i<tds.length;i++)
		{
			tds[i].style['border']='2px gray solid';
			
    }
		obj.parentNode.style['border']='2px red solid';
  }

  //视频窗口替换
  OnLeftButtonUp(event){
    let title = document.getElementById("leftButtonUp").title;
    let obj:any = document.getElementById(title);
    let i = title.substring(5);
    if(i==this.oldIndex||this.oldIndex==null)
		{
			i=null;
			this.oldIndex=null;
			return ;
    }
    var tds;
		if(this.fullScreen==true)
		{
			tds=$("#videoDiv td",window.parent.document);
		}
		else
		{
			tds=this.videoTd;
    }
    var newtd=$(obj).parent();
		var oldtd=$(this.oldPos).parent();
    //数组互换
    var oldData=this.controlScreen[this.oldIndex];
		this.controlScreen[this.oldIndex]=this.controlScreen[i];
    this.controlScreen[i]=oldData;
    //object互换
		newtd.append(this.oldPos);
    oldtd.append(obj);
    for(let i=0;i<tds.length;i++)
		{
			tds[i].style['border']='2px gray solid';
			
    }
		newtd.css("border","2px red solid");
		this.curr=parseInt(i);
  }


  oldPos;
	oldIndex;
	//获取移动之前的视频窗口
	getOldVideo(obj,index){
		this.oldPos=obj;	
		this.oldIndex=index;
	}

  OnRightButtonUp(event){
    let title = document.getElementById("rightButtonUp").title;
    let obj:any = document.getElementById(title);
    let i = title.substring(5);
    
    $("#listen").removeClass("tb13click");
		$("#record").removeClass("tb11click");
    $("#voice").removeClass("tb16click");

    obj.EndRecord();
		obj.EndVideo();
		obj.EndAudio();
    obj.EndTalk();
    
    if(this.controlScreen[i]!=null&&this.controlScreen[i].channel==2)
		{
			for(var j=0;j<this.total;j++)
			{
				if(this.controlScreen[j]!=null)
				{
					this.controlScreen[j].audio=null;		
				}
			}
    }
    if(this.controlScreen[i]!=null&&this.controlScreen[i].blue==true)
		{
			$($(".nubbox td")[i]).css("border","2px black solid");
		}
		this.controlScreen[i]=null;
    
  }

  //车辆菜单显示回调方法
  sidebarOnShow(event){
    this.iframeShow = true;
  }

  //车辆菜单隐藏回调方法
  sidebaronHide(event){
    this.iframeShow = false;
  }

  //云台控制
	controlPtz(name) {
		if(this.curr==-1&&name!="EndAll"&&name!="fullScreen")
		{
			this.showWarnMessage("请选择一个视频通道");
			return;
		}
		switch (name) {
		case "right":
			if(this.controlScreen[this.curr]==null)
			{
				this.showWarnMessage("该通道视频还未打开！");
				return;
			}
			if (this.controlScreen[this.curr].right == null) {
				this.controlScreen[this.curr].right = 1;
				$("#right").addClass("tb3click");
				//$("#record").removeClass("tb11");
				this.videoObj[this.curr].PtzRight();
				this.showWarnMessage("云台镜头向右转动");
			} else {
				$("#right").removeClass("tb3click");
				this.videoObj[this.curr].PtzStop();
				this.controlScreen[this.curr].right = null;
				this.showWarnMessage("云台镜头停止转动");
			}
			break;
		case "left":
			if(this.controlScreen[this.curr]==null)
			{
				this.showWarnMessage("该通道视频还未打开！");
				return;
			}
			if (this.controlScreen[this.curr].left == null) {
				this.controlScreen[this.curr].left = 1;
				$("#left").addClass("tb2click");
				//$("#record").removeClass("tb11");
        this.videoObj[this.curr].PtzLeft();
				this.showWarnMessage("云台镜头向左转动");
			} else {
				$("#left").removeClass("tb2click");
				this.videoObj[this.curr].PtzStop();
				this.controlScreen[this.curr].left = null;
				this.showWarnMessage("云台镜头停止转动");
			}
			break;
		// case "up":
		// 	if(controlScreen[curr]==null)
		// 	{
		// 		getMessage("该通道视频还未打开！");
		// 		return;
		// 	}
		// 	if (controlScreen[curr].up == null) {
		// 		controlScreen[curr].up = 1;
		// 		$("#up").addClass("tb0click");
		// 		//$("#record").removeClass("tb11");
		// 		$('.nubbox table object')[curr].PtzUp();
		// 		getMessage("云台镜头向上转动");
		// 	} else {
		// 		$("#up").removeClass("tb0click");
		// 		$('.nubbox table object')[curr].PtzStop();
		// 		controlScreen[curr].up = null;
		// 		getMessage("云台镜头停止转动");
		// 	}
		// 	break;
		// case "down":
		// 	if(controlScreen[curr]==null)
		// 	{
		// 		getMessage("该通道视频还未打开！");
		// 		return;
		// 	}
		// 	if (controlScreen[curr].down == null) {
		// 		controlScreen[curr].down = 1;
		// 		$("#down").addClass("tb1click");
		// 		//$("#record").removeClass("tb11");
		// 		$('.nubbox table object')[curr].PtzDown();
		// 		getMessage("云台镜头向下转动");
		// 	} else {
		// 		$("#down").removeClass("tb1click");
		// 		$('.nubbox table object')[curr].PtzStop();
		// 		controlScreen[curr].down = null;
		// 		getMessage("云台镜头停止转动");
		// 	}
		// 	break;
		// case "instart":
		// 	$("#in").addClass("tb8click");
		// 	$('.nubbox table object')[curr].PtzZoomOut();// .PtzZoomIn();
		// 	//PtzZoomSize(0)
		// 	getMessage("云台镜头调近");
		// 	break;
		// case "instop":
		// 		$("#in").removeClass("tb8click");
		// 		$('.nubbox table object')[curr].PtzStop();
		// 		getMessage("云台镜头停止转动");
		// 	break;
		// case "outstart":
		// 		$("#in").addClass("tb9click");
		// 		$('.nubbox table object')[curr].PtzZoomIn();  //.PtzZoomOut();
		// 		//PtzZoomSize(0)
		// 		getMessage("云台镜头调远");
		// 	break;
		// case "outstop":
		// 		$("#out").removeClass("tb9click");
		// 		$('.nubbox table object')[curr].PtzStop();
		// 		getMessage("云台镜头停止转动");
		// 	break;
		// case "stop":
		// 	getMessage("该设备未安装云台！");
		// 	$('.nubbox table object')[curr].EndVideo();
		// 	break;
		// case "start":
		// 	getMessage("该设备未安装云台！");
		// 	return;
		// 	$('.nubbox table object')[curr].BeginVideo2(controlScreen[curr].phone,
		// 			controlScreen[curr].channel,controlScreen[curr].name);
		// 	break;
		// case "voice":
		// 	if(controlScreen[curr]==null)
		// 	{
		// 		getMessage("该通道视频还未打开！");
		// 		return;
		// 	}
		// 	if (controlScreen[curr].talk == null) {
		// 		controlScreen[curr].talk = 1;
		// 		$("#voice").addClass("tb16click");
		// 		getMessage("开启对讲功能");
		// 		$('.nubbox table object')[curr].BeginTalk(controlScreen[curr].phone);
				
		// 	} else {
		// 		$("#voice").removeClass("tb16click");
		// 		$('.nubbox table object')[curr].EndTalk();
		// 		getMessage("关闭对讲功能");
		// 		controlScreen[curr].talk = null;
		// 	}
		// 	break;
		// case "photo":
		// 	if(controlScreen[curr]==null)
		// 	{
		// 		getMessage("该通道视频还未打开！");
		// 		return;
		// 	}
		// 	var fileUrl=controlScreen[curr].name+"_"+controlScreen[curr].channel+"_"+getDate()+".jpg";
		// 	var flag = $('.nubbox table object')[curr].CaptureToFile(
		// 			".\\"+fileUrl);
		// 	if (flag == 1) {
		// 		getMessage("抓拍失败");
		// 		//$("#message").fadeOut(1000);
		// 	}
		// 	if (flag == 0) {
				
		// 		getMessage("抓拍成功,文件名：桌面\\"+fileUrl+",如果文件不存在,请点击<font onmouseover='changeMouseStyle(this)' color='red' size='2' onclick='openHelp()'>帮助</font>");
		// 		recodeLog(controlScreen[curr].phone,controlScreen[curr].channel,"4",controlScreen[curr].name);
		// 	}
		// 	break;
		// case "listen":
			
		// 	if(controlScreen[curr]==null)
		// 	{
		// 		getMessage("该通道视频还未打开！");
		// 		return;
		// 	}
		// 	if (controlScreen[curr].audio == null) {
		// 		var flag=0;
		// 		for(var i=0;i<total;i++)
		// 		{
		// 			if(controlScreen[i]!=null&&controlScreen[curr].phone!=controlScreen[i].phone)
		// 			{
		// 				if(controlScreen[i].audio!=null)
		// 				{

		// 					if(controlScreen[i].channel==2)
		// 					{
		// 						$('.nubbox table object')[i].EndAudio();
		// 					}
		// 					controlScreen[i].audio=null;
		// 				}
		// 			}
		// 		}
		// 		for(i=0;i<total;i++)
		// 		{
		// 			if(controlScreen[i]!=null&&controlScreen[i].phone==controlScreen[curr].phone)
		// 			{
						
		// 				if(controlScreen[i].channel==2)
		// 				{
		// 					if(controlScreen[i].audio==null)
		// 					{
		// 						$('.nubbox table object')[i].BeginAudio();
		// 						controlScreen[i].audio=1;
		// 					}
		// 					getMessage("开启监听功能");
		// 					recodeLog(controlScreen[curr].phone,"2","5",controlScreen[curr].name);
		// 					flag=1;
		// 				}
		// 				controlScreen[i].audio=1;
		// 			}
		// 		}
		// 		if(flag==0)
		// 		{
		// 			if(controlScreen[curr].channel==2){
		// 				$('.nubbox table object')[curr].BeginAudio();
		// 			}else
		// 			{
		// 				$('.nubbox table object')[curr].EndVideo();
		// 				$('.nubbox table object')[curr].EndRecord();
		// 				$('.nubbox table object')[curr].beginVideo2(controlScreen[curr].phone,2,controlScreen[curr].name);
		// 				$('.nubbox table object')[curr].BeginAudio();
		// 				controlScreen[curr].audio = 1;
		// 				controlScreen[curr].channel=2;
						
		// 			}
		// 			getMessage("开启监听功能");
		// 			recodeLog(controlScreen[curr].phone,"2","5",controlScreen[curr].name);
		// 		}
				
		// 		controlScreen[curr].audio=1;
		// 		//$("#listen").removeClass("tb13");
		// 		$("#listen").addClass("tb13click");	
				
		// 	} else {
		// 		$("#listen").removeClass("tb13click");
		// 		//$("#listen").addClass("tb13");
		// 		for(var i=0;i<controlScreen.length;i++)
		// 		{
		// 			if(controlScreen[i]!=null&&controlScreen[i].phone==controlScreen[curr].phone)
		// 			{
		// 				if(controlScreen[i].channel==2)
		// 				{
		// 					$('.nubbox table object')[i].EndAudio();
		// 				}
		// 				controlScreen[i].audio=null;
		// 			}
		// 		}
		// 		controlScreen[curr].audio=null;
		// 		getMessage("关闭监听功能");
		// 	}
		// 	break;
		// case "EndAll":
		//    	 for(var i=0;i<total;i++)
		// 	 {
		// 		endVideo(i);
		// 	 }	
		// 	$("#listen").removeClass("tb13click");
		// 	//$("#listen").addClass("tb13");
		// 	$("#record").removeClass("tb11click");
			
		// 	$("#voice").removeClass("tb16click");
		// 	//$("#record").addClass("tb11");
		// 	 break;
		// case "fullScreen":
		// 	fullParentScreen();
		// 	break;
		// case "videoRecord":
		// 	if(controlScreen[curr]==null)
		// 	{
		// 		getMessage("该通道视频还未打开！");
		// 		return;
		// 	}
		// 	if (controlScreen[curr].record == null) {
		// 		controlScreen[curr].record = 1;
		// 		$("#record").addClass("tb11click");
		// 		//$("#record").removeClass("tb11");
		// 		var fileName=controlScreen[curr].name+"_"+controlScreen[curr].channel+"_"+getDate()+".H64";
		// 		getMessage("开始录像,文件名:桌面\\"+fileName+",如果文件不存在,请点击<font color='red' size='2' onclick='openHelp()' onmouseover='changeMouseStyle(this)'>帮助</font>");
		// 		$('.nubbox table object')[curr].BeginRecord(".\\"+fileName);		
		// 		recodeLog(controlScreen[curr].phone,controlScreen[curr].channel,"6",controlScreen[curr].name);	
		// 	} else {
		// 		$("#record").removeClass("tb11click");
		// 		//$("#record").addClass("tb11");
		// 		$('.nubbox table object')[curr].EndRecord();
		// 		controlScreen[curr].record = null;
		// 		getMessage("停止录像");
		// 	}
		}
	   
	}
  
  
}

function copyArr(arr) {
  let res = []
  for (let i = 0; i < arr.length; i++) {
   res.push(arr[i])
  }
  return res
}

//对象深拷贝
function deepCopy(p, c) {    
  var c = c || {};  
  for (var i in p) {    
      if(! p.hasOwnProperty(i)){    
          continue;    
      }    
      if (typeof p[i] === 'object') {    
          console.log("copy");
          c[i] = (p[i].constructor === Array) ? [] : {};    
          deepCopy(p[i], c[i]);    
      } else {    
          c[i] = p[i];    
      }    
  }    
  return c;    
}  

