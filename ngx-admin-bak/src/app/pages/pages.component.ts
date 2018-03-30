import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { HttpClient, HttpRequest, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { HttpModule, Http } from '@angular/http';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import * as mqtt from 'mqtt';
import { transform } from 'utils/maptrans.utils';
import { isDate, isUndefined } from 'util';
import * as iconv from 'iconv-lite';
import * as L from 'leaflet';
import { OnInit, OnDestroy } from '@angular/core';
import { PagesService } from 'app/pages/pages.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { ViewChild } from '@angular/core';
import { LbsAlarmComponent } from 'app/pages/lbs-alarm/lbs-alarm.component';

@Component({
    selector: 'ngx-pages',
    template: `
    
    <ngx-sample-layout>
      <nb-menu [items]="menu">
      </nb-menu>
      <router-outlet>
      </router-outlet>
    </ngx-sample-layout>
    <!--<p-growl [(value)]="myMsgs.myMessage" [sticky]="false" [life]="6000">
        
    </p-growl>-->
  `,
    styleUrls: ['./pages.component.scss'],
})
// <lbs-alarm #lbsAlarm></lbs-alarm>
export class PagesComponent implements OnInit, OnDestroy {

    menu = MENU_ITEMS;

    constructor(private http: Http, private httpclient: HttpClient,
        private $sessionStorage: SessionStorageService,
        private $localStorage: LocalStorageService,
        private pagesService: PagesService) {
        this.topic = '';
        this.client = mqtt.Client;
        this.carListData = new Array();
        this.carTreeData = new Array();
        this.carRealData = new Array();
        this.lastTime = new Date();
        this.oldTime = new Date();
        this.date = new Date();
        this.strTime = '';
        this.alarmDate = new Date();
    }
    @ViewChild('lbsAlarm') lbsAlarm: LbsAlarmComponent;
    private messageService: MessageService;
    // public msgs: Message[] = [];
    // private messages = {myMessage:this.msgs};
    // public myMsgs:Message[] = this.messages.myMessage;
    public myMsgs = { myMessage: [] };
    private offLineSidebar = { myOffLineSidebar: false };
    public visibleSidebar = { myVisibleSidebar: false };
    public alertCarInfo = { alertCarNo: '' };
    public offAlertCarInfo = { offAlertCarNo: '' };
    private alarmDate: any;
    private strTime: any;
    private lastTime: any;
    private oldTime: any;
    private leafletMap: any;
    private myIcon2 = L.icon({
        iconUrl: './assets/images/icon_map_taxi_on.svg',
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [-0, -40],
    });
    private date: Date;
    private topic: string;
    private client: any;
    private carListData = [];
    private carTreeData = [];
    private carRealData = [];
    private transformtoTree(data: any) {
        let i, l;
        const key = 'id', childKey = 'children';
        const parentKey = 'pId';
        if (!key || !data) return [];

        if (this.isArray(data)) {
            const r = [];
            const tmpMap = [];
            for (i = 0, l = data.length; i < l; i++) {
                if (!data[i]['checked'])
                    data[i]['checked'] = false;
                tmpMap[data[i][key]] = data[i];
            }

            for (i = 0, l = data.length; i < l; i++) {
                if (tmpMap[data[i][parentKey]] && data[i][key] != data[i][parentKey]) {
                    if (!tmpMap[data[i][parentKey]][childKey])
                        tmpMap[data[i][parentKey]][childKey] = [];
                    tmpMap[data[i][parentKey]][childKey].push(data[i]);
                } else {
                    r.push(data[i]);
                }
            }
            return r;
        } else {
            return [data];
        }
    }

    ngAfterViewInit() {

    }

    ngOnInit(): void {
        //控制单点登录时是否要连接MQ
        const ifShow = this.$sessionStorage.retrieve('hideMenu')|| this.$sessionStorage.retrieve('hideMenu');
        if (ifShow !== undefined && ifShow !== null && ifShow == 'h') {
            //不显示左侧菜单，不连接MQ

        } else {
            // 初始化树的数据
            const params = new HttpParams();

            this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getTreeArrayData',
                {
                    responseType: 'json', params,
                }).subscribe((data: any) => {
                    this.carListData = data;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].pId == 0) {
                            this.carListData[i]["expand"] = true;
                            break;
                        }
                    }
                    this.$sessionStorage.store('carListData', this.carListData);

                    //转换树的数据
                    this.carTreeData = this.transformtoTree(this.carListData);
                    this.$sessionStorage.store('carTreeData', this.carTreeData);
                    this.$localStorage.store('carTreeData', this.carTreeData);

                    //取keyIds
                    let keyIds = '';
                    this.carListData.forEach((checkedNode) => {
                        if (checkedNode.iconSkin !== 'm' && checkedNode.iconSkin !== 't') {
                            keyIds += "" + checkedNode.id + ",";
                        }
                    });
                    keyIds = keyIds.substring(0, keyIds.length - 1);
                    //查询实时数据
                    const params1 = new HttpParams().set('keyId', keyIds);
                    this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getCarRealData',
                        { responseType: 'json', params: params1, })
                        .subscribe(data => {
                            this.$sessionStorage.store('carRealData', data);
                            // 显示左侧菜单，初始化连接MQ
                            this.openMQ(keyIds);
                        });

                }
                );
        }





    }

    ngOnDestroy() {
        //销毁组件时，断开MQ连接
        this.closeMQ();
    }

    isArray(arr: any) {
        return Object.prototype.toString.apply(arr) === '[object Array]';
    }

    openMQ(keyIds) {
        const settings = {
            clientId: 'clientid_' + Math.floor(Math.random() * 65535),
            username: 'Server_fence',
            password: 'z@excy56p[',
            session: this.$sessionStorage,
            localSession: this.$localStorage,
            service: this.pagesService,
            sidebarState: this.visibleSidebar,
            alertInfos: this.alertCarInfo,
            offSidebarState: this.offLineSidebar,
            offAlertInfos: this.offAlertCarInfo,
            onLineInfos: this.myMsgs,
            lbsAlarm: this.lbsAlarm,
        }
        const mqtturl = environment.mqUrl;

        this.client = mqtt.connect(mqtturl, settings);

        let keyIdsArr = keyIds.split(',');
        keyIds = '';
        for (let i = 0; i < keyIdsArr.length; i++) {
            keyIds += "'" + keyIdsArr[i] + "',";
        }
        keyIds = keyIds.substring(0, keyIds.length - 1);

        this.client.on('connect', function () {
            console.log('connect :)');
            // 订阅部标协议数据
            const topic = "mqtt:DOTEXTENDINFO:COMMAND=0x301 and KEYID IN (" + keyIds + ")";
            // 订阅鸿信协议数据
            const hxTopic = "mqtt:Gpslocation:COMMAND=1 and KEYID IN (" + keyIds + ")";
            // 订阅报警数据
            // const warnTopic = "mqtt:DOTEXTENDINFO:COMMAND=0x303 and KEYID IN (" + keyIds + ")";
            // 订阅离线数据
            const offTopic = "mqtt:DOTOFFLINE:COMMAND=0x0701 and KEYID IN (" + keyIds + ")";

            // this.subscribe([topic, warnTopic, hxTopic, offTopic]);
            this.subscribe([topic, hxTopic, offTopic]);
            // const topic = "mqtt:DOTEXTENDINFO:COMMAND=0x301";
            // this.subscribe(topic);
        });



        this.client.on('error', function (error) {
            console.log(error.toString());
        });
        this.client.on('message', function (topic, payload) {
            let analyzeResult = {
                topic: '', keyId: '', carNo: '', lat: 0, lon: 0, gpsTime: '', color: 0, speed: 0, direct: 0, mile: 0,
                mqLon: 0, mqLat: 0, tmpLatlon: [], year: '', month: '', day: '', time: '', warnSrc: 0,
                commandId: 0, warnTypeCode: 0, infoId: 0, infoLen: 0, infoCont: ''
            }

            if (payload.length > 0) {
                const carList = this.options.session.retrieve('carRealData');
                const carTreeList = this.options.session.retrieve('carTreeData') || this.options.localSession.retrieve('carTreeData');
                let warnTime;
                if (topic == 'DOTEXTENDINFO') {
                    analyzeResult.commandId = payload.readInt16BE(12);
                    // console.log(commandId);
                    if (analyzeResult.commandId == 4610) {
                        //交通部协议定位数据
                        analyzeResult.topic = 'DOTEXTENDINFO';
                        analyzeResult.carNo = iconv.decode(getByteByIndex(payload, 31, 21), 'gbk');
                        analyzeResult.mqLon = payload.readUInt32BE(60) / 1000000;
                        analyzeResult.mqLat = payload.readUInt32BE(64) / 1000000;
                        analyzeResult.tmpLatlon = transform(Number(analyzeResult.mqLat), Number(analyzeResult.mqLon));
                        analyzeResult.lat = analyzeResult.tmpLatlon[0];
                        analyzeResult.lon = analyzeResult.tmpLatlon[1];
                        analyzeResult.year = payload.readInt16BE(55)
                        analyzeResult.month = add0(payload[54]);
                        analyzeResult.day = add0(payload[53]);
                        analyzeResult.time = add0(payload[57]) + ':' + add0(payload[58]) + ':' + add0(payload[59]);
                        analyzeResult.gpsTime = analyzeResult.year + '-' + analyzeResult.month + '-' + analyzeResult.day + ' ' + analyzeResult.time;
                        analyzeResult.keyId = iconv.decode(getByteByIndex(payload, 15, 16), 'gbk');
                        analyzeResult.color = payload[51];
                        analyzeResult.speed = payload.readInt16BE(68);
                        analyzeResult.direct = payload.readInt16BE(76);
                        analyzeResult.mile = payload.readInt32BE(72);
                        this.options.service.announceMission(analyzeResult);
                        //更新session数据
                        for (let i = 0; i < carList.length; i++) {
                            if (carList[i].KEYID == analyzeResult.keyId) {
                                this.lastTime = new Date(analyzeResult.gpsTime);
                                this.strTime = carList[i].LAST_TIME.substring(0, 4) + '-' +
                                    carList[i].LAST_TIME.substring(4, 6) + '-' + carList[i].LAST_TIME.substring(6, 8) +
                                    ' ' + carList[i].LAST_TIME.substring(8, 10) + ':' + carList[i].LAST_TIME.substring(10, 12) + ':' +
                                    carList[i].LAST_TIME.substring(12);
                                this.oldTime = new Date(this.strTime);

                                if (this.oldTime < this.lastTime) {
                                    this.alarmDate = new Date(carList[i].alarmTime);
                                    const alarmTime = (this.lastTime.getTime() - this.alarmDate.getTime()) / 1000 / 60;
                                    const status = 1;
                                    carList[i].LAST_TIME = analyzeResult.gpsTime.replace('-', '').replace('-', '')
                                        .replace(':', '').replace(':', '').replace(' ', '');
                                    carList[i].LAST_LATITUDE = analyzeResult.lat;
                                    carList[i].LAST_LONGITUDE = analyzeResult.lon;
                                    carList[i].LAST_SPEED = analyzeResult.speed;
                                    carList[i].LAST_ALTITUDE = analyzeResult.direct;


                                    //上线提醒                                    
                                    const arr = new Array();
                                    if (carTreeList.length > 0) {

                                        for (let n = 0; n < carTreeList.length; n++) {

                                            onlineInfoAlert(carTreeList[n], analyzeResult.keyId, this.options.sidebarState.myVisibleSidebar, arr);

                                        }
                                        if (arr.length >= 1) {
                                            this.options.onLineInfos.myMessage.push({
                                                severity: 'info', summary: '上线消息',
                                                detail: analyzeResult.carNo + ' 上线'
                                            });
                                        }

                                    }

                                    //实时更新 车辆树状态
                                    if (carTreeList.length > 0) {
                                        for (let n = 0; n < carTreeList.length; n++) {
                                            getChildData(carTreeList[n], status, analyzeResult.keyId, alarmTime);
                                        }
                                    }

                                }
                            }
                        }
                    } else if (analyzeResult.commandId == 5122) {
                        //报警数据
                        analyzeResult.topic = 'DOTEXTENDINFO';
                        analyzeResult.keyId = iconv.decode(getByteByIndex(payload, 15, 16), 'gbk');
                        analyzeResult.carNo = iconv.decode(getByteByIndex(payload, 31, 21), 'gbk');
                        analyzeResult.color = payload[51];
                        analyzeResult.warnSrc = payload[52];
                        analyzeResult.warnTypeCode = payload.readInt16BE(53);
                        warnTime = new Date(payload.readInt32BE(59) * 1000);;
                        analyzeResult.year = warnTime.getFullYear();
                        analyzeResult.month = add0(warnTime.getMonth() + 1);
                        analyzeResult.day = add0(warnTime.getDate());
                        analyzeResult.time = add0(warnTime.getHours()) + ':' + add0(warnTime.getMinutes()) + ":" + add0(warnTime.getSeconds());
                        analyzeResult.gpsTime = analyzeResult.year + '-' + analyzeResult.month + '-' + analyzeResult.day + ' ' + analyzeResult.time;
                        // console.log(warnSrc+' | '+warnTypeCode+' | '+gpsTime);
                        analyzeResult.infoId = payload.readInt32BE(63);
                        analyzeResult.infoLen = payload.readInt32BE(67);
                        analyzeResult.infoCont = iconv.decode(getByteByIndex(payload, 72, analyzeResult.infoLen), 'gbk');
                        this.options.service.announceMission(analyzeResult);
                        // this.options.lbsAlarm.display = true;
                        //更新session数据
                        for (let i = 0; i < carList.length; i++) {
                            if (carList[i].KEYID == analyzeResult.keyId) {
                                this.lastTime = new Date(analyzeResult.gpsTime);
                                this.strTime = carList[i].LAST_TIME.substring(0, 4) + '-' +
                                    carList[i].LAST_TIME.substring(4, 6) + '-' + carList[i].LAST_TIME.substring(6, 8) +
                                    ' ' + carList[i].LAST_TIME.substring(8, 10) + ':' + carList[i].LAST_TIME.substring(10, 12) + ':' +
                                    carList[i].LAST_TIME.substring(12);
                                this.oldTime = new Date(this.strTime);

                                if (this.oldTime < this.lastTime) {
                                    this.alarmDate = new Date(carList[i].alarmTime);
                                    const alarmTime = (this.lastTime.getTime() - this.alarmDate.getTime()) / 1000 / 60;
                                    const status = 2;
                                    carList[i].LAST_TIME = analyzeResult.gpsTime.replace('-', '').replace('-', '')
                                        .replace(':', '').replace(':', '').replace(' ', '');

                                    carList[i].alarmTime = analyzeResult.gpsTime;

                                    //实时更新 车辆树状态
                                    if (carTreeList.length > 0) {
                                        for (let n = 0; n < carTreeList.length; n++) {
                                            getChildData(carTreeList[n], status, analyzeResult.keyId, alarmTime);
                                        }
                                    }
                                }
                            }
                        }

                    }
                } else if (topic == 'Gpslocation') {
                    //GPS定位
                    analyzeResult.topic = 'Gpslocation';
                    analyzeResult.keyId = iconv.decode(getByteByIndex(payload, 13, 16), 'gbk');
                    analyzeResult.lon = payload.readDoubleLE(28);
                    analyzeResult.lat = payload.readDoubleLE(36);
                    analyzeResult.year = arrToString(payload.slice(44, 48));
                    analyzeResult.month = arrToString(payload.slice(48, 50));
                    analyzeResult.day = arrToString(payload.slice(50, 52));
                    analyzeResult.time = arrToString(payload.slice(52, 54)) + ':' + arrToString(payload.slice(54, 56)) + ':' + arrToString(payload.slice(56, 58));
                    analyzeResult.gpsTime = analyzeResult.year + '-' + analyzeResult.month + '-' + analyzeResult.day + ' ' + analyzeResult.time;
                    analyzeResult.speed = payload.readIntLE(60);
                    analyzeResult.direct = payload.readIntLE(64);
                    this.options.service.announceMission(analyzeResult);
                    //更新session数据
                    for (let i = 0; i < carList.length; i++) {
                        if (carList[i].KEYID == analyzeResult.keyId) {
                            this.lastTime = new Date(analyzeResult.gpsTime);
                            this.strTime = carList[i].LAST_TIME.substring(0, 4) + '-' +
                                carList[i].LAST_TIME.substring(4, 6) + '-' + carList[i].LAST_TIME.substring(6, 8) +
                                ' ' + carList[i].LAST_TIME.substring(8, 10) + ':' + carList[i].LAST_TIME.substring(10, 12) + ':' +
                                carList[i].LAST_TIME.substring(12);
                            this.oldTime = new Date(this.strTime);

                            if (this.oldTime < this.lastTime) {
                                this.alarmDate = new Date(carList[i].alarmTime);
                                const alarmTime = (this.lastTime.getTime() - this.alarmDate.getTime()) / 1000 / 60;
                                const status = 1;
                                carList[i].LAST_TIME = analyzeResult.gpsTime.replace('-', '').replace('-', '')
                                    .replace(':', '').replace(':', '').replace(' ', '');
                                carList[i].LAST_LATITUDE = analyzeResult.lat;
                                carList[i].LAST_LONGITUDE = analyzeResult.lon;
                                carList[i].LAST_SPEED = analyzeResult.speed;
                                carList[i].LAST_ALTITUDE = analyzeResult.direct;

                                //上线提醒                                    
                                const arr = new Array();
                                if (carTreeList.length > 0) {

                                    for (let n = 0; n < carTreeList.length; n++) {

                                        onlineInfoAlert(carTreeList[n], analyzeResult.keyId, this.options.sidebarState.myVisibleSidebar, arr);

                                    }
                                    if (arr.length >= 1) {
                                        this.options.onLineInfos.myMessage.push({
                                            severity: 'info', summary: '上线消息',
                                            detail: analyzeResult.carNo + ' 上线'
                                        });
                                    }

                                }

                                //实时更新 车辆树状态
                                if (carTreeList.length > 0) {
                                    for (let n = 0; n < carTreeList.length; n++) {
                                        getChildData(carTreeList[n], status, analyzeResult.keyId, alarmTime);
                                    }
                                }

                            }
                        }
                    }
                } else if (topic == 'DOTOFFLINE') {
                    //车辆离线数据
                    analyzeResult.topic = 'DOTOFFLINE';
                    analyzeResult.keyId = iconv.decode(getByteByIndex(payload, 13, 16), 'gbk');
                    this.options.service.announceMission(analyzeResult);
                    //更新session数据
                    for (let i = 0; i < carList.length; i++) {
                        if (carList[i].KEYID == analyzeResult.keyId) {
                            this.lastTime = new Date(analyzeResult.gpsTime);
                            this.strTime = carList[i].LAST_TIME.substring(0, 4) + '-' +
                                carList[i].LAST_TIME.substring(4, 6) + '-' + carList[i].LAST_TIME.substring(6, 8) +
                                ' ' + carList[i].LAST_TIME.substring(8, 10) + ':' + carList[i].LAST_TIME.substring(10, 12) + ':' +
                                carList[i].LAST_TIME.substring(12);
                            this.oldTime = new Date(this.strTime);

                            if (this.oldTime < this.lastTime) {
                                this.alarmDate = new Date(carList[i].alarmTime);
                                const alarmTime = (this.lastTime.getTime() - this.alarmDate.getTime()) / 1000 / 60;
                                const status = 0;
                                carList[i].LAST_TIME = analyzeResult.gpsTime.replace('-', '').replace('-', '')
                                    .replace(':', '').replace(':', '').replace(' ', '');

                                //实时更新 车辆树状态
                                if (carTreeList.length > 0) {
                                    for (let n = 0; n < carTreeList.length; n++) {
                                        getChildData(carTreeList[n], status, analyzeResult.keyId, alarmTime);
                                    }
                                }
                            }
                        }
                    }
                    //下线提醒
                    this.options.onLineInfos.myMessage.push({
                        severity: 'warn', summary: '离线消息',
                        detail: analyzeResult.carNo + ' 下线'
                    });
                }

            }

        })

    }

    closeMQ() {
        if (this.client != null) {
            this.client.end();
        }
    }
}
//
// function onlineInfoAlert1(node: any,keyIdForTree: any,alert: boolean):void

