import { Component } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { OnInit, ViewChild, OnDestroy, SimpleChange, Input } from '@angular/core';
import { SelectItem, Message, DataTable } from 'primeng/primeng';
import { LbsTreeComponent } from 'app/pages/demos/lbstree/lbstree.component';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { TableDataInfo, ModifyDataInfo } from './data';
import { PagesService } from 'app/pages/pages.service';
import { Observable } from 'rxjs/Observable';
import { globalTime } from 'app/pages/common-util/global-time/global-time';

@Component({
  selector: 'sys-up',
  styleUrls: ['./sys-up.component.scss'],
  templateUrl: './sys-up.component.html',
  providers: [ConfirmationService]
})

export class SysUpComponent implements OnInit {
  /* 终端查询条件对象 */
  productList: SelectItem[];
  selectedProduct: { productType: string, code: string };
  terminalInput: string;
  private searchBeginDate: Date;
  private searchBeginTime: string;
  private searchEndDate: Date;
  private searchEndTime: string;
  queryKeyIds: string;
  /* 终端查询表格对象 */
  searchTerminalData: any;
  /* 立即升级对象 */
  updateUrlForNow: any;
  searchTerminalData2: any;
  keyIdsForUpdate: string;
  searchTerminalData_dialog: any;
  updateUrl: string; 
  display = false;
  upgradeImmedately = false;
  /* 策略升级对象 */
  updateName: string;
  updateUrlForSta: any;
  private updateDate: Date;
  searchTerminalData3: any;
  updateTime: string;
  strategyDisplay = false;
  /* 策略任务查询对象 */
  strategyBeginDate: Date;
  strategyBeginTime: string;
  strategyEndDate: Date;
  strategyEndTime: string;
  strategyName: string;
  searchPlanData: any;
  /* 策略任务查看详情/修改策略弹窗 */
  updateStrategyName1: any;
  updateStrategyDate1: any;
  updateUrl1: any;
  createUser1: any;
  createTime1: any;
  modifyBy1: any;
  modifyOn1: any;
  detailDisplay = false;
  detailsDisplay = false;
  /* 明细自查 */
  selfQueryCar: any;
  selfQueryEdition: any;
  terminalData: any;
  newTerminalDataForUpdate: any;
  /* 查看详情表格、修改策略明细 */
  terminalDataForUpdate: any;
  /* 修改策略弹窗 */
  updateShowTime: any;
  modifyUrl: any;
  modifyKeyIdArray = [];
  modifyKeyIds: any;
  updateStrategyName: any;
  updateStrategyDate: any;
  updateStrategyTime: any;
  checkerData: ModifyDataInfo[];
  modify_Display = false;
  /* 修改策略明细确认 */
  checkedRowsData = [];
  detailed_Display = false;
  detailedConfirm_Display = false;
  /* 定时任务 */
  private timer;
  /* 表通用对象 */
  decision: TableDataInfo;
  loading: boolean = false;
  loading1: boolean = false;
  /* 提醒模块 */
  msgs: Message[] = [];
  /* 时间通用 */
  cn: any;
  /* 树通用 */
  nodes1 = [];
  /* 删除弹窗 */
  deleteDisplay = false;

  constructor(
    private http: Http,
    private httpclient: HttpClient,
    private confirmationService: ConfirmationService, private pagesService: PagesService) {
    /* 设备类型 */  
    this.productList = [
      { label: 'ADAS', value: { id: 2, productType: 'ADAS', code: '100' } },
      { label: 'DSM', value: { id: 3, productType: 'DSM', code: '101' } },
      { label: 'TPMS', value: { id: 4, productType: 'TPMS', code: '102' } },
      { label: 'BSD', value: { id: 5, productType: 'BSD', code: '103' } },
    ];
  }
  @ViewChild('lbstree1') lbstree1: LbsTreeComponent;
  @ViewChild('dt') dt: DataTable;
 
