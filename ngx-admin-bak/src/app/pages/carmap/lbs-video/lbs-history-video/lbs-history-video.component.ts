import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList, Renderer } from '@angular/core';
import { Observable } from 'rxjs';
import { Message} from 'primeng/primeng';
import { LbsTreeComponent } from '../../../demos/lbstree/lbstree.component';
import { isDate, isNullOrUndefined, isUndefined, isArray } from 'util';
import { PagesService } from 'app/pages/pages.service';

@Component({
  selector: 'lbs-video',
  templateUrl: './lbs-history-video.component.html',
  styleUrls: ['./lbs-history-video.component.scss']
})
export class LbsHistoryVideoComponent implements OnInit {

  serverIp: any;
  serverPort: any;
  phone: any;

  beginDate: Date;
  endDate: Date;
  beginTime: string;
  endTime: string;
  channels: string[] = ['1','2','3','4'];
  gpsCallBack: boolean;
  recordFlag: any;

  mySlider: number = 0;
  sliderDisabled: boolean = false;
  totalTime: number;
  currentDate: Date;
  playFlag: any = 0;
  pauseFlag: any = 0;
  timer: any;
  speed=0;
	fastFlag=0;
	slowFlag=0;

  alarmVideoFlag: boolean;

  playMsg: any;

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
  total: number = 4;
  //当前选中视频数
  curr: number = -1;
  videoTd: any[]=[];
  videoObj: any[]=[];
  rootNode: any;
  treeNode: any;

  msgs: Message[] = [];
  menuPopup: boolean = true;

  visibleSidebar2 = false;

  iframeShow = false;

  // @ViewChildren('myActiveX') myActiveX: QueryList<ElementRef>;

  @ViewChild('videoDiv') videoDiv: ElementRef;

  constructor(private elementRef: ElementRef, private renderer: Renderer, private pagesService: PagesService) {
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

  }

  private title: string;
  private display: boolean;

  ngOnInit() {

    this.initCalendar();

    this.initSlider();

    this.height = window.innerHeight*0.50;
    this.initVideoDiv(2,1);
    // 页面监听
　　Observable.fromEvent(window, 'resize')
　　.debounceTime(100) // 以免频繁处理
　　.subscribe((event:any) => {
　　　 // 这里处理页面变化时的操作
      this.height = event.target.innerHeight*0.50;
      this.initVideoDiv(this.divNum,this.firstNum);
　　});
    
    this.initVideoScript("video0","OnLeftButtonDown(param)","recordId");
  }

  ngAfterViewInit() {

    //IE10下监听OCX控件回调
    // let videoEle:any = document.getElementById("video0");
    // videoEle.attachEvent('OnLeftButtonDown', function(param){
    //   alert(param)
    // });
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    // this.destoryVideo();
  }

  phoneChange(phone) {
    this.treeNode.id = phone;
    console.log(this.treeNode);
  }

  initCalendar(){
    this.endDate = new Date(Date.now()-1200000);
    this.beginDate = new Date(Date.now()-1800000);
  }

  initVideoDiv(divSize,firstSize){

    this.firstNum=firstSize;
		this.divNum=divSize;
    var table=this.initTable(divSize, firstSize,this.height);
    var tableTd=table.getElementsByTagName('td');
    var videoObj = copyArr(this.videoObj);
    
    for(var i=0;i<tableTd.length;i++){
      this.initObject(tableTd[i],"video"+i);
    }
    //删除之前的视频表格
    if(this.videoDiv.nativeElement.hasChildNodes()){
      this.videoDiv.nativeElement.removeChild(this.videoDiv.nativeElement.getElementsByTagName("table")[0]);
    }
    //添加新的视频表格
    this.videoDiv.nativeElement.appendChild(table);

    this.videoTd=this.videoDiv.nativeElement.getElementsByTagName("td");
    this.videoObj=this.videoDiv.nativeElement.getElementsByTagName("object");
  }

  //初始化进度条
  initSlider(){
    this.totalTime=(this.endDate.getTime()-this.beginDate.getTime())/1000;//秒
    this.currentDate = this.beginDate;
  }

  addSlider(){
    setInterval(() => {
      this.timer = this.mySlider += 1;
      console.log("this.mySlider",this.mySlider);   
      }, 1000);
  }

  stopSlider(){
    if(this.timer){
      clearInterval(this.timer);
    }
  }

  //日历组件关闭时调用的回调函数
  calendarClose(){
    this.currentDate = this.beginDate;
  }

  //车辆菜单显示回调方法
  sidebarOnShow(event){
    this.iframeShow = true;
  }

