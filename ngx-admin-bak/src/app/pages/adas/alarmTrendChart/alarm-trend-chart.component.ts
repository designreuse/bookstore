import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { SelectItem } from 'primeng/primeng';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
import { CarInfoData, AlarmType } from './car';
import 'style-loader!angular2-toaster/toaster.css';
import { CarTreeComponent } from 'app/pages/lbs-common/car-tree/car-tree.component';
import { GroupTreeComponent } from 'app/pages/lbs-common/group-tree/group-tree.component';
import { LbsTreeComponent } from 'app/pages/common-util/lbstree/lbstree.component';

@Component({
  selector: 'alarm-trend-chart',
  styleUrls: ['./alarm-trend-chart.component.scss'],
  templateUrl: './alarm-trend-chart.component.html',

})
export class AlarmTrendChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('carTree') carTree: CarTreeComponent;
  @ViewChild('groupTree') groupTree: GroupTreeComponent;
  @ViewChild('lbstree') lbstree: LbsTreeComponent;
  constructor(private theme: NbThemeService, private http: Http, private httpclient: HttpClient) {
    this.choseList = [
      { label: '按年', value: { id: 2, choseType: '按年', code: '1' } },
      { label: '按月', value: { id: 1, choseType: '按月', code: '2' } },
      { label: '按周', value: { id: 1, choseType: '按周', code: '3' } }
    ];
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

    this.selectedChoice = { choseType: '按月', code: '2' };
    this.defaultChoice = '按月';
    this.selectedMonth = { monthType: (new Date().getMonth() + 1) + '月', code: new Date().getMonth() + 21 + '' };
    this.defaultMonth = new Date().getMonth() + 1 + '月';
    this.selectedYear = { yearType: (new Date().getFullYear()) + '年', code: (new Date().getFullYear() - 2001) + '' };
    this.defaultYear = new Date().getFullYear() + '年';
    this.defaultWeek = '第1周';
    this.isShowMonth = 0;
    this.isShowWeek = 1;
    this.searchdriverName = '';

  }
  //饼状数据
  alarmNameArr = [];
  alarmCountArr = [];
  carTreeDisplay = false;
  private car: any = {};
  chosePieCarNo: string;
  choseTrendCarNo: string;
  //查询条件
  searchdriverName: string;
  searchGroupName: string;
  groupTreeDisplay = false;
  selectedAlarm: { alarmType: string, code: string };
  queryKeyIds: string;
  resultData: any;
  options: any = {};
  options_pie: any = {};
  choseList: SelectItem[];
  yearList: SelectItem[];
  monthList: SelectItem[];
  weekList: SelectItem[];
  selectedChoice: { choseType: string, code: string };
  selectedYear: { yearType: string, code: string };
  selectedMonth: { monthType: string, code: string };
  selectedWeek: { weekType: string, code: string };
  inputMonthId: any;
  defaultMonth: any;
  defaultWeek: any;
  defaultChoice: any;
  defaultYear: any;
  //月 天数数据
  isShowMonth: any;
  isShowWeek: any;
  themeSubscription: any;
  paramYearMonth: any;
  alarmTypes = new Array;
  alarmList = [];
  //拆分数据
  //报警类型
  alarmTypeList = [];
  //时间
  showTime = [];
  //1.报警总数
  totalAlarm = [];
  //2.前向碰撞报警
  forwardCollision = [];
  //3.车道偏离报警
  laneDeparture = [];
  //4.车距过近报警
  closeDistance = [];
  //5.疲劳驾驶报警
  tiredDrive = [];
  //6.分神驾驶报警
  distractedDrive = [];
  //7.接打电话报警
  phoneCall = [];
  //8.抽烟报警
  smoking = [];
  //9.驾驶员异常报警
  driverAbnormal = [];
  //10.胎压异常报警
  pressureAbnormal = [];
  visibleSidebar2 = false;
  //下一月
  // addMonth()
  // {

  //   if(this.selectedMonth.monthType != '12月')
  //   {
  //     const afterAddMonth = (parseInt(this.selectedMonth.code)-19)+'月';
  //     this.selectedMonth = {monthType:afterAddMonth,code:(parseInt(this.selectedMonth.code) + 1)+''};
  //     this.defaultMonth = afterAddMonth;
  //   }else
  //   {
  //     this.selectedMonth = {monthType:'1月',code:'21'};
  //     this.defaultMonth = '1月';
  //     if(this.selectedYear.yearType != '2019年')
  //     {
  //       const afterAddYear = (parseInt(this.selectedYear.code)+2002)+'年';
  //       this.selectedYear = {yearType: afterAddYear,code: (parseInt(this.selectedYear.code)+1)+''};
  //       this.defaultYear = afterAddYear;
  //     }
  //   }
  //修改完之后查询
  //   this.searchAlarmData();
  // }
  //上一月
  // minusMonth()
  // {
  //   if(this.selectedMonth.monthType != '1月')
  //   {
  //     const afterMinusMonth = (parseInt(this.selectedMonth.code)-21)+'月';
  //     this.selectedMonth = {monthType:afterMinusMonth,code:(parseInt(this.selectedMonth.code) - 1)+''};
  //     this.defaultMonth = afterMinusMonth;
  //   }else
  //   {
  //     this.selectedMonth = {monthType:'12月',code:'32'};
  //     this.defaultMonth = '12月';
  //     if(this.selectedYear.yearType != '2012年')
  //     {
  //       const afterMinusYear = (parseInt(this.selectedYear.code)+2000)+'年';
  //       this.selectedYear = {yearType: afterMinusYear,code: (parseInt(this.selectedYear.code)-1)+''};
  //       this.defaultYear = afterMinusYear;
  //     }
  //   }

  //修改完之后查询
  //   this.searchAlarmData();
  // }

  changeType(selectedChoice) {
    if (selectedChoice.code == '1') {
      this.isShowMonth = 1;
      this.isShowWeek = 1;
    } else if (selectedChoice.code == '2') {
      this.isShowMonth = 0;
      this.isShowWeek = 1;
    } else if (selectedChoice.code == '3') {
      this.isShowMonth = 1;
      this.isShowWeek = 0;
    }
  }
  /* 日期类型选择框change事件 */
  changeYear(selectedYear) {
    let choosedYear = parseInt(selectedYear.code) + 2001;
    this.getWeeks(choosedYear);
  }
  /* 从车辆树获取keyId集合 */
  getKeyIdFromTree() {
    let nodeArray = new Array();
    nodeArray = this.lbstree.getAllcheckedNode();
    if (nodeArray.length > 0) {
      let keyIds = '';
      nodeArray.forEach((checkedNode) => {
        if (checkedNode.iconSkin !== 'm' && checkedNode.iconSkin !== 't') {
          keyIds += "" + checkedNode.id + ",";
        }
      });
      keyIds = keyIds.substring(0, keyIds.length - 1);
      this.queryKeyIds = keyIds;
    }
  }
  /* 数据查询 */
  searchAlarmData() {
    //查询前遍历车辆树的keyid
    this.queryKeyIds = ''
    this.getKeyIdFromTree();
    let alarm_type;
    if (this.selectedChoice.code == '2') {
      if (this.selectedMonth.monthType.length == 2) {
        this.paramYearMonth = this.selectedYear.yearType.substr(0, 4) + '0' + this.selectedMonth.monthType.substr(0, 1);
      } else if (this.selectedMonth.monthType.length == 3) {
        this.paramYearMonth = this.selectedYear.yearType.substr(0, 4) + this.selectedMonth.monthType.substr(0, 2);
      }
    } else if (this.selectedChoice.code == '1' || this.selectedChoice.code == '3') {
      this.paramYearMonth = this.selectedYear.yearType.substr(0, 4);
    }
    if (this.searchdriverName == undefined) {
      this.searchdriverName = '';
    }
    //报警类型下拉选
    if (this.selectedAlarm != undefined) {
      alarm_type = this.selectedAlarm.code;
    } else {
      alarm_type = '';
    }
    if (this.selectedWeek == undefined) {
      this.selectedWeek = { weekType: '星期一', code: '1' };
    }
    const params = new HttpParams().set('dateType', this.selectedChoice.code).set('week', this.selectedWeek.code).set('searchTime',
      this.paramYearMonth).set('alarmType', alarm_type).set('driverName', this.searchdriverName).set('keyIdList', this.queryKeyIds).set('groupIdList', '');
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getAlarmDateCountInfo',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.resultData = data;
        if (this.resultData != null && this.resultData.length >= 3) {
          this.showTime = this.resultData[0];
          this.alarmTypeList = this.resultData[1];
          this.totalAlarm = this.resultData[2];
          this.forwardCollision = this.resultData[3];
          this.laneDeparture = this.resultData[4];
          this.closeDistance = this.resultData[5];
          this.tiredDrive = this.resultData[6];
          this.distractedDrive = this.resultData[7];
          this.phoneCall = this.resultData[8];
          this.smoking = this.resultData[9];
          this.driverAbnormal = this.resultData[10];
          // this.pressureAbnormal = this.resultData[11];
        } else {
          this.alarmTypeList = [this.selectedAlarm.alarmType];
          this.totalAlarm = [''];
          this.forwardCollision = [''];
          this.laneDeparture = [''];
          this.closeDistance = [''];
          this.tiredDrive = [''];
          this.distractedDrive = [''];
          this.phoneCall = [''];
          this.smoking = [''];
          this.driverAbnormal = [''];
        }
        this.loadConfig();
      });
  }

  /* 显示趋势图 */
  showTrend() {
    document.getElementById("trendId").style.background = '#11bfff';
    document.getElementById("trendId").style.color = '#fff';
    document.getElementById("pieId").style.color = '#333';
    document.getElementById("pieId").style.background = '#fff';
    document.getElementById("trend").style.display = "block";
    document.getElementById("pie").style.display = "none";
    document.getElementById("trendSearch").style.display = "block";
    document.getElementById("pieSearch").style.display = "none";
    //执行查询
    this.searchAlarmData();
  }
  /* 显示饼状图 */
  showPie() {
    document.getElementById("pieId").style.background = '#11bfff';
    document.getElementById("pieId").style.color = '#fff';
    document.getElementById("trendId").style.color = '#333';
    document.getElementById("trendId").style.background = '#fff';
    document.getElementById("trend").style.display = "none";
    document.getElementById("pie").style.display = "block";
    document.getElementById("trendSearch").style.display = "none";
    document.getElementById("pieSearch").style.display = "block";
    this.getPieData();
    //执行查询
    this.searchPie();
  }

  ngOnInit() {
    this.searchdriverName = '';
  }

  getWeeks(year) {
    this.weekList = [];
    let countWeeks;
    let countYearDays = year;
    let firstDay = new Date(countYearDays, 0, 1);
    countYearDays = ((countYearDays % 4 == 0 && countYearDays % 100 != 0) || countYearDays % 400 == 0) ? 366 : 365;
    countWeeks = Math.ceil((countYearDays - firstDay.getDay() + 1) / 7.0);
    if (firstDay.getDay() == 0) {
      let firstWeekDay = 6;
      countWeeks = Math.ceil((countYearDays - firstWeekDay) / 7.0);
    }
    for (let i = 1; i <= countWeeks; i++) {
      this.weekList.push({ label: '第' + i + '周', value: { id: i, weekType: '第' + i + '周', code: i + '' } });
    }
  }

  ngAfterViewInit() {
    //初始化周下拉选
    this.getWeeks(new Date().getFullYear());
    //初始化tab选择
    document.getElementById("trendId").style.background = '#11bfff';
    document.getElementById("trendId").style.color = '#fff';
    document.getElementById("pieId").style.color = '#333';
    document.getElementById("pieId").style.background = '#fff';
    document.getElementById("trend").style.display = "block";
    document.getElementById("pie").style.display = "none";
    document.getElementById("trendSearch").style.display = "block";
    document.getElementById("pieSearch").style.display = "none";
    //查询报警类型
    const params = new HttpParams();
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getAlarmType',
      {
        responseType: 'json', params,
      })
      .subscribe((data: any) => {
        this.alarmTypes = data;
        this.alarmList.push({ label: "全部报警", value: { id: 0, alarmType: '', code: '' } });
        for (let i = 0; i < this.alarmTypes.length; i++) {
          this.alarmList.push({
            label: this.alarmTypes[i].name,
            value: { id: i + 2, alarmType: this.alarmTypes[i].name, code: this.alarmTypes[i].alarmType }
          });
        }
      });

    //数据接收
    const nowYear = new Date().getFullYear();
    const nowMonth = new Date().getMonth();
    if (nowMonth < 10) {
      this.paramYearMonth = nowYear + '0' + (nowMonth + 1);
    } else {
      this.paramYearMonth = nowYear + '' + (nowMonth + 1);
    }

    const params1 = new HttpParams().set('dateType', this.selectedChoice.code).set('searchTime',
      this.paramYearMonth).set('alarmType', '');
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getAlarmDateCountInfo',
      {
        responseType: 'json', params: params1,
      })
      .subscribe(data => {
        this.resultData = data;
        if (this.resultData != null && this.resultData.length >= 3) {
          this.showTime = this.resultData[0];
          this.alarmTypeList = this.resultData[1];
          this.totalAlarm = this.resultData[2];
          this.forwardCollision = this.resultData[3];
          this.laneDeparture = this.resultData[4];
          this.closeDistance = this.resultData[5];
          this.tiredDrive = this.resultData[6];
          this.distractedDrive = this.resultData[7];
          this.phoneCall = this.resultData[8];
          this.smoking = this.resultData[9];
          this.driverAbnormal = this.resultData[10];
          // this.pressureAbnormal = this.resultData[11];
        } else {
          // this.alarmTypeList[0]=this.selectedAlarm.alarmType;
          this.alarmTypeList = [this.selectedAlarm.alarmType];
          this.totalAlarm = [''];
          this.forwardCollision = [''];
          this.laneDeparture = [''];
          this.closeDistance = [''];
          this.tiredDrive = [''];
          this.distractedDrive = [''];
          this.phoneCall = [''];
          this.smoking = [''];
          this.driverAbnormal = [''];
        }
        this.loadConfig();
      });
    //饼状图数据
    this.getResultData();
  }
  /* 折线图表格属性 */
  loadConfig() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      const dateData = this.showTime;
      this.options = {
        title: {
          text: '',
        },
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: echarts.tooltipBackgroundColor,
            },
          },
          position: function (pos, params, el, elRect, size) {
            var obj = { top: 10 };
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 260;
            return obj;
          },
          extraCssText: 'width: 170px'
        },
        legend: {
          data: this.alarmTypeList,
          textStyle: {
            color: echarts.textColor,
          },
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.showTime,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: this.alarmTypeList[0],
            type: 'line',
            // symbol: 'circle',
            showAllSymbol: true,
            areaStyle: "#000",
            data: this.totalAlarm,
          },
          {
            name: this.alarmTypeList[1],
            type: 'line',
            // stack: 'Total amount',
            showAllSymbol: true,
            areaStyle: "#000",
            data: this.forwardCollision,
          },
          {
            name: this.alarmTypeList[2],
            type: 'line',
            showAllSymbol: true,
            areaStyle: "#000",
            data: this.laneDeparture,
          },
          {
            name: this.alarmTypeList[3],
            type: 'line',
            showAllSymbol: true,
            areaStyle: "#000",
            data: this.closeDistance,
          },
          {
            name: this.alarmTypeList[4],
            type: 'line',
            showAllSymbol: true,
            areaStyle: "#000",
            data: this.tiredDrive,
          },
          {
            name: this.alarmTypeList[5],
            type: 'line',
            showAllSymbol: true,
            areaStyle: "#000",
            data: this.distractedDrive,
          },
          {
            name: this.alarmTypeList[6],
            type: 'line',
            showAllSymbol: true,
            areaStyle: "#000",
            data: this.phoneCall,
          },
          {
            name: this.alarmTypeList[7],
            type: 'line',
            showAllSymbol: true,
            areaStyle: "#000",
            data: this.smoking,
          },
          {
            name: this.alarmTypeList[8],
            type: 'line',
            showAllSymbol: true,
            areaStyle: "#000",
            data: this.driverAbnormal,
          },
          {
            name: this.alarmTypeList[9],
            type: 'line',
            showAllSymbol: true,
            areaStyle: "#000",
            data: this.pressureAbnormal,
          },
        ],
      };
    });
  }
  /* 饼图查询方法 */
  searchPie() {
    this.getResultData();
  }
  showCars() {
    this.carTreeDisplay = true;
  }
  showDepartment() {
    this.groupTreeDisplay = true;
  }
  confirm() {
    this.carTreeDisplay = false;
    this.car.carno = this.carTree.getCarNo();
    this.chosePieCarNo = this.car.carno;
    this.choseTrendCarNo = this.car.carno;
  }
  groupConfirm() {
    this.groupTreeDisplay = false;
    this.searchGroupName = this.groupTree.getGroupName();
  }
  reset2() {
    this.carTreeDisplay = false;
  }
  reset3() {
    this.groupTreeDisplay = false;
  }
  getResultData() {
    //查询前遍历车辆树的keyid
    this.queryKeyIds = ''
    this.getKeyIdFromTree();
    if (this.selectedChoice.code == '2') {
      if (this.selectedMonth.monthType.length == 2) {
        this.paramYearMonth = this.selectedYear.yearType.substr(0, 4) + '0' + this.selectedMonth.monthType.substr(0, 1);
      } else if (this.selectedMonth.monthType.length == 3) {
        this.paramYearMonth = this.selectedYear.yearType.substr(0, 4) + this.selectedMonth.monthType.substr(0, 2);
      }
    } else if (this.selectedChoice.code == '1' || this.selectedChoice.code == '3') {
      this.paramYearMonth = this.selectedYear.yearType.substr(0, 4);
    }
    if (this.searchdriverName == undefined) {
      this.searchdriverName = '';
    }
    if (this.selectedWeek == undefined) {
      this.selectedWeek = { weekType: '星期一', code: '1' };
    }
    const params = new HttpParams().set('dateType', this.selectedChoice.code).set('week', this.selectedWeek.code).set('keyIdList', this.queryKeyIds)
      .set('searchTime', this.paramYearMonth).set('driverName', this.searchdriverName).set('groupIdList', "");
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getAlarmPicDateCountInfo',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        if (data != null) {
          let count = 0;
          this.resultData = data;
          this.alarmNameArr = [];
          this.alarmCountArr = [];
          for (let i = 0; i < this.resultData.length; i++) {
            this.alarmNameArr.push(this.resultData[i][0]);
            this.alarmCountArr.push({ value: this.resultData[i][1], name: this.resultData[i][0] });
            if (this.resultData[i][1] == 0 || this.resultData[i][1] == '0') {
              count++;
            }
          }
          if (count == this.resultData.length) {
            this.alarmNameArr.push('未查到数据');
            this.alarmCountArr = [{ value: '无数据', name: '未查到数据' }];
          }
          this.getPieData();
        }
      });
  }

  /* 定义饼状图参数 */
  getPieData() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options_pie = {
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
    if (this.themeSubscription !== undefined && this.themeSubscription !== null) {
      this.themeSubscription.unsubscribe();
    }

  }
}