  /* 策略升级任务和返回按钮，页面左滑切换 */
  count = 0;
  change() {
    if (this.count == 0) {
     /*  $("#showOrHideTable").slideUp("fast");
      $("#another").slideDown("fast"); */
      /* 使用动画效果实现左右滑动 */
      $("#showOrHideTable").animate({ width: '100%', }, 1);
      $("#showOrHideTable").animate({ width: '0', opacity: '0.5' }, 1000);
      $("#showOrHideTable").hide(10);
      $("#another").animate({ width: '0', }, 1);
      $("#another").animate({ width: '100%', opacity: '1' }, 1000);
      $("#another").show(10);
      this.count++;
      this.loading1 = true;
      if ((this.pagesService.formateDateToStr(this.strategyBeginDate)) != '') {
        this.strategyBeginTime = this.pagesService.formateDateToStr(this.strategyBeginDate);
        this.strategyEndTime = this.pagesService.formateDateToStr(this.strategyEndDate);
      } else {
        this.strategyBeginTime = this.strategyBeginDate.toString();
        this.strategyEndTime = this.strategyEndDate.toString();
      }
      if (this.strategyName == undefined) {
        this.strategyName = '';
      }
      if (this.strategyBeginTime == null) {
        this.strategyBeginTime = '';
      }
      if (this.strategyEndTime == null) {
        this.strategyEndTime = '';
      }
      const params = new HttpParams().set('planName', this.strategyName).set('startTime', this.strategyBeginTime)
        .set('endTime', this.strategyEndTime);
      this.httpclient.request('POST', environment.INTERFACE_URL + '/api/searchPlan',
        {
          responseType: 'json', params,
        })
        .subscribe(data => {
          this.searchPlanData = data;
          this.loading1 = false;
        });
      return;
    }
    if (this.count == 1) {
      /* $("#another").slideUp("fast");
      $("#showOrHideTable").slideDown("fast"); */
      $("#another").animate({ width: '100%', }, 1);
      $("#another").animate({ width: '0', opacity: '0.5' }, 1000);
      $("#another").hide(10);
      $("#showOrHideTable").animate({ width: '0', }, 1);
      $("#showOrHideTable").animate({ width: '100%', opacity: '1' }, 1000);
      $("#showOrHideTable").show(10);
      this.count = 0;
      return;
    }
  }
  /* 导出报表 */
  exportCSV() {
    if (this.searchTerminalData.length > 0) {
      this.dt.exportCSV();
    } 
  }
  /* 立即升级弹框显示 */
  showDialog() {
    this.searchTerminalData2 = this.searchTerminalData_dialog;
    //立即升级dialog显示
    this.display = true;
    //dialog显隐标记确定
    this.upgradeImmedately = true;
    //重置升级地址
    this.updateUrl = '';
  }
  /* 策略升级弹窗显示 */
  showInfoDialog() {
    this.searchTerminalData3 = this.searchTerminalData_dialog;
    this.updateDate = new Date();
    this.strategyDisplay = true;
  }
  /* 遍历查询结果中的keyid，转化成字符串 */
  loopForKeys(){
    if (this.searchTerminalData != undefined || this.searchTerminalData.length > 0) {
      let keyIds = '';
      this.searchTerminalData.forEach((every) => {
        if(every.KEYID != '' || every.KEYID != undefined){
          keyIds += "" + every.KEYID + ",";
        }
      });
      keyIds = keyIds.substring(0, keyIds.length - 1);
      this.keyIdsForUpdate = keyIds;
    }
  }
  /* 立即升级确认按钮 */
  updateRightNow() {
    //判断是否已选择终端
    if(this.searchTerminalData == undefined || this.searchTerminalData.length ==0){
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: '', detail: '请先选择车辆终端!' });
      return;
    }
    this.loopForKeys();
    const params = new HttpParams().set('commandId', '0').set('commandPara', this.updateUrlForNow)
      .set('keyIdList', this.keyIdsForUpdate);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/saveMsg',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.display = false;
        this.searchTerminalData2 = undefined;
        this.updateUrlForNow = '';
        //定时查询任务
        this.timeTask();
      });
  }
  /* 定时任务 */
  timeTask() {
    this.timer = setInterval(() => {
      this.searchTerminal();
    }, 30000);
  }
  /* 策略升级保存按钮 */
  updateInTime() {
    //判断是否已选择终端
    if(this.searchTerminalData == undefined || this.searchTerminalData.length ==0){
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: '', detail: '请先选择车辆终端!' });
      return;
    }
    this.loopForKeys();
    this.updateTime = this.pagesService.formateDateToStr(this.updateDate);
    const params = new HttpParams().set('commandId', '1').set('commandPara', this.updateUrlForSta)
      .set('keyIdList', this.keyIdsForUpdate).set('planName', this.updateName).set('planTime', this.updateTime);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/savePlan',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.strategyDisplay = false;
        this.searchTerminalData3 = undefined;
        this.updateName = '';
        this.updateUrlForSta = '';
        this.updateDate = new Date();
      });
  }
  /* 立即升级和策略升级的弹窗的隐藏事件 */
  close() {
    this.searchTerminalData2 = undefined;
    this.searchTerminalData3 = undefined;
    this.updateUrlForNow = '';
    this.updateName = '';
    this.updateUrlForSta = '';
    this.updateDate = new Date();
  }
  /* 查看详情弹窗显示 */
  viewDetial(decision: TableDataInfo) {
    this.decision = decision;
    this.updateStrategyName1 = this.decision.PLAN_NAME;
    this.updateStrategyDate1 = this.decision.PLAN_TIME;
    this.updateUrl1 = this.decision.COMMAND_PARA;
    this.createUser1 = this.decision.CREATEDBY;
    this.createTime1 = this.decision.CREATEDON;
    this.modifyBy1 = this.decision.MODIFIEDBY;
    this.modifyOn1 = this.decision.MODIFIEDON;
    this.detailDisplay = true;
  }
  /* 查看详情明细弹窗显示 */
  viewDetials() {
    //刷新显示值
    this.modifyDecision(this.decision);
    this.detailsDisplay = true;
  }
  /* 策略任务修改弹窗显示 */
  newModifyDisplay(decision: TableDataInfo) {
    this.decision = decision;
    //刷新显示值
    this.modifyDecision(this.decision);
    this.updateStrategyName = this.decision.PLAN_NAME;
    this.updateShowTime = this.decision.PLAN_TIME;
    this.modifyUrl = this.decision.COMMAND_PARA;
    this.createUser1 = this.decision.CREATEDBY;
    this.createTime1 = this.decision.CREATEDON;
    this.modifyBy1 = this.decision.MODIFIEDBY;
    this.modifyOn1 = this.decision.MODIFIEDON;
    this.modify_Display = true;
  }
  /* 策略修改明细弹窗显示 */
  newDetailedDisplay() {
    this.checkerData = this.terminalDataForUpdate;
    this.detailed_Display = true;
  }
  /* 明细自查 */
  selfQuery() {
    this.terminalDataForUpdate = this.terminalData;
    let count = this.terminalDataForUpdate.length;
    let newArray = [];
    //车牌号条件若不为空则判断表格对应数据是否包含该字段
    if (this.selfQueryCar != '' && this.selfQueryCar != undefined) {
      for (let i = 0; i < count; i++) {
        if ((this.terminalDataForUpdate[i].CARNO_AND_COLOR + '').indexOf(this.selfQueryCar + '') >= 0) {
          newArray.push(this.terminalDataForUpdate[i]);
        }
      }
    } else {
      newArray = this.terminalDataForUpdate;
    }
    this.newTerminalDataForUpdate = [];
    if (newArray != null || newArray != undefined) {
      let count2 = newArray.length;
      //版本号条件若不为空则判断表格对应数据是否包含该字段
      if (this.selfQueryEdition != '' && this.selfQueryEdition != undefined) {
        for (let i = 0; i < count2; i++) {
          if ((newArray[i].SOFT_VESION + '').indexOf(this.selfQueryEdition + '') >= 0) {
            this.newTerminalDataForUpdate.push(newArray[i]);
          }
        }
      } else {
        this.newTerminalDataForUpdate = newArray;
      }
    } else {
      this.newTerminalDataForUpdate = [];
    }
    //把最后筛选判断出来的数据用于自查后的显示
    this.terminalDataForUpdate = this.newTerminalDataForUpdate;
  }
  /* 策略修改明细确认按钮 */
  newDetailedConfirm() {
    this.checkedRowsData = this.checkerData;
    this.detailedConfirm_Display = true;
    this.detailed_Display = false;
  }
  /* 策略修改明细确认按钮--关闭弹窗 */
  newCloseConfirm() {
    this.detailedConfirm_Display = false;
  }
  /* 策略修改保存按钮 */ 
  modifySave() {
     // 先取keyIds并判断勾选的终端数
     this.modifyKeyIdArray = [];
     this.modifyKeyIds = '';
     if (this.checkedRowsData != undefined || this.checkedRowsData.length != 0) {
       for (let i = 0; i < this.checkedRowsData.length; i++) {
         this.modifyKeyIdArray.push(this.checkedRowsData[i].KEYID);
       }
       for (let j = 0; j < this.modifyKeyIdArray.length; j++) {
         this.modifyKeyIds += this.modifyKeyIdArray[j] + ',';
       }
       this.modifyKeyIds = this.modifyKeyIds.substring(0, this.modifyKeyIds.length - 1);
     } else {
       this.modifyKeyIds = '';
     }
     if(this.modifyKeyIdArray.length <= 0){
       this.msgs = [];
       this.msgs.push({ severity: 'warn', summary: '', detail: '至少选择一辆终端!' });
       return;
     }
     //字段初始化校验
     if (this.updateStrategyDate == undefined) {
       this.updateStrategyTime = this.updateShowTime;
     } else {
       this.updateStrategyTime = this.pagesService.formateDateToStr(this.updateStrategyDate);
     }
     if (this.modifyUrl == undefined) {
       this.modifyUrl = '';
     }
    const params = new HttpParams().set('id', this.decision.ID).set('commandId', '1').set('commandPara', this.modifyUrl)
      .set('keyIdList', this.modifyKeyIds).set('planName', this.updateStrategyName).set('planTime', this.updateStrategyTime);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/updatePlan',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.checkedRowsData = [];
        //保存后自动刷新策略任务表
        this.searchStrategy();
        this.modify_Display = false;
        this.updateStrategyDate = undefined;
      });
  }
  /* 关闭策略修改弹窗 */
  closeModify(){
    this.updateStrategyDate = undefined;
  }
  /* 查询查看详情、策略修改对应任务的终端信息 */
  modifyDecision(decision: TableDataInfo) {
    this.decision = decision;

    const params = new HttpParams().set('id', this.decision.ID);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getPlanInfoList',
      {
        responseType: 'json', params,
      })
      .subscribe((data: any) => {
        this.terminalData = data;
        this.terminalDataForUpdate = data;
        this.checkedRowsData = data;
      });
  }
  /* 删除标签 */
  deletAction(decision: TableDataInfo) {
    this.deleteDisplay = true;
    this.decision = decision;
  }
  /* 删除弹窗确认 */
  confirmDelete() {
    const params = new HttpParams().set('idList', this.decision.ID);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/delPlan',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.deleteDisplay = false;
        this.searchStrategy();
      });
  }
  /* 删除取消 */
  Undelete() {
    this.deleteDisplay = false;
  }
  /* 从车辆树获取keyIds */
  getKeyIdFromTree(tree) {
    let nodeArray = new Array();
    nodeArray = tree.getAllcheckedNode();
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
  /* 终端查询 */
  searchTerminal() {
    this.loading = true;
    if ((this.pagesService.formateDateToStr(this.searchBeginDate)) != '') {
      this.searchBeginTime = this.pagesService.formateDateToStr(this.searchBeginDate);
      this.searchEndTime = this.pagesService.formateDateToStr(this.searchEndDate);
    } else {
      this.searchBeginTime = this.searchBeginDate.toString();
      this.searchEndTime = this.searchEndDate.toString();
    }
    if (this.terminalInput == undefined) {
      this.terminalInput = '';
    }
    if (this.searchBeginTime == null) {
      this.searchBeginTime = '';
    }
    if (this.searchEndTime == null) {
      this.searchEndTime = '';
    }
    if (this.selectedProduct == undefined) {
      this.selectedProduct = { productType: 'ADAS', code: '100' };
    }
    //查询前把勾选终端的keyid put进idListForTerm
    this.queryKeyIds = ''
    this.getKeyIdFromTree(this.lbstree1);
    if (this.queryKeyIds == undefined) {
      this.queryKeyIds = '';
    } 
    const params = new HttpParams().set('softVesion', this.terminalInput).set('startTime', this.searchBeginTime)
      .set('endTime', this.searchEndTime).set('keyIdList', this.queryKeyIds).set('deviceId', this.selectedProduct.code);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getTerminal',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.searchTerminalData = data;
        this.searchTerminalData_dialog = data;
        this.loading = false;
      });
  }
  /* 策略任务查询 */
  searchStrategy() {
    this.loading1 = true;
    if ((this.pagesService.formateDateToStr(this.strategyBeginDate)) != '') {
      this.strategyBeginTime = this.pagesService.formateDateToStr(this.strategyBeginDate);
      this.strategyEndTime = this.pagesService.formateDateToStr(this.strategyEndDate);
    } else {
      this.strategyBeginTime = this.strategyBeginDate.toString();
      this.strategyEndTime = this.strategyEndDate.toString();
    }
    if (this.strategyName == undefined) {
      this.strategyName = '';
    }
    if (this.strategyBeginTime == null) {
      this.strategyBeginTime = '';
    }
    if (this.strategyEndTime == null) {
      this.strategyEndTime = '';
    }
    const params = new HttpParams().set('planName', this.strategyName).set('startTime', this.strategyBeginTime)
      .set('endTime', this.strategyEndTime);
    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/searchPlan',
      {
        responseType: 'json', params,
      })
      .subscribe(data => {
        this.searchPlanData = data;
        this.loading1 = false;
      });
  }
  /* 终端查询时间控件 */
  dateRangePicker() {
    let picker: any = $('#startEndTime');
    let dataRageOption: Object = globalTime.dataRageOption;
    picker.daterangepicker(dataRageOption, (start, end, label) => {
      this.searchBeginDate = start.format('YYYY-MM-DD HH:mm:ss');
      this.searchEndDate = end.format('YYYY-MM-DD HH:mm:ss');
    });
  }
  /* 策略任务查询时间控件 */
  dateRangePicker2() {
    let picker: any = $('#startEndTime2');
    let dataRageOption: Object = globalTime.dataRageOption;
    picker.daterangepicker(dataRageOption, (start, end, label) => {
      this.strategyBeginDate = start.format('YYYY-MM-DD HH:mm:ss');
      this.strategyEndDate = end.format('YYYY-MM-DD HH:mm:ss');
    });
  }
  ngOnInit() {
    this.loading = true;
    this.nodes1 = this.lbstree1.getNodes();
    this.lbstree1.showSearch = false;
    // 初始化时间
    this.cn = globalTime.cn;
    this.updateDate = new Date();
    let d = new Date();
    this.searchBeginDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    this.searchEndDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
    this.searchBeginTime = this.pagesService.formateDateToStr(this.searchBeginDate);
    this.searchEndTime = this.pagesService.formateDateToStr(this.searchEndDate);
    this.strategyBeginDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    this.strategyEndDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
    this.strategyBeginTime = this.pagesService.formateDateToStr(this.strategyBeginDate);
    this.strategyEndTime = this.pagesService.formateDateToStr(this.strategyEndDate);
    this.dateRangePicker();
    this.dateRangePicker2();
    this.getKeyIdFromTree(this.lbstree1);
    //初始化查询终端
    this.searchTerminal();
    this.updateUrlForNow = "";
    this.updateUrlForSta = "";
    this.updateName = "";
  }
}