// }

//上线提醒
function onlineInfoAlert(node: any, keyIdForTree: any, alert: any, arr: any): void {

    if (node.children !== undefined && node.children.length > 0) {

        for (let i = 0; i < node.children.length; i++) {
            onlineInfoAlert(node.children[i], keyIdForTree, alert, arr);
        }

    } else {
        if (node.id !== undefined && node.id !== null && node.id == keyIdForTree) {
            if (node.iconSkin == 'off') {
                alert = true;
                arr.push(keyIdForTree);
            }
        }
    }
}

function getCarRealData() {
    return this.$sessionStorage.retrieve('carRealData');
}

function getByteByIndex(buf: Buffer, index, len) {
    let j = 0, num = 0;
    index = index - 1;
    for (let i = index; i < index + len; i++) {
        if (buf[i] === 0) {
            num = j;
            break;
        }
        j++
    }
    j = 0;
    const tmp = new Buffer(num);

    for (let i = index; i < index + num; i++) {
        tmp.writeUInt8(buf[i], j);
        j++;
    }
    return tmp;
}
function findCurMark(markList, carNo) {
    let curMark = null;
    if (!isUndefined(markList) && markList.length > 0) {
        for (let i = 0; i < markList.length; i++) {
            if (markList[i].options.title === carNo) {
                curMark = markList[i];
                break;
            }
        }
        return curMark;
    } else {
        return null;
    }
}

