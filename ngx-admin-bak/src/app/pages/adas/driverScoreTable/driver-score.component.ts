import { Component } from '@angular/core';
import { Button, DataTable, SelectItem, Dialog } from 'primeng/primeng';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { OnInit, ViewChild, OnDestroy, SimpleChange, Input } from '@angular/core';
import { DriverDataInfo } from 'app/pages/carCharts/driverScoreTable/driverData';
import { LbsTreeComponent } from 'app/pages/common-util/lbstree/lbstree.component';
import { isDate, isNullOrUndefined, isUndefined } from 'util';
import { PagesService } from 'app/pages/pages.service';
@Component({
  selector: 'driver-score',
  styleUrls: ['./driver-score.component.scss'],
  templateUrl: './driver-score.component.html',
})

export class DriverScoreComponent implements OnInit {

  // alarmList: SelectItem[];
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
  driverDataInfo: DriverDataInfo;
  cols: any[];
  detailDisplay = false;
  driverDetail = [];
  //年月选择
  yearList: SelectItem[];
  selectedYear: { yearType: string, code: string };
  defaultYear: any;
  monthList: SelectItem[];
  selectedMonth: { monthType: string, code: string };
  defaultMonth: any;
  paramYearMonth: any;
  //条件
  searchdriverName: any;
  searchGroupId: any;
  queryKeyIds = '';

  @ViewChild('dt') dt: DataTable;
  @ViewChild('lbstree') lbstree: LbsTreeComponent;
  constructor(
    private http: Http, private httpclient: HttpClient, private pagesService: PagesService) {
    this.cols = [];

    this.yearList = [
      { label: '2012年', value: { id: 1, yearType: '2012年', code: '11' } },
      { label: '2013年', value: { id: 2, yearType: '2013年', code: '12' } },
      { label: '2014年', value: { id: 3, yearType: '2014年', code: '13' } },
      { label: '2015年', value: { id: 4, yearType: '2015年', code: '14' } },
      { label: '2016年', value: { id: 5, yearType: '2016年', code: '15' } },
      { label: '2017年', value: { id: 6, yearType: '2017年', code: '16' } },
      { label: '2018年', value: { id: 7, yearType: '2018年', code: '17' } },
      { label: '2019年', value: { id: 8, yearType: '2019年', code: '18' } }
    ];
    this.selectedYear = { yearType: (new Date().getFullYear()) + '年', code: (new Date().getFullYear() - 2001) + '' };
    this.defaultYear = new Date().getFullYear() + '年';
    this.monthList = [
      { label: '1月', value: { id: 1, monthType: '1月', code: '21' } },
      { label: '2月', value: { id: 2, monthType: '2月', code: '22' } },
      { label: '3月', value: { id: 3, monthType: '3月', code: '23' } },
      { label: '4月', value: { id: 4, monthType: '4月', code: '24' } },
      { label: '5月', value: { id: 5, monthType: '5月', code: '25' } },
      { label: '6月', value: { id: 6, monthType: '6月', code: '26' } },
      { label: '7月', value: { id: 7, monthType: '7月', code: '27' } },
      { label: '8月', value: { id: 8, monthType: '8月', code: '28' } },
      { label: '9月', value: { id: 9, monthType: '9月', code: '29' } },
      { label: '10月', value: { id: 10, monthType: '10月', code: '30' } },
      { label: '11月', value: { id: 11, monthType: '11月', code: '31' } },
      { label: '12月', value: { id: 12, monthType: '12月', code: '32' } }
    ];
    this.selectedMonth = { monthType: (new Date().getMonth() + 1) + '月', code: new Date().getMonth() + 21 + '' };
    this.defaultMonth = new Date().getMonth() + 1 + '月';
  }
  //选择分组
  showDepartment() {

  }

