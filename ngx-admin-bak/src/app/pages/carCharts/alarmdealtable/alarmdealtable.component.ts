import { Component, OnInit, ViewChild } from '@angular/core';
import { Button, DataTable, SelectItem, Dialog } from 'primeng/primeng';
import { isDate, isNullOrUndefined, isUndefined } from 'util';
import { AlarmData, AlarmLevel, AlarmType, DealState, DealResult } from './alarmModel';
import { AlarmDealService } from './alarmdealtable.service';
import { LbsTreeComponent } from 'app/pages/demos/lbstree/lbstree.component';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { PagesService } from 'app/pages/pages.service';
@Component({
    selector: 'ngx-alarmdeal',
    templateUrl: 'alarmdealtable.component.html',
    styleUrls: ['alarmdealtable.component.scss'],
})
export class AlarmdealComponent {
    cn = {
        firstDayOfWeek: 0,
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        today: '今天',
        clear: '清除',
    };
    searchCarNo: any;
    //报警类型下拉列表集合及选中项
    alarmList: SelectItem[];
    selectedAlarm: AlarmType;
    //报警等级下拉列表集合及选中项
    leveloptions: AlarmLevel[];
    selectedLevel: AlarmLevel;
    //处理状态下拉列表集合及选中项
    dealState: DealState[];
    selectedstate: DealState;
    begin_Date: any;
    end_Date: any;
    loading: boolean = false;
    //选中行数据
    alarminfo: AlarmData;
    //表数据集合
    alarmdata: AlarmData[];
    totalRecords: number = 0;
    rows: number = 5;
    cols: any[];
    // msgs: Message[] = [];
    dealdisplay: boolean = false;
    showdetail: boolean = false;
    showMessage: boolean = false;
    messageConfirm: boolean = true;
    messageContent: string = '';
    videoShow: boolean = false;

    platecolor: string;
    location: string;
    dealPerson: string;

    dealResult: DealState[];
    selectedDealResult: DealState;
    dealComment: string;

    searchdriverName: string;