  //车辆菜单隐藏回调方法
  sidebaronHide(event){
    this.iframeShow = false;
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

  //播放视频
  startVideo(){
    this.playMsg = " ";
    this.speed=0;
    if(isDate(this.beginDate)){
      this.beginTime = this.pagesService.formateDateToStr(this.beginDate);
      this.beginTime = replaceTime(this.beginTime);
    }else{
      alert("请输入开始时间！");
      return false;
    }
    if(!this.alarmVideoFlag){
      if(isDate(this.endDate)){
        this.endTime = this.pagesService.formateDateToStr(this.endDate);
        this.endTime = replaceTime(this.endTime);
      }else{
        alert("请输入结束时间！");
        return false;
      }
    }
    if(!this.alarmVideoFlag){
      if(this.beginDate.getTime()>this.endDate.getTime()){
        alert("开始时间不能大于结束时间！");
        return false;
      }
      if(((new Date()).getTime()-this.endDate.getTime())<1200000){
        alert("结束时间需为当前时间二十分钟前！");
        return false;
      }
    }
    
    if(this.playFlag==0){
      $("#pause").removeClass("tb1");
      $("#pause").addClass("tb3");
      $("#start").removeClass("tb1");
      $("#start").addClass("tb9");
      this.playFlag=1;
      
      if(!this.gpsCallBack){
        // loadData(keyId,$("#calendar").val(),$("#calendar2").val());
      }
      if(isArray(this.channels)){
        for(var i = 0; i < this.channels.length; i++){
          var connectflag=this.videoObj[i].Connect(this.serverIp,this.serverPort);
          if(connectflag==0){
            if(this.alarmVideoFlag){
              var playflag=this.videoObj[i].BeginAlarmVideo(this.phone,this.beginTime,this.channels[i]);
            }else{
              var playflag= this.videoObj[i].BeginRemoteRecVideo(this.phone,this.channels[i],this.beginTime,this.endTime);
              console.log("this.phone,this.channels[i],this.beginTime,this.endTime",this.phone,this.channels[i],this.beginTime,this.endTime);
            }
            // this.addSlider();
            // videoArray.push("video"+videoId);
            // channels+=channelArrays[i]+",";
          }
        }
        
        // if("${alarmVideoFlag}"=="true"){
        //   recodeLog(phone,channels,"9");
        // }else{
        //   recodeLog(phone,channels,"0");
        // }
        
        // mySlider.enable();
      }else{
        alert("请选择视频通道！");
      }
      
      //setTimeout(recodeHisVideo, 5000);
      
      
    }else{
      this.recordFlag=0;
      this.playFlag=0;
      this.endRemoteRecVideo();
      $("#pause").removeClass("tb1");
      $("#pause").addClass("tb3");
      $("#start").removeClass("tb9");
      $("#start").addClass("tb1");
    }
    
  }

  //暂停视频
  pauseVideo(event){
    this.playMsg = " ";
    if(this.pauseFlag==0){
      this.pauseFlag=1;
      $("#pause").removeClass("tb3");
      $("#pause").addClass("tb1");
      this.videoObj[0].SetRemoteSpeed(1,0);
    }else{
      this.pauseFlag=0;
      $("#pause").removeClass("tb1");
      $("#pause").addClass("tb3");
      this.videoObj[0].SetRemoteSpeed(0,0);
    }   
  }

  //快进,慢放
  speedUpVideo(speedUpFlag){
    if(speedUpFlag==3){
      if(this.speed<4){
        this.speed++;
      }
    }else{
      if(-4<this.speed){
        this.speed--;
      }
    }
    if(this.returnNumBack(this.speed)>0){
      var sp=this.returnNumBack(this.speed);
      
      if(sp==1){
        this.playMsg = "原速播放";
      }else{
        this.playMsg = "快进倍速X"+Math.pow(2,sp-1);
      }

      this.videoObj[0].SetRemoteSpeed(3,parseInt(sp));
    }else{
      
      var sp2=Math.abs(this.returnNumBack(this.speed));
      this.playMsg = "慢放倍速X"+Math.pow(2,sp2-1);
      this.videoObj[0].SetRemoteSpeed(4,sp2);
    }  
  }

  //结束视频
  endRemoteRecVideo(){
    // clearMap();
    // $("#currentSlider").html($("#calendar").val());
    // mySlider.setValue(0);
    // mySlider.disable();
    var flag =1;//  1表示暂停播放录像；0表示恢复播放录像
    for(var i=0;i<this.channels.length; i++){
      if(this.alarmVideoFlag){
        this.videoObj[i].EndAlarmVideo();//结束紧急视频
      }else{
        this.videoObj[i].EndRemoteRecVideo();  //结束历史视频
      }
      // this.stopSlider();
    }

  }

  returnNumBack(num){
    if(num<-4){
      return -5;
    }else if(num<0){
      if(num==-1){
        return -2;
      }else{
        return num-1;
      }
    }else if(num==0){
      return 1;
    }else if(num>0){
      if(num <=4){
        if(num==1){
          return 2;
        }else{
          return num+1;
        }
      }else{
        return 5;
      }
    }
  }

  takePic(){
    
  }

  OnLeftButtonDown(event){
    let innerHTML = document.getElementById("recordId").innerHTML;
    let title = document.getElementById("recordId").title;
    console.log("innerHTML",innerHTML);
    console.log("title",title);
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
		// var tds=$(".nubbox td");
		// for(var i=0;i<total;i++)
		// {
		// 	if(controlScreen[i]!=null&&controlScreen[i].blue==true)
		// 	{
		// 		$(tds[i]).css("border","2px blue solid");
		// 	}else
		// 	{
		// 		$(tds[i]).css("border","2px black solid");
		// 	}
		// }
		// $($(".nubbox td")[index]).css("border","2px red solid");
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
    this.startVideo();
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

    let video:any = document.getElementById("MyActiveX1");  
    video.connect("202.102.112.17", "2290");
    video.BeginRemoteRecVideo("64806303074", "1", "180308094926", "180308095926");
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
    param.value = "opaque";
    activeObject.appendChild(param);
    obj.appendChild(activeObject);
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

function replaceTime(reTime){//日期转换
  reTime=reTime.replace(/\-/g,"");
  reTime=reTime.replace(/\:/g,"");
  reTime=reTime.replace(/[ ]/g,"");
  //alert(reTime.substring(2,reTime.length));
  return reTime.substring(2,reTime.length)
}