  //查询按钮
  searchAlarm() {
    // this.getKeyIdFromTree();

    if (this.selectedMonth.monthType.length == 2) {
      this.paramYearMonth = this.selectedYear.yearType.substr(0, 4) + '-' + '0' + this.selectedMonth.monthType.substr(0, 1);
    } else if (this.selectedMonth.monthType.length == 3) {
      this.paramYearMonth = this.selectedYear.yearType.substr(0, 4) + '-' + this.selectedMonth.monthType.substr(0, 2);
    }
    // this.startTime = this.pagesService.formateStrToDateStr(this.begindate.getFullYear(), this.begindate.getMonth() + 1, this.begindate.getDate());
    // this.endTime = this.pagesService.formateStrToDateStr(this.enddate.getFullYear(), this.enddate.getMonth() + 1, this.enddate.getDate());

    if (this.searchCarNo == undefined) {
      this.searchCarNo = '';
    }

    if (this.searchdriverName == undefined) {
      this.searchdriverName = '';
    }
    const params = new HttpParams().set('driverName', this.searchdriverName).set('time', this.paramYearMonth)
      .set('keyIdList', this.queryKeyIds);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getAlarmEvaluation',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.alarmData = data;
      });
  }
  //弹出 查看详情
  showDetial(driverDataInfo: DriverDataInfo) {
    this.detailDisplay = true;
    this.driverDataInfo = driverDataInfo;

    this.driverDetail = [{
      1: '超速', 2: '8', 3: this.driverDataInfo.ALARM_501_NO, 4: this.driverDataInfo.ALARM_501_NO_L2, 5: this.driverDataInfo.ALARM_501_NO_100,
      6: this.driverDataInfo.ALARM_501_NO_L2_100, 7: this.driverDataInfo.ALARM_501_NO_SCORE, 8: this.driverDataInfo.SURROUND_501_RATE, 9: this.driverDataInfo.COMPANY_501_SCORE_COUNT
    },
    {
      1: '前向碰撞', 2: '15', 3: this.driverDataInfo.ALARM_502_NO, 4: this.driverDataInfo.ALARM_502_NO_L2, 5: this.driverDataInfo.ALARM_502_NO_100,
      6: this.driverDataInfo.ALARM_502_NO_L2_100, 7: this.driverDataInfo.ALARM_502_NO_SCORE, 8: this.driverDataInfo.SURROUND_502_RATE, 9: this.driverDataInfo.COMPANY_502_SCORE_COUNT
    },
    {
      1: '车道偏离', 2: '8', 3: this.driverDataInfo.ALARM_503_NO, 4: this.driverDataInfo.ALARM_503_NO_L2, 5: this.driverDataInfo.ALARM_503_NO_100,
      6: this.driverDataInfo.ALARM_503_NO_L2_100, 7: this.driverDataInfo.ALARM_503_NO_SCORE, 8: this.driverDataInfo.SURROUND_503_RATE, 9: this.driverDataInfo.COMPANY_503_SCORE_COUNT
    },
    {
      1: '车距过近', 2: '8', 3: this.driverDataInfo.ALARM_504_NO, 4: this.driverDataInfo.ALARM_504_NO_L2, 5: this.driverDataInfo.ALARM_504_NO_100,
      6: this.driverDataInfo.ALARM_504_NO_L2_100, 7: this.driverDataInfo.ALARM_504_NO_SCORE, 8: this.driverDataInfo.SURROUND_504_RATE, 9: this.driverDataInfo.COMPANY_504_SCORE_COUNT
    },
    {
      1: '疲劳驾驶', 2: '15', 3: this.driverDataInfo.ALARM_505_NO, 4: this.driverDataInfo.ALARM_505_NO_L2, 5: this.driverDataInfo.ALARM_505_NO_100,
      6: this.driverDataInfo.ALARM_505_NO_L2_100, 7: this.driverDataInfo.ALARM_505_NO_SCORE, 8: this.driverDataInfo.SURROUND_505_RATE, 9: this.driverDataInfo.COMPANY_505_SCORE_COUNT
    },
    {
      1: '分神驾驶', 2: '15', 3: this.driverDataInfo.ALARM_506_NO, 4: this.driverDataInfo.ALARM_506_NO_L2, 5: this.driverDataInfo.ALARM_506_NO_100,
      6: this.driverDataInfo.ALARM_506_NO_L2_100, 7: this.driverDataInfo.ALARM_506_NO_SCORE, 8: this.driverDataInfo.SURROUND_506_RATE, 9: this.driverDataInfo.COMPANY_506_SCORE_COUNT
    },
    {
      1: '接打电话', 2: '8', 3: this.driverDataInfo.ALARM_507_NO, 4: this.driverDataInfo.ALARM_507_NO_L2, 5: this.driverDataInfo.ALARM_507_NO_100,
      6: this.driverDataInfo.ALARM_507_NO_L2_100, 7: this.driverDataInfo.ALARM_507_NO_SCORE, 8: this.driverDataInfo.SURROUND_507_RATE, 9: this.driverDataInfo.COMPANY_507_SCORE_COUNT
    },
    {
      1: '抽烟', 2: '8', 3: this.driverDataInfo.ALARM_508_NO, 4: this.driverDataInfo.ALARM_508_NO_L2, 5: this.driverDataInfo.ALARM_508_NO_100,
      6: this.driverDataInfo.ALARM_508_NO_L2_100, 7: this.driverDataInfo.ALARM_508_NO_SCORE, 8: this.driverDataInfo.SURROUND_508_RATE, 9: this.driverDataInfo.COMPANY_508_SCORE_COUNT
    },
    {
      1: '驾驶员异常', 2: '15', 3: this.driverDataInfo.ALARM_509_NO, 4: this.driverDataInfo.ALARM_509_NO_L2, 5: this.driverDataInfo.ALARM_509_NO_100,
      6: this.driverDataInfo.ALARM_509_NO_L2_100, 7: this.driverDataInfo.ALARM_509_NO_SCORE, 8: this.driverDataInfo.SURROUND_509_RATE, 9: this.driverDataInfo.COMPANY_509_SCORE_COUNT
    },
    { 1: '合计', 2: '100', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' }];
  }

  //获取keyId集合
  // getKeyIdFromTree() {
  //   this.queryKeyIds = '';
  //   let nodeArray = new Array();
  //   nodeArray = this.lbstree.getAllcheckedNode();
  //   if (nodeArray.length > 0) {
  //     let keyIds = '';
  //     nodeArray.forEach((checkedNode) => {
  //       if (checkedNode.iconSkin !== 'm' && checkedNode.iconSkin !== 't') {
  //         keyIds += "" + checkedNode.id + ",";
  //       }
  //     });
  //     keyIds = keyIds.substring(0, keyIds.length - 1);
  //     this.queryKeyIds = keyIds;
  //   }
  // }

  ngOnInit() {
    this.cols = [
      { field: 'D_NAME', header: '驾驶员', sort: false },
      { field: 'TOTALMILEAGE', header: '里程', sort: false },
      { field: 'TOTALTIME', header: '用时', sort: false },
      { field: 'ALARM_COUNT', header: '报警次数', sort: false },
      { field: 'ALARM_COUNT_NO_AVG', header: '百公里加权报警次数', sort: false },
      { field: 'SCORE_COUNT', header: '得分', sort: false },
      { field: 'SURROUND_RATE', header: '环比', sort: false },
      { field: 'COMPANY_SCORE_COUNT', header: '公司平均得分', sort: false }
    ];
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

    this.begindate = new Date(2017, 11, 24);
    const nowYear = new Date().getFullYear();
    const nowMonth = new Date().getMonth();

    //数据接收
    if (nowMonth < 10) {
      this.paramYearMonth = nowYear + '-' + '0' + (nowMonth + 1);
    } else {
      this.paramYearMonth = nowYear + '' + '-' + (nowMonth + 1);
    }

    const params1 = new HttpParams().set('time', this.paramYearMonth);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getAlarmEvaluation',
      {
        responseType: 'json', params: params1,
      })
      .subscribe(data => {
        this.alarmData = data;
      });
  }

}
