import { AfterViewInit, Component, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
import {SelectItem} from 'primeng/primeng';
import { LbsTreeComponent } from 'app/pages/demos/lbstree/lbstree.component';
import { CarTreeComponent } from 'app/pages/lbs-common/car-tree/car-tree.component';
import { CarInfoData } from './car';
import 'style-loader!angular2-toaster/toaster.css';
import { GroupTreeComponent } from 'app/pages/lbs-common/group-tree/group-tree.component';
@Component({
  selector: 'alarm-type-pie',
  templateUrl: './alarm-type-pie.component.html',
})
export class AlarmTypePieComponent implements OnInit, AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  @ViewChild('lbstree') lbstree: LbsTreeComponent;
  @ViewChild('carTree') carTree: CarTreeComponent;
  @ViewChild('groupTree') groupTree: GroupTreeComponent;

  constructor(private theme: NbThemeService, private http: Http, private httpclient: HttpClient) {
    this.pieAlarmList=[
      {label:'全选', value:{id:0, pieAlarmType: '全选', code: '0'}},
      {label:'超速', value:{id:1, pieAlarmType: '超速', code: '1'}},
      {label:'疲劳', value:{id:2, pieAlarmType: '疲劳', code: '2'}},
      {label:'凌晨开车', value:{id:3, pieAlarmType: '凌晨开车', code: '3'}},
      {label:'主动安全防控', value:{id:4, pieAlarmType: '主动安全防控', code: '4'}}
    ];
    this.choseList = [
      { label: '按年', value: { id: 2, choseType: '按年', code: '1' } },
      { label: '按月', value: { id: 1, choseType: '按月', code: '2' } },
    ];
    this.yearList = [
      { label: '2012年', value: { id: 1, yearType: '2012年', code: '2012' } },
      { label: '2013年', value: { id: 2, yearType: '2013年', code: '2013' } },
      { label: '2014年', value: { id: 3, yearType: '2014年', code: '2014' } },
      { label: '2015年', value: { id: 4, yearType: '2015年', code: '2015' } },
      { label: '2016年', value: { id: 5, yearType: '2016年', code: '2016' } },
      { label: '2017年', value: { id: 6, yearType: '2017年', code: '2017' } },
      { label: '2018年', value: { id: 7, yearType: '2018年', code: '2018' } },
      { label: '2019年', value: { id: 8, yearType: '2019年', code: '2019' } },
    ];
    this.monthList = [
      { label: '1月', value: { id: 1, monthType: '01月', code: '01' } },
      { label: '2月', value: { id: 2, monthType: '02月', code: '02' } },
      { label: '3月', value: { id: 3, monthType: '03月', code: '03' } },
      { label: '4月', value: { id: 4, monthType: '04月', code: '04' } },
      { label: '5月', value: { id: 5, monthType: '05月', code: '05' } },
      { label: '6月', value: { id: 6, monthType: '06月', code: '06' } },
      { label: '7月', value: { id: 7, monthType: '07月', code: '07' } },
      { label: '8月', value: { id: 8, monthType: '08月', code: '08' } },
      { label: '9月', value: { id: 9, monthType: '09月', code: '09' } },
      { label: '10月', value: { id: 10, monthType: '10月', code: '10' } },
      { label: '11月', value: { id: 11, monthType: '11月', code: '11' } },
      { label: '12月', value: { id: 12, monthType: '12月', code: '12' } },
    ];

    this.selectedChoice = { choseType: '按月', code: '2' };
    this.defaultChoice = '按月';
    this.selectedMonth = { monthType: (new Date().getMonth() + 1) + '月', code: add0(new Date().getMonth() + 1) + '' };
    this.defaultMonth = new Date().getMonth() + 1 + '月';
    this.selectedYear = { yearType: (new Date().getFullYear()) + '年', code: new Date().getFullYear() + '' };
    this.defaultYear = new Date().getFullYear() + '年';

  }
  //查询条件
  searchdriverName: string;
  pieAlarmList: SelectItem[];
  pieAlarmChoice : {pieAlarmType: string,code: string};
  choseCarNo: string;
  choseGroupName: string;
  //树tree
  nodes = [];
  private car: any = {};
  //
  carTreeDisplay=false;
  groupTreeDisplay = false;
  resultData: any;
  alarmNameArr = [];
  alarmCountArr = [];
  choseList: SelectItem[];
  yearList: SelectItem[];
  monthList: SelectItem[];
  selectedChoice: { choseType: string, code: string };
  selectedYear: { yearType: string, code: string };
  selectedMonth: { monthType: string, code: string };
  defaultMonth: any;
  defaultChoice: any;
  defaultYear: any;
  changeType(selectedChoice) {
    if (selectedChoice.code == '1') {
      document.getElementById("searchByMonth").style.visibility = "hidden";
    } else {
      document.getElementById("searchByMonth").style.visibility = "visible";
    }
  }

  //下一月
  addMonth() {
    if (this.selectedMonth.monthType != '12月') {
      const monthCode = parseInt(this.selectedMonth.code) + 1
      const afterAddMonth = monthCode + '月';
      const fmtAfterAddMonth = afterAddMonth.length == 2 ? '0' + afterAddMonth : afterAddMonth;
      const fmtAfterAddMonthCode = monthCode < 9 ? '0' + monthCode : '' + monthCode;
      this.selectedMonth = { monthType: fmtAfterAddMonth, code: fmtAfterAddMonthCode };
      this.defaultMonth = afterAddMonth;
    } else {
      this.selectedMonth = { monthType: '1月', code: '01' };
      this.defaultMonth = '1月';
      const selectedYearType = parseInt(this.selectedYear.code) + 1 + '年';
      const selectedYearCode = parseInt(this.selectedYear.code) + 1 + '';
      this.selectedYear = { yearType: selectedYearType, code: selectedYearCode };
      const yy = this.selectedYear.yearType;
      this.defaultYear = yy;
    }
  }
  //上一月
  minusMonth() {
    if (this.selectedMonth.monthType != '1月') {
      const monthCode = parseInt(this.selectedMonth.code) - 1;
      const afterMinusMonth = monthCode + '月';
      const fmtAfterMinusMonth = afterMinusMonth.length == 2 ? '0' + afterMinusMonth : afterMinusMonth;
      const fmtAfterMinusMonthCode = monthCode < 9 ? '0' + monthCode : '' + monthCode;
      this.selectedMonth = { monthType: fmtAfterMinusMonth, code: fmtAfterMinusMonthCode };
      this.defaultMonth = afterMinusMonth;
    } else {
      this.selectedMonth = { monthType: '12月', code: '32' };
      this.defaultMonth = '12月';
    }
  }

  //查询方法
  searchPie() {
    this.getResultData();
  }

  ngOnInit() {
    // this.nodes = this.carTree.getNodes();
    this.getResultData();
  }

  showCars()
  {
    this.carTreeDisplay = true;
  }
  showDepartment()
  {
    this.groupTreeDisplay = true;
  }
  confirm(){
    this.carTreeDisplay = false;
    this.car.carno = this.carTree.getCarNo();
    this.choseCarNo = this.car.carno;
  }
  reset2() {
    this.carTreeDisplay = false;
  }

  confirmGroup(){
    this.groupTreeDisplay = false;
    this.choseGroupName = this.groupTree.getGroupName();
  }
  resetGroup(){
    this.groupTreeDisplay = false;
  }

  ngAfterViewInit() {

  }
  //获取数据 data:[[1,'a'],[2,'b'],...] this.alarmNameArr:['a','b',...] this.alarmCountArr:[{value:1,name:'a'},{value:2,name:'b'},...]
  getResultData() {
    let searchTime = '';
    if (this.selectedChoice.code == '1') {
      searchTime = this.selectedYear.code
    } else {
      searchTime = this.selectedYear.code + "" + this.selectedMonth.code
    }
    const params = new HttpParams().set('dateType', this.selectedChoice.code)
      .set('searchTime', searchTime).set('groupIdList', "");
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getAlarmPicDateCountInfo',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        if (data != null) {
          this.resultData = data;
          this.alarmNameArr = [];
          this.alarmCountArr = [];
          for (let i = 0; i < this.resultData.length; i++) {
            this.alarmNameArr.push(this.resultData[i][0]);
            this.alarmCountArr.push({ value: this.resultData[i][1], name: this.resultData[i][0] });
          }
          this.getPieData();
        }
      });
  }


  //初始化step.3 定义饼状图参数
  getPieData() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.alarmNameArr,
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: this.alarmCountArr,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    if(this.themeSubscription !== undefined && this.themeSubscription !== null) {
      this.themeSubscription.unsubscribe();
    }
  }
}

function add0(m) {
  return m < 10 ? '0' + m : m;
}