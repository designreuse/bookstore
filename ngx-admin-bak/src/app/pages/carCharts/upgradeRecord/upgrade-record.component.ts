import { Component } from '@angular/core';
import { Button, DataTable, SelectItem, Dialog } from 'primeng/primeng';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { OnInit, ViewChild, OnDestroy, SimpleChange, Input } from '@angular/core';
import { LbsTreeComponent } from 'app/pages/demos/lbstree/lbstree.component';
import { ResultDataInfo } from 'app/pages/carCharts/upgradeRecord/resultData';
import { PagesService } from 'app/pages/pages.service';
import { isDate, isNullOrUndefined, isUndefined } from 'util';
@Component({
  selector: 'upgrade-record',
  styleUrls: ['./upgrade-record.component.scss'],
  templateUrl: './upgrade-record.component.html',
})

export class UpgradeRecordComponent implements OnInit {

  // selectedAlarm: { alarmType: string, code: string };
  private resultData: any;
  private begindate: Date;
  private enddate: Date;
  cn: any;
  searchCarNo: string;
  searchName: string;
  startTime: string;
  endTime: string;
  alarmTypes = new Array;
  resultDataInfo: ResultDataInfo;
  cols: any[];
  detailDisplay = false;
  resultDetail = [];
  //设备下拉
  productList: SelectItem[]; 
  selectedProduct: {productType: string,code: string};
  //年月选择
  commandList: SelectItem[];
  selectedCommand: { commandType: string, code: string };
  defaultCommand: any;
  resultList: SelectItem[];
  selectedResult: { resultType: string, code: string };
  defaultResult: any;
  //条件
  newSoftVesion: any;
  newProductType: any;
  newSearchCarNo: any;
  createrName: any;
  searchGroupId: any;
  queryKeyIds = '';
  //弹出框展示
  carNoColor: any;
  terminalName: any;
  terminalId: any;
  terminalVersion: any;

  @ViewChild('dt') dt: DataTable;
  @ViewChild('lbstree') lbstree: LbsTreeComponent;
  constructor(
    private http: Http, private httpclient: HttpClient, private pagesService: PagesService) {
    this.cols = [];

    this.commandList = [
      { label: '全部方式', value: { id: 1, commandType: '全部方式', code: '' } },
      { label: '立即升级', value: { id: 2, commandType: '立即升级', code: '0' } },
      { label: '策略升级', value: { id: 3, commandType: '策略升级', code: '1' } },
    ];
    this.defaultCommand = '全部方式';
    this.resultList = [
      { label: '全部结果', value: { id: 1, resultType: '全部结果', code: '' } },
      { label: '升级成功', value: { id: 2, resultType: '升级成功', code: '5' } },
      { label: '升级失败', value: { id: 3, resultType: '升级失败', code: '6' } },
    ];
    this.defaultResult = '全部结果';
    this.productList = [
      { label: '全部类型', value: { id: 1, productType: '全部类型', code: '' } },
      { label: 'ADAS', value: { id: 2, productType: 'ADAS', code: '100' } },
      { label: 'DSM', value: { id: 3, productType: 'DSM', code: '101' } },
      { label: 'TPMS', value: { id: 4, productType: 'TPMS', code: '102' } },
      { label: 'BSD', value: { id: 5, productType: 'BSD', code: '103' } },
    ];
  }
  //选择分组
  // showDepartment() {

  // }

  exportCSV() {
    if (this.resultData.length > 0) {
      this.dt.exportCSV();
    } else {

    }
  }
  //查询按钮
  searchAlarm() {
    // this.getKeyIdFromTree();
    // if (isDate(this.begindate)) {
    //   this.startTime = this.pagesService.formateDateToStr(this.begindate);
    // }
    // if (isDate(this.enddate)) {
    //   this.endTime = this.pagesService.formateDateToStr(this.enddate);
    // }

    if (this.selectedCommand == undefined) {
      this.selectedCommand = { commandType: '全部指令', code: '' };
    }
    if (this.selectedResult == undefined) {
      this.selectedResult = { resultType: '全部结果', code: '' };
    }
    // if (this.startTime == null) {
    //   this.startTime = '';
    // }
    // if (this.endTime == null) {
    //   this.endTime = '';
    // }

    if (this.createrName == undefined) {
      this.createrName = '';
    }
    if(this.newSearchCarNo == undefined){
      this.newSearchCarNo = '';
    }
    if(this.selectedProduct == undefined){
      this.selectedProduct = { productType: '全部类型', code: '' };
    }
    if(this.newProductType == undefined){
      this.newProductType = '';
    }
    if(this.newSoftVesion == undefined){
      this.newSoftVesion = '';
    }
    const params = new HttpParams().set('createUser', this.createrName).set('commandId', this.selectedCommand.code)
    .set('dealResult', this.selectedResult.code).set('carNo',this.newSearchCarNo).set('deviceId',this.selectedProduct.code)
    .set('productType',this.newProductType).set('softVesion',this.newSoftVesion);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getMsgLog',
      {
        responseType: 'json', params,
      }).subscribe(data => {
        this.resultData = data;
      });
  }
  //弹出 查看详情
  // showDetial(resultDataInfo: ResultDataInfo) {
  //   // this.resultDataInfo = resultDataInfo;
  //   // this.resultDetail = [
  //   //   {
  //   //     1: this.resultDataInfo.CARNO_AND_COLOR, 2: this.resultDataInfo.KEYID,
  //   //     3: this.resultDataInfo.COMESOLARID, 4: this.resultDataInfo.SOFT_VERSION
  //   //   }
  //   // ];
  //   this.detailDisplay = true;
  //   // if(this.detailDisplay == true)
  //   // {
  //     this.carNoColor = resultDataInfo.CARNO_AND_COLOR;
  //     this.terminalName = resultDataInfo.KEYID;
  //     this.terminalId = resultDataInfo.COMESOLARID;
  //     this.terminalVersion = resultDataInfo.SOFT_VERSION;
  //   // }
  // }

  //获取keyId集合
  // getKeyIdFromTree()
  // {
  //   this.queryKeyIds = '';
  //   let nodeArray = new Array();
  //   nodeArray = this.lbstree.getAllcheckedNode();
  //   if (nodeArray.length > 0) {
  //     let keyIds = '';
  //     nodeArray.forEach((checkedNode) => {
  //         if (checkedNode.iconSkin !== 'm' && checkedNode.iconSkin !== 't') {
  //             keyIds += "" + checkedNode.id + ",";
  //         }
  //     });
  //     keyIds = keyIds.substring(0, keyIds.length - 1);
  //     this.queryKeyIds = keyIds;
  //   }
  // }

  ngOnInit() {
    //   this.cols = [
    //     { field:'USER_NAME', header:'升级账号', sort: false },
    //     { field: 'CREATEDON', header: '升级时间', sort: false },
    //     { field: 'COMMAND_ID_STR', header: '升级方式（立即/策略）', sort: false },
    //     { field: 'DEAL_RESULT', header: '升级结果（成功/失败）', sort: false },
    //     { field: 'IP', header: 'IP地址', sort: false }
    // ];
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

    let d = new Date();
    this.begindate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    this.enddate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59);
    this.startTime = this.pagesService.formateDateToStr(this.begindate);
    this.endTime = this.pagesService.formateDateToStr(this.enddate);
    //数据接收
    this.searchAlarm();
    // const params1 = new HttpParams().set('startTime', this.startTime).set('endTime', this.endTime);
    // this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getMsgLog',
    //   {
    //     responseType: 'json', params: params1,
    //   }).subscribe(data => {
    //     this.resultData = data;
    //   });
  }

}
