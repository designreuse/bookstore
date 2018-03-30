import { AfterViewInit, Component, OnDestroy ,OnInit} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'alarm-trend-chart-1',
  styleUrls: ['./alarm-trend-chart-1.component.scss'],
  templateUrl: './alarm-trend-chart-1.component.html',

})
export class CopyAlarmTrendChartComponent implements OnInit,AfterViewInit{
  
  constructor(private theme: NbThemeService,private http: Http, private httpclient: HttpClient) {
  }
  resultData:any;
  options: any = {};
  selectedChoice : {choseType: string,code: string};
  selectedYear:{yearType: string,code: string};
  selectedMonth:{monthType: string,code: string};
  inputMonthId:any;
  defaultMonth:any;
  defaultChoice:any;
  defaultYear:any;
  monthCode = {};
  //月 天数数据
  countDaysInMonth:any;
  themeSubscription: any;
  paramYearMonth:any;
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

  //生成月份数据
  
  //下一月

  //上一月

  //查询方法

  ngOnInit() {
    
    const nowYear = new Date().getFullYear();
    const nowMonth = new Date().getMonth();
    const temp = new Date(nowYear,nowMonth,0);
    const daysCount = temp.getDate();
    const daysArray = new Array();
    for(let i=1;i<=daysCount;i++)
    {
      daysArray.push(nowYear + '-' + (nowMonth+1) + '-' + i);
    }

    this.countDaysInMonth = daysArray;

    //数据接收
    if(nowMonth < 10)
    {
      this.paramYearMonth = nowYear+'0'+(nowMonth+1);
    }else{
      this.paramYearMonth = nowYear+''+(nowMonth+1);
    }
    
    // const params = new HttpParams().set('dateType', '2').set('searchTime', 
    // this.paramYearMonth).set('groupIdList', '');
    const params = new HttpParams().set('dateType', '2').set('searchTime', 
    '201801').set('groupIdList', '');
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getAlarmDateCountInfo',
    {
        responseType: 'json', params,
    })
    .subscribe(data => {
      this.resultData = data;
      if(this.resultData != null)
      {
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
        this.pressureAbnormal = this.resultData[11];
      }

      this.loadConfig();
    });
  }

  loadConfig()
  {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      
            const colors: any = config.variables;
            const echarts: any = config.variables.echarts;
      
            this.options = {
              title:{
                text:'报警趋势统计线条图',
                x:'center',
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
              },
              legend: {
                top:'10%',
                data: [],
                show:true,
                textStyle: {
                  color: echarts.textColor,
                },
              },
              grid: {
                left: '4%',
                right: '4%',
                bottom: '3%',
                top: '20%',
                containLabel: true,
              },
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: false,
                  data:this.showTime,
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
                  // stack: 'Total amount',
                  areaStyle: "#000",
                  data: this.totalAlarm,
                },
                {
                  name: this.alarmTypeList[1],
                  type: 'line',
                  // stack: 'Total amount',
                  areaStyle: "#000",
                  data: this.forwardCollision,
                },                
                {
                  name: this.alarmTypeList[2],
                  type: 'line',
                  areaStyle: "#000",
                  data: this.laneDeparture,
                },
                {
                  name: this.alarmTypeList[3],
                  type: 'line',
                  areaStyle: "#000",
                  data: this.closeDistance,
                },
                {
                  name: this.alarmTypeList[4],
                  type: 'line',
                  areaStyle: "#000",
                  data: this.tiredDrive,
                },
                {
                  name: this.alarmTypeList[5],
                  type: 'line',
                  areaStyle: "#000",
                  data: this.distractedDrive,
                },
                {
                  name: this.alarmTypeList[6],
                  type: 'line',
                  areaStyle: "#000",
                  data: this.phoneCall,
                },
                {
                  name: this.alarmTypeList[7],
                  type: 'line',
                  areaStyle: "#000",
                  data: this.smoking,
                },
                {
                  name: this.alarmTypeList[8],
                  type: 'line',
                  areaStyle: "#000",
                  data: this.driverAbnormal,
                },
                {
                  name: this.alarmTypeList[9],
                  type: 'line',
                  areaStyle: "#000",
                  data: this.pressureAbnormal,
                },
              ],
            };
          });
  }

  ngAfterViewInit() {
    
  }
}
