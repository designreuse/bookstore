import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lbs-alarm',
  templateUrl: './lbs-alarm.component.html',
  styleUrls: ['./lbs-alarm.component.scss']
})
export class LbsAlarmComponent implements OnInit {

  constructor() { }

  private title: string;
  private display: boolean;

  ngOnInit() {
    this.title = '报警警示栏';
    this.display = true;
  }

}
