import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'lbs-alarm-search',
  templateUrl: './lbs-alarm-search.component.html',
  styleUrls: ['./lbs-alarm-search.component.scss']
})
export class LbsAlarmSearchComponent implements OnInit {

  constructor() {
    this.carNo = '车牌号';
    this.alarmType = '报警类型';
  }
  private carNo: string;
  private alarmType: string;
  ngOnInit() {
  }

}
