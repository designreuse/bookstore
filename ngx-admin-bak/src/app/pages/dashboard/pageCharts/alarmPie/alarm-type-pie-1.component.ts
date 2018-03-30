import { AfterViewInit, Component, OnDestroy,OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
import {DropdownModule,CalendarModule,ButtonModule} from 'primeng/primeng';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'alarm-type-pie-1',
  styleUrls: ['./alarm-type-pie-1.component.scss'],
  templateUrl: './alarm-type-pie-1.component.html',
})
export class CopyAlarmTypePieComponent implements OnInit, AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService,private http: Http, private httpclient: HttpClient) {
    this.isShowSpan = 1;
  }
  alarmNameArr = [];
  alarmCountArr = [];
  resultData:any;
  selectedChoice : {choseType: string,code: string};
  selectedYear:{yearType: string,code: string};
  selectedMonth:{monthType: string,code: string};
  defaultMonth:any;
  defaultChoice:any;
  defaultYear:any;
  countDaysInMonth:any;
  paramYearMonth:any;
  isShowSpan:any;

  //下一月
 
  //上一月

  //查询方法
  searchPie()
  {

  }

  ngOnInit() 
  {
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
    
    const params = new HttpParams().set('dateType', '2').set('searchTime', 
    '201801');
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
          if(this.resultData[i][1] == 0 || this.resultData[i][1] == '0')
          {
            count++;
          }
        }
        if(count == this.resultData.length)
        {
          this.isShowSpan = 0;
          this.alarmNameArr.push('未查到数据');
          this.alarmCountArr = [{ value: '无数据', name: '未查到数据' }];
        }

        this.loadConfig();
      }
    });

    
  }


  loadConfig()
  {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      
            const colors = config.variables;
            const echarts: any = config.variables.echarts;
      
            this.options = {
              title:{
                text:'报警统计报表饼状图',
                x:'center',
              },
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
                  radius: '60%',
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

  ngAfterViewInit() {
    
  }

  ngOnDestroy(): void {
    if(this.themeSubscription !== undefined && this.themeSubscription !== null) {
      this.themeSubscription.unsubscribe();
    }
  }
}
