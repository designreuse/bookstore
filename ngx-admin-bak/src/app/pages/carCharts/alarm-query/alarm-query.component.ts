import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarModule, DataTable } from 'primeng/primeng';
import { HttpModule, Http } from '@angular/http';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { LocalDataSource } from 'ng2-smart-table';
import { isDate, isNullOrUndefined, isUndefined } from 'util';
import { PagesService } from 'app/pages/pages.service';
@Component({
  selector: 'alarm-query',
  templateUrl: './alarm-query.component.html',
  styleUrls: ['./alarm-query.component.scss'],
})
export class AlarmQueryComponent implements OnInit {

  @ViewChild('dt') dt: DataTable;
  constructor(private http: Http, private httpclient: HttpClient, private pagesService: PagesService) {
    let d = new Date();
    this.begin_Date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    this.end_Date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
  }
  //双向绑定的查询条件
  private searchName: string;
  private begin_Date: any;
  private end_Date: any;
  // 传递到后台的时间参数
  startTime: string;
  endTime: string;
  loading: boolean = false;

  //后台返回值
  private alarmData: any;
  source: LocalDataSource = new LocalDataSource();

  exportCSV() {
    if (this.alarmData.length > 0) {
      this.dt.exportCSV();
    } else {

    }
  }

  ngOnInit() {
    this.dateRangePicker();
    if (isDate(this.begin_Date)) {
      this.startTime = this.pagesService.formateDateToStr(this.begin_Date);
    } else {
      this.startTime = this.begin_Date;
    }
    if (isDate(this.end_Date)) {
      this.endTime = this.pagesService.formateDateToStr(this.end_Date);
    } else {
      this.endTime = this.end_Date;
    }
    this.loading = true;
    const params = new HttpParams().set('startTime', this.startTime).set('endTime', this.endTime);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/searchAlarmLog',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.alarmData = data;
        this.loading = false;
        this.source.load(this.alarmData);
      });
  }

  dateRangePicker() {
    let picker: any = $('#startEndTime');
    let dataRageOption: Object = {
      "timePicker": true,
      "timePicker24Hour": true,
      "drops": "down",
      "opens": "center",
      "showDropdowns": true,
      "locale": {
        "format": "YYYY-MM-DD HH:mm",
        "separator": " -- ",
        "applyLabel": "确认",
        "cancelLabel": "取消",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
        "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        "firstDay": 1
      },
      "startDate": this.pagesService.fmtDateToStr(new Date()) + ' 00:00',
      "endDate": this.pagesService.fmtDateToStr(new Date()) + ' 23:59'
    };
    picker.daterangepicker(dataRageOption, (start, end, label) => {
      this.begin_Date = start.format('YYYY-MM-DD HH:mm') + ':00';
      this.end_Date = end.format('YYYY-MM-DD HH:mm') + ':59';
    });

  }

  //查询按钮
  searchAlarm() {
    if (isDate(this.begin_Date)) {
      this.startTime = this.pagesService.formateDateToStr(this.begin_Date);
    } else {
      this.startTime = this.begin_Date;
    }
    if (isDate(this.end_Date)) {
      this.endTime = this.pagesService.formateDateToStr(this.end_Date);
    } else {
      this.endTime = this.end_Date;
    }
    if (this.startTime == null) {
      this.startTime = '';
    }
    if (this.endTime == null) {
      this.endTime = '';
    }
    if (this.searchName == undefined) {
      this.searchName = '';
    }
    this.loading = true;
    const params = new HttpParams().set('userName', this.searchName).set('startTime', this.startTime).set('endTime', this.endTime);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/searchAlarmLog',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.alarmData = data;
        this.loading = false;
        this.source.load(this.alarmData);
      });
  }



  //   public exportCSV(options?:any) {
  //     let data = this.filteredValue||this.value;
  //     let csv = '\ufeff';

  //     if(options && options.selectionOnly) {
  //         data = this.selection||[];
  //     }

  //     //headers
  //     for(let i = 0; i < this.columns.length; i++) {
  //         let column = this.columns[i];
  //         if(column.exportable && column.field) {
  //             csv += '"' + (column.header || column.field) + '"';

  //             if(i < (this.columns.length - 1)) {
  //                 csv += this.csvSeparator;
  //             }
  //         }
  //     }

  //     //body
  //     data.forEach((record, i) => {
  //         csv += '\n';
  //         for(let i = 0; i < this.columns.length; i++) {
  //             let column = this.columns[i];
  //             if(column.exportable && column.field) {
  //                 csv += '"' + this.resolveFieldData(record, column.field) + '"';

  //                 if(i < (this.columns.length - 1)) {
  //                     csv += this.csvSeparator;
  //                 }
  //             }
  //         }
  //     });

  //     let blob = new Blob([csv],{
  //         type: 'text/csv;charset=utf-8;'
  //     });

  //     if(window.navigator.msSaveOrOpenBlob) {
  //         navigator.msSaveOrOpenBlob(blob, this.exportFilename + '.csv');
  //     }
  //     else {
  //         let link = document.createElement("a");
  //         link.style.display = 'none';
  //         document.body.appendChild(link);
  //         if(link.download !== undefined) {
  //             link.setAttribute('href', URL.createObjectURL(blob));
  //             link.setAttribute('download', this.exportFilename + '.csv');
  //             link.click();
  //         }
  //         else {
  //             csv = 'data:text/csv;charset=utf-8,' + csv;
  //             window.open(encodeURI(csv));
  //         }
  //         document.body.removeChild(link);
  //     }
  // }

}
