import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { OnInit, ViewChild, OnDestroy, SimpleChange, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { PagesService } from 'app/pages/pages.service';
@Component({
  selector: 'driver-report',
  styleUrls: ['./driver-report.component.scss'],
  templateUrl: './driver-report.component.html',
})

export class DriverReportComponent implements OnInit {

  settings = {
    columns: {
      // driverName:{
      //   title: '姓名',
      //   type: 'string',
      // },
      CAR_DRIVER_PHONE: {
        title: '手机号',
        type: 'string',
      },
      CAR_NO: {
        title: '车牌号',
        type: 'string',
      },
      alarmName: {
        title: '报警类型',
        type: 'string',
      },
      NUM: {
        title: '报警数量',
        type: 'string',
      },
    },
    pager: {
      perPage: 5,
    },
    hideSubHeader: true,
    actions: {
      columnTitle: null,
      edit: false,
      delete: false,
      position: 'right',
    },
  };

  source: LocalDataSource = new LocalDataSource();
  alarmList: SelectItem[];
  selectedAlarm: { alarmType: string, code: string };
  //
  // alarmTypeToArray:{code:string,name:string};
  // alarmArray = new Map();
  private alarmData: any;
  private begindate: Date;
  private enddate: Date;
  cn: any;
  searchCarNo: string;
  searchName: string;
  startTime: string;
  endTime: string;
  alarmTypes = new Array;

  // alarmList: Alarm[];
  constructor(
    private http: Http, private httpclient: HttpClient,private pagesService: PagesService ) {
    this.alarmList = [
      { label: '报警类型', value: { id: 1, alarmType: '报警类型', code: '0' } },
    ];
  }

  //查询按钮
  searchAlarm() {
    this.startTime = this.pagesService.formateDateToStr(this.begindate);
    this.endTime = this.pagesService.formateDateToStr(this.enddate);
    if (this.selectedAlarm == undefined) {
      this.selectedAlarm = { alarmType: '报警类型', code: '-1' };
    }
    if (this.startTime == null) {
      this.startTime = '';
    }
    if (this.endTime == null) {
      this.endTime = '';
    }
    if (this.searchCarNo == undefined) {
      this.searchCarNo = '';
    }
    if (this.searchName == undefined) {
      this.searchName = '';
    }

    const params = new HttpParams().set('driverName', this.searchName).set('carNo', this.searchCarNo).set('alarmType', this.selectedAlarm.code).
      set('startTime', this.startTime).set('endTime', this.endTime);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getDriverAlarmInfo',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.alarmData = data;
        if (this.alarmData.length == 0) {
          this.alarmData = [
            { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
            { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
            { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
            { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
            { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
          ];
        }
        this.source.load(this.alarmData);
      });
  }

  ngOnInit() {
    this.alarmData = [
      { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
      { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
      { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
      { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
      { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
    ];
    this.source.load(this.alarmData);
    // 初始化时间
    this.cn = {
      firstDayOfWeek: 0,
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
      today: '今天',
      clear: '清除',
    }
    this.begindate = new Date(2017, 11, 24, 11, 30, 0);
    this.pagesService.formateDateToStr(this.begindate);
    this.enddate = new Date(2017, 11, 24, 11, 59, 59);
    this.pagesService.formateDateToStr(this.enddate);

    //初始化下拉框
    const params = new HttpParams();
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getAlarmType',
      {
        responseType: 'json', params,
      })
      .subscribe((data: any) => {
        this.alarmTypes = data;
        for (let i = 0; i < this.alarmTypes.length; i++) {
          this.alarmList.push({
            label: this.alarmTypes[i].name,
            value: { id: i + 2, alarmType: this.alarmTypes[i].name, code: this.alarmTypes[i].alarmType }
          });
          //键值对应
          // this.alarmArray.set(this.alarmTypes[i].alarmType,this.alarmTypes[i].name);
        }
        // this.alarmArray.set('-1','报警总数');
      });


    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getDriverAlarmInfo',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.alarmData = data;
        if (this.alarmData.length == 0) {
          this.alarmData = [
            { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
            { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
            { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
            { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
            { CAR_DRIVER_PHONE: '', ALARM_TYPE: '', CAR_NO: '', NUM: '' },
          ];
        }
        this.source.load(this.alarmData);
      });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('确定要删除吗？')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
