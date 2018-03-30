import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList, Renderer } from '@angular/core';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'lbs-video',
  templateUrl: './lbs-video.component.html',
  styleUrls: ['./lbs-video.component.scss']
})
export class LbsVideoDemoComponent implements OnInit {

  serverIp: any;
  serverPort: any;
  phone: any;

  selectedCameras: string[] = [];
  msgs: Message[] = [];

  @ViewChildren('myActiveX') myActiveX: QueryList<ElementRef>;

  constructor(private renderer: Renderer) {
    this.serverIp = "202.102.112.17";
    this.serverPort = "2290";
    this.phone = "64806302941";

  }

  private title: string;
  private display: boolean;

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    console.log(this.myActiveX);
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

  onConnect(){
    connect(this.myActiveX,this.serverIp,this.serverPort);
  }

  onDisConnect(){
    disConnect(this.myActiveX);
  }

  onBeginVideo(){
    beginVideo(this.myActiveX,this.phone);
  }

  onEndVideo(){
    endVideo(this.myActiveX);
  }
}

function connect(obj,serverIp,serverPort){
  if (serverIp!="" && serverPort !="") {
    obj.forEach((item) => {
      item.nativeElement.Connect(serverIp,serverPort);
    });
  }
}

function disConnect(obj) {
  obj.forEach((item) => {
    item.nativeElement.EndVideo();
    item.nativeElement.Disconnect();
  });
}

function beginVideo(obj,phone) {
  if (phone !="") {
    obj.forEach((item,index) => {
      item.nativeElement.BeginVideo(phone,index+1);
    });
  }
}

function endVideo(obj) {
  obj.forEach((item) => {
    item.nativeElement.EndVideo();
  });
}


