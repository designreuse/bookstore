import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTable, Message } from 'primeng/primeng';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { PagesService } from 'app/pages/pages.service';
import { isDate, isNullOrUndefined, isUndefined } from 'util';
import { DetailComponent } from './detail/detail.component';
import { DealComponent } from './deal/deal.component';
@Component({
  selector: 'driver-anormity',
  templateUrl: './driver-anormity.component.html',
  styleUrls: ['./driver-anormity.component.scss'],
})
export class DriverAnormityComponent implements OnInit {

  constructor(private httpclient: HttpClient, private pagesService: PagesService) {
    this.anormityData = {
      ID: null,
      IC_CARD: null,
      DRIVERNAME: null,
      DEAL_USER: null,
      PHOTOSTEAM: null,
      PHOTO_COMPARE_STEAM: null,
      DEAL_TIME: null,
      COMPARE_RESULT: null,
      COMPARE_RESULT_STR: null,
      DEAL_RESULT: null,
      DEAL_RESULT_STR: null,
      DEAL_CONTENT: null,
      COMPARE_TIME: null,
    }
  }
  @ViewChild('dt') dt: DataTable;
  @ViewChild('deal') deal: DealComponent;

  searchBeginDate: any;
  searchEndDate: any;
  searchBeginTime: string;
  searchEndTime: string;

  searchDealResultOptions = [
    { resultName: '全部', resultCode: '-1' },
    { resultName: '未处理', resultCode: '0' },
    { resultName: '已处理', resultCode: '1' },
  ];
  searchDealResult = { resultName: '未处理', resultCode: '0' };

  dealResult;

  anormityData: any;
  anormityDataList: any;
  msgs: Message[] = [];
  loading: boolean = false;

  photoDisplay = false;
  comparePhotoDisplay = false;
  detailDisplay = false;
  dealDisplay = false;

  dealuser = '';
  deal_result_str = '';
  deal_content = '';

  //查询
  searchAnormity() {
    if (isDate(this.searchBeginDate)) {
      this.searchBeginTime = this.pagesService.formateDateToStr(this.searchBeginDate);
    } else {
      this.searchBeginTime = this.searchBeginDate;
    }
    if (isDate(this.searchEndDate)) {
      this.searchEndTime = this.pagesService.formateDateToStr(this.searchEndDate);
    } else {
      this.searchEndTime = this.searchEndDate;
    }
    this.loading = true;
    const params = new HttpParams().set('startTime', this.searchBeginTime).set('endTime', this.searchEndTime).set('dealResult', this.searchDealResult.resultCode);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getDriverComparaInfo',
      {
        responseType: 'json', params,
      })
      .subscribe((data: any) => {
        this.anormityDataList = data;
        this.loading = false;
        if (this.anormityDataList == null || this.anormityDataList.length == 0) {
          this.anormityDataList = null;
          this.loading = false;
        }
      });

  }

  //打开处理详情页面
  showDetail(rowdata) {
    this.anormityData = rowdata;
    const params = new HttpParams().set('id', this.anormityData.ID);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getDriverComparaInfoById',
      {
        responseType: 'json', params,
      })
      .subscribe((data: any) => {
        this.anormityData = data[0];
        this.detailDisplay = true;
      });
  }

  //打开处理页面
  showDeal(rowdata) {
    this.deal.anormityData = rowdata;
    this.dealDisplay = true;
    this.dealResult = 0;
    this.deal.anormityData.DEAL_USER = "";
    this.deal.anormityData.DEAL_CONTENT = '';
  }
  choose(dealResult: boolean) {
    if (dealResult == true) {
      this.dealResult = 1;
    } else {
      this.dealResult = 0;
    }
  }
  save() {
    this.anormityData = this.deal.getAnormityDealData();
    this.saveDealResult();
  }
  //处理页面保存按钮
  saveDealResult() {
    if (this.anormityData != null) {
      if (this.anormityData.DEAL_USER == undefined || this.anormityData.DEAL_USER == "" || this.anormityData.DEAL_USER.replace(" ", "").length == 0) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: '', detail: '请输入处理人!' });
      } else if (this.anormityData.DEAL_CONTENT == undefined || this.anormityData.DEAL_CONTENT == "" || this.anormityData.DEAL_CONTENT.replace(" ", "").length == 0) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: '', detail: '请输入处理意见!' });
      } else {
        this.anormityData.DEAL_RESULT = this.dealResult;
        const params = new HttpParams().set('id', this.anormityData.ID)
          .set('dealUser', this.anormityData.DEAL_USER)
          .set('dealResult', this.anormityData.DEAL_RESULT)
          .set('dealContent', this.anormityData.DEAL_CONTENT);
        this.httpclient.request('POST', environment.INTERFACE_URL + '/api/dealDriverCompara',
          {
            responseType: 'json', params,
          })
          .subscribe((data: any) => {
            if (data.result == 0) {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: '', detail: '处理成功!' });
              this.dealDisplay = false;
              this.searchAnormity();
            } else {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: '', detail: '处理失败!' });
            }
          });
      }
    }
  }

  //关闭处理页面
  close() {
    this.dealDisplay = false;
  }

  ngOnInit() {
    this.dateRangePicker();
    let d = new Date();
    this.searchBeginDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    this.searchEndDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

    let beginTime = this.pagesService.formateDateToStr(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    // let beginTime = this.pagesService.formateDateToStr(new Date(2017, 11, 1));
    let endTime = this.pagesService.formateDateToStr(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59));

    const params = new HttpParams().set('startTime', beginTime).set('endTime', endTime).set('dealResult', '0');
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getDriverComparaInfo',
      {
        responseType: 'json', params,
      })
      .subscribe((data: any) => {
        this.anormityDataList = data;
        if (this.anormityDataList == null || this.anormityDataList.length == 0) {
          this.anormityDataList = null;
        }
      });
  }

  //从detail弹射过来的显示照片方法
  showPhoto(data) {
    this.viewPhoto(data);
  }
  //点击照片信息图片打开弹窗
  viewPhoto(rowdata) {
    this.anormityData = rowdata;
    this.photoDisplay = true;
  }
  //从detail弹射过来的显示比对照片方法
  showComparePhoto(data) {
    this.viewComparePhoto(data);
  }
  //点击比对照片信息图片打开弹窗
  viewComparePhoto(rowdata) {
    this.anormityData = rowdata;
    this.comparePhotoDisplay = true;
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
      this.searchBeginDate = start.format('YYYY-MM-DD HH:mm') + ':00';
      this.searchEndDate = end.format('YYYY-MM-DD HH:mm') + ':59';
    });
  }
}
