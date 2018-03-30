import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'lbs-alarm-table',
  templateUrl: './lbs-alarm-table.component.html',
  styleUrls: ['./lbs-alarm-table.component.scss']
})
export class LbsAlarmTableComponent implements OnInit {

  constructor() { }
  alarmStartTime = '报警开始时间';
  duration = '持续时间';
  carNo = '车牌号码';
  carPlateColor = '车牌颜色';
  alarmType = '报警类型';
  speed = '速度(km/h)';
  cancelAlarm = '取消报警';
  remarks = '备注信息';
  ngOnInit() {
  }

}