function compareDate(d1, d2) {
    return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
}

function exchangePlateColor(plateColor) {
    let carcolor = '';
    if (plateColor === 1) {
        carcolor = '蓝色';
    } else if (plateColor === 2) {
        carcolor = '黄色';
    } else if (plateColor === 3) {
        carcolor = '黑色';
    } else if (plateColor === 4) {
        carcolor = '白色';
    } else {
        carcolor = '其他';
    }
    return carcolor;
}

//循环遍历  更新车辆树状态
function getChildData(node: any, carState: any, keyIdForTree: any, alarmTime: any): void {
    if (node.children !== undefined && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            getChildData(node.children[i], carState, keyIdForTree, alarmTime);
        }
    } else {
        if (node.id !== undefined && node.id !== null && node.id == keyIdForTree) {
            if (node.iconSkin == 'alarm' && alarmTime < 5) {
                node.iconSkin = 'alarm';
            } else {
                if (carState == 0) {
                    node.iconSkin = 'off';
                } else if (carState == 1) {
                    node.iconSkin = 'on';
                } else if (carState == 2) {
                    node.iconSkin = 'alarm';
                }
            }
        }
    }
}

function add0(m) {
    return m < 10 ? '0' + m : m;
}

function arrToString(arr) {
    let result = '';
    for (let i = 0; i < arr.length; i++) {
        result += String.fromCharCode(arr[i]);
    }
    return result;
}

function exchangeWarnType(warnTypeCode) {
    let warnType = '';
    switch (warnTypeCode) {
        case 1: warnType = '超速报警'; break;
        case 2: warnType = '疲劳驾驶报警'; break;
        case 3: warnType = '紧急报警'; break;
        case 4: warnType = '进入指定区域报警'; break;
        case 5: warnType = '离开指定区域报警'; break;
        case 6: warnType = '路段堵塞报警'; break;
        case 7: warnType = '危险路段报警'; break;
        case 8: warnType = '越界报警'; break;
        case 9: warnType = '盗警'; break;
        case 10: warnType = '劫警'; break;
        case 11: warnType = '偏离路线报警'; break;
        case 12: warnType = '车辆移动报警'; break;
        case 13: warnType = '超时驾驶报警'; break;
        case 14: warnType = '其他报警'; break;
    }
    return warnType;
}