    alarmTypeMap: Map<any, any> = new Map<any, any>();
    isShowLevel = true;
    visibleSidebar2 = false;
    @ViewChild('dt') dt: DataTable;
    @ViewChild('lbstree') lbstree: LbsTreeComponent;
    nodes = [];
    config: ToasterConfig;
    constructor(private service: AlarmDealService, private pagesService: PagesService,private toasterService: ToasterService) {
        this.alarmList = [];
        this.cols = [];
        this.alarmdata = [];
        this.alarminfo = {
            ID: '',
            ALARMDATE: '',
            ALARMINFO_LATITUDE: '',
            ALARMINFO_LONGITUDE: '',
            ALARM_DESC: '',
            ALARM_ENDDATE: '',
            ALARM_LEVEL: '',
            ALARM_LEVEL_STR: '',
            ALARM_SPEED: '',
            ALARM_TREAT: '',
            ALARM_TREATTIME: '',
            ALARM_TREATCONTENT: '',
            ALARM_TREAT_STR: '',
            ALARM_TYPE: '',
            CAR_AND_PLATECOLOR: '',
            CAR_DRIVER_NAME: '',
            CAR_ID: '',
            CAR_NO: '',
            DURATION: '',
            DURATION_SECEND: '',
            GROUPNAME: '',
            KEY_ID: '',
            PLATECOLOR: '',
            TREAT_PERSON: '',
            alarmName: '',
            alarmAdress: '',
        };
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    sendToasterMsg(msg) {
        this.showToast(msg.type, msg.title, msg.msg);
    }

    // 消息弹框
    showToast(type: string, title: string, msg: string) {
        this.config = new ToasterConfig({
            positionClass: 'toast-bottom-right',
            timeout: 5000,
            newestOnTop: true,
            tapToDismiss: true,
            preventDuplicates: false,
            animation: 'fade',
            limit: 5,
        });

        const toast: Toast = {
            type: type,
            title: title,
            body: msg,
            timeout: 5000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);
    }
    
    searchAlarm() {
        let car_no = '';
        let alarm_type;
        let groupids = [];
        let keyIds = [];
        let alarm_level = '';
        let driver_name = '';
        let alarmTreat;
        let begin_time = '';
        let end_time = '';

        let checkedNodeArr = this.lbstree.getAllcheckedNode();
        for (let index = 0; index < checkedNodeArr.length; index++) {
            if (checkedNodeArr[index].iconSkin == 't') {
                groupids.push(checkedNodeArr[index].id);
            }
            if (checkedNodeArr[index].iconSkin == 'on' || checkedNodeArr[index].iconSkin == 'off') {
                keyIds.push(checkedNodeArr[index].id);
            }
        }

        if (this.selectedAlarm != undefined) {
            alarm_type = this.selectedAlarm;
        } else {
            alarm_type = '';
        }
        if (this.selectedLevel.levelCode != null) {
            alarm_level = this.selectedLevel.levelCode + '';
        }
        if (this.searchdriverName != undefined && this.searchdriverName != '') {
            driver_name = this.searchdriverName;
        }
        if (this.selectedstate) {
            alarmTreat = this.selectedstate.dealType + '';
        }
        if (isDate(this.begin_Date)) {
            begin_time = this.pagesService.formateDateToStr(this.begin_Date);
        } else {
            begin_time = this.begin_Date;
        }

        if (isDate(this.end_Date)) {
            end_time = this.pagesService.formateDateToStr(this.end_Date);
        } else {
            end_time = this.end_Date;
        }
        this.loading = true;
        this.service.getAlarmData(car_no, alarm_type, groupids, keyIds, driver_name, alarm_level, alarmTreat, begin_time, end_time).then((val) => {
            if (isUndefined(val) || val == null) {
                this.loading = false;
                return;
            }
            this.totalRecords = val.length;
            //this.datasource = val;
            //this.alarmdata = this.datasource.slice(0, this.rows);
            this.alarmdata = val;
            this.loading = false;
        });
    }

    dealalarmshow(alarminfo: AlarmData) {
        this.dealdisplay = true;
        this.alarminfo = alarminfo;
        this.platecolor = getPlateColorStr(alarminfo.PLATECOLOR);
        this.location = alarminfo.alarmAdress;
        if (this.location == null || this.location == "") {
            this.location = "终端无法定位";
        }
        this.dealPerson = alarminfo.TREAT_PERSON;//dealPerson双向绑定，alarminfo.TREAT_PERSON初次为null，用于编辑处理中的报警信息
        this.dealComment = alarminfo.ALARM_TREATCONTENT;
        if (alarminfo.ALARM_DESC == null || alarminfo.ALARM_DESC == "") {
            alarminfo.ALARM_DESC = alarminfo.alarmName;
        }
        if (alarminfo.ALARM_TREAT != null) {
            if (alarminfo.ALARM_TREAT == 0) {
                this.selectedDealResult = { stateName: '处理中', dealType: 0 }
            }
            if (alarminfo.ALARM_TREAT == 1) {
                this.selectedDealResult = { stateName: '已处理', dealType: 1 }
            }
        } else {
            this.selectedDealResult = { stateName: '处理状态', dealType: -1 };
        }

    }

    saveDealResult() {
        if (this.alarminfo != null) {
            this.alarminfo.ALARM_TREAT = 1;
            if (this.dealPerson != null && this.dealPerson.replace(' ', '').length > 0) {
                this.alarminfo.TREAT_PERSON = this.dealPerson;
            } else {
                this.showMessage = true;
                this.messageConfirm = false;
                this.messageContent = '处理失败，处理人不能为空！'
                return;
            }
            if (this.dealComment != null && this.dealComment.replace(' ', '').length > 0) {
                this.alarminfo.ALARM_TREATCONTENT = this.dealComment
            } else {
                this.showMessage = true;
                this.messageConfirm = false;
                this.messageContent = '处理失败，处理意见不能为空！'
                return;
            }
            this.service.saveAlarmDealInfo(this.alarminfo)
                .subscribe(
                    (val: DealResult) => {
                        this.messageContent = val.message;
                        if (val.result == 1) {//失败
                            this.showMessage = true;
                            this.messageConfirm = false;
                        }
                        if (val.result == 0) {//成功
                            this.showMessage = true;
                            this.dealdisplay = false;
                            this.messageConfirm = true;
                            this.searchAlarm();
                        }
                    });
        }
    }

    cancel() {
        this.dealdisplay = false;
        this.selectedDealResult = { stateName: '处理状态', dealType: -1 };
        this.dealPerson = '';
        this.dealComment = '';
    }

    confirm() {
        this.showMessage = false;
    }

    //观看视频
    watchVideo() {
        this.videoShow = true;
    }
    //查看详情
    alarmdetailshow(alarminfo: AlarmData) {
        this.showdetail = true;
        this.service.getAlarmDataById(alarminfo.ID).then(data => {
            this.alarminfo = data;
            this.platecolor = getPlateColorStr(alarminfo.PLATECOLOR);
            this.location = alarminfo.alarmAdress;
            if (this.location == null || this.location == "") {
                this.location = "终端无法定位";
            }
            if (alarminfo.ALARM_DESC == null || alarminfo.ALARM_DESC == "") {
                this.alarminfo.ALARM_DESC = alarminfo.alarmName;
            }
        });
    }

    exportCSV() {
        if (this.alarmdata.length > 0) {
            this.dt.exportCSV();
        } else {

        }
    }

    // count = 0;
    // change() {
    //     if (this.count == 0) {
    //         $(".tablediv").hide("slow");
    //         $("#another").show("slow");
    //         this.count++
    //         return;
    //     }
    //     if (this.count == 1) {
    //         $("#another").hide("slow");
    //         $(".tablediv").show("slow");
    //         this.count = 0
    //         return;
    //     }

    // }
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

    ngOnInit() {
        this.cols = [
            { field: 'CAR_AND_PLATECOLOR', header: '车牌', sort: false, style: { 'width': '13%', 'text-align': 'center' } },
            { field: 'superGroupName', header: '分组', sort: true, style: { 'width': '8%', 'text-align': 'center' } },
            { field: 'alarmName', header: '报警类型', sort: false, style: { 'width': '12%', 'text-align': 'center' } },
            { field: 'ALARM_LEVEL_STR', header: '报警等级', sort: true, style: { 'width': '12%', 'text-align': 'center' } },
            { field: 'ALARMDATE', header: '开始时间', sort: true, style: { 'text-align': 'center' } },
            { field: 'ALARM_ENDDATE', header: '结束时间', sort: false, style: { 'text-align': 'center' } },
            { field: 'CAR_DRIVER_NAME', header: '驾驶员', sort: false, style: { 'width': '8%', 'text-align': 'center' } }
        ];

        this.leveloptions = [{ levelName: '全部', levelCode: null }, { levelName: '一级报警', levelCode: 0 }, { levelName: '二级报警', levelCode: 1 }];
        this.selectedLevel = { levelName: '报警等级', levelCode: null };
        this.dealState = [
            { stateName: '全部报警', dealType: -1 }, //全部
            // { stateName: '处理中', dealType: 0 },
            { stateName: '已处理', dealType: 1 },//非默认值
            // { stateName: '不作处理', dealType: 2 },
            // { stateName: '将来处理', dealType: 3 },
            { stateName: '未处理', dealType: 0 } //默认值
        ];
        this.selectedstate = { stateName: '处理状态', dealType: -1 };

        this.service.getAlarmType().then((val) => {
            this.alarmList.push({ label: "全部报警", value: "" });
            this.alarmTypeMap.set(Number(""), "全部报警");
            for (let i = 0; i < val.length; i++) {
                this.alarmList.push({ label: val[i].name, value: val[i].alarmType });
                this.alarmTypeMap.set(Number(val[i].alarmType), val[i].name);
            }
        });

        let d = new Date();
        // this.begin_Date = new Date(2017, 11, 1);
        this.begin_Date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        this.end_Date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        this.dateRangePicker();

        // let begin_time = this.pagesService.formateStrToDateStr(2017, 11, 1) + ' 00:00:00';
        let begin_time = this.pagesService.formateStrToDateStr(d.getFullYear(), d.getMonth(), d.getDate()) + ' 00:00:00';
        let end_time = this.pagesService.formateStrToDateStr(d.getFullYear(), d.getMonth(), d.getDate()) + ' 23:59:59';
        let alarmTreat = '-1';
        this.loading = true;
        this.service.getAlarmData('', '', [], [], '', '', alarmTreat, begin_time, end_time).then((val) => {
            if (isUndefined(val) || val == null) {
                this.loading = false;
                return;
            }
            this.totalRecords = val.length;
            this.alarmdata = val;
            this.loading = false;
        }).catch(this.handleError);
        
        this.nodes = this.lbstree.getNodes();
        this.lbstree.nodeInitializationFalse(this.nodes);
    }

    showLevel() {
        this.isShowLevel = !isNullOrUndefined(this.alarmTypeMap.get(Number(this.selectedAlarm)));
    }


    // download(alarminfo: AlarmData) {
    //     let url1 = "assets/images/camera1.jpg";
    //     let url2 = "assets/images/2.mp4";
    //     if (myBrowser() === "IE" || myBrowser() === "Edge") {
    //         saveInIE(alarminfo, url1);
    //     } else {
    //         saveInChrome(alarminfo, url1);
    //     }
    // }

}


function getPlateColorStr(code) {
    let carcolor = '';
    if (code === 1 || code === '1') {
        carcolor = '蓝';
    } else if (code === 2 || code === '2') {
        carcolor = '黄';
    } else if (code === 3 || code === '3') {
        carcolor = '黑';
    } else if (code === 4 || code === '4') {
        carcolor = '白';
    } else {
        carcolor = '其他';
    }
    return carcolor;

}

// //判断浏览器类型
// function myBrowser() {
//     var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
//     var isOpera = userAgent.indexOf("Opera") > -1;
//     if (isOpera) {
//         return "Opera"
//     }; //判断是否Opera浏览器
//     if (userAgent.indexOf("Firefox") > -1) {
//         return "FF";
//     } //判断是否Firefox浏览器
//     if (userAgent.indexOf("Chrome") > -1) {
//         return "Chrome";
//     }
//     if (userAgent.indexOf("Safari") > -1) {
//         return "Safari";
//     } //判断是否Safari浏览器
//     if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
//         return "IE";
//     }; //判断是否IE浏览器
//     if (userAgent.indexOf("Trident") > -1) {
//         return "Edge";
//     } //判断是否Edge浏览器
// }

// //IE浏览器图片保存本地
// function saveInIE(alarminfo: AlarmData, src) {
//     console.log("IE");
//     let pic = window.open(src, '_blank');
//     pic.document.execCommand("SaveAs") 
// }


// //谷歌，360极速等浏览器下载
// function saveInChrome(alarminfo: AlarmData, src) {
//     console.log("chrome");
//     let $a = document.createElement('a');
//     $a.setAttribute("href", src);
//     $a.setAttribute("download", alarminfo.CAR_NO + " " + alarminfo.ALARMDATE + " " + alarminfo.alarmName);

//     let evObj = document.createEvent('MouseEvents');
//     evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
//     $a.dispatchEvent(evObj);
// }