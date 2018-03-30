import { Component, OnInit, ViewChild, OnDestroy, SimpleChange, Input } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { DataTable } from 'primeng/primeng';
// import * as L from 'leaflet';
import { isDate, isUndefined } from 'util';
// import 'style-loader!leaflet/dist/leaflet.css';
import 'style-loader!angular2-toaster/toaster.css';
// import MiniMap from 'leaflet-minimap';
// import 'style-loader!leaflet-minimap/dist/Control.MiniMap.min.css';
// import 'leaflet-mouse-position';
// import 'style-loader!leaflet-mouse-position/src/L.Control.MousePosition.css';
// import 'leaflet.fullscreen';
// import 'leaflet-draw';
// import 'style-loader!leaflet-draw/dist/leaflet.draw.css';
import { CarPositionService } from './carposition.service';
import {
    TreeComponent, TreeModel, TreeNode, TREE_ACTIONS, KEYS,
    IActionMapping, ITreeOptions
} from 'angular-tree-component';
import { HttpModule, Http } from '@angular/http';
import { Tree } from 'ng2-tree';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import * as mqtt from 'mqtt';
import { environment } from 'environments/environment';
import { transform } from 'utils/maptrans.utils';
import * as iconv from 'iconv-lite';
// import 'leaflet.marker.slideto';
// import 'leaflet-rotatedmarker';
import { SessionStorageService } from 'ng2-webstorage';
import { marker } from 'leaflet';
import { setInterval } from 'timers';
import { Subscription } from 'rxjs/Subscription';
import { PagesService } from 'app/pages/pages.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LbsTreeComponent } from 'app/pages/common-util/lbstree/lbstree.component';
import { LbsMapComponent } from '../../components/map/map.component';

@Component({
    selector: 'ngx-carposition',
    templateUrl: './carposition.component.html',
    styleUrls: ['./carposition.component.scss'],
    providers: [],
})

export class CarPositionComponent implements OnInit, OnDestroy {
    constructor(private toasterService: ToasterService, private service: CarPositionService,
        private http: Http, private httpclient: HttpClient,
        public route: ActivatedRoute,
        protected router: Router,
        private $sessionStorage: SessionStorageService, private pagesService: PagesService) {
        //this.markerCluster = L.markerClusterGroup({});
        this.markList = new Array();
        this.topic = '';
        this.hxTopic = '';
        this.warnTopic = '';
        this.offTopic = '';

    }

    types: string[] = ['default', 'info', 'success', 'warning', 'error'];
    display: boolean = false;
    test1: string = '123';
    // private leafletMap: any;
    config: ToasterConfig;
    markerCluster: any;
    public singleCarNo: any;
    private nodeKeyIds: string[];
    private markList: any;
    private topic: string;
    private hxTopic: string;
    private warnTopic: string;
    private offTopic: string;
    private searchCarNo: string;
    private myIcon2 = L.icon({
        iconUrl: './assets/images/icon_map_car_on.svg',
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [-0, -40],
        // shadowUrl: 'my-icon-shadow.png',
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94],
    });
    private iconAlarm = L.icon({
        iconUrl: './assets/images/icon_map_car_alarm.svg',
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [-0, -40],
    });
    @ViewChild('lbstree') lbstree: LbsTreeComponent;
    @ViewChild('leaflet-base-layers') mapLayer: TreeComponent;
    @ViewChild('map') map: LbsMapComponent;

    nodes = [];
    analyzeResult: any;
    subscription: Subscription;
    actionMapping: IActionMapping = {
        mouse: {
            click: (tree, node, $event) => {
                let keyId;
                if (node.data.iconSkin !== 'm' && node.data.iconSkin !== 't' && node.data.checked == true) {
                    keyId = node.data.id;
                } else {
                    return;
                }
                const cumarker = findCurMark(this.markList, keyId);
                // this.leafletMap.setView(cumarker.getLatLng(), 14);
                this.map.leafletMap.setView(cumarker.getLatLng(), 14);
                // this.leafletMap.panTo(cumarker.getLatLng());

                cumarker.openPopup();
                // this.check(node, !node.data.checked)
                // 点击时，在地图上显示点击中的单个车辆
                // $event.preventDefault()
            },
            dblClick: (tree, node, $event) => {
                if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
            },
            // contextMenu: (tree, node, $event) => {
            //         $event.preventDefault();
            //          let rightedge = $event.clientX;
            //          let bottomedge = $event.clientY;
            //          let container = document.getElementById('treeContainer'); 
            //          let menu = document.getElementById('menu'); 
            //          if (rightedge < menu.offsetWidth)               
            //          menu.style.left = container.scrollLeft + $event.clientX - $event.offsetWidth + "px";            
            //      else
            //      /*否则，就定位菜单的左坐标为当前鼠标位置*/
            //          menu.style.left = container.scrollLeft + $event.clientX + "px";

            //      /*如果从鼠标位置到容器下边的空间小于菜单的高度，就定位菜单的上坐标（Top）为当前鼠标位置向上一个菜单高度*/
            //      if (bottomedge < menu.offsetHeight)
            //          menu.style.top = container.scrollTop + $event.clientY - menu.offsetHeight + "px";
            //      else
            //      /*否则，就定位菜单的上坐标为当前鼠标位置*/
            //          menu.style.top = container.scrollTop + $event.clientY + "px";

            //      /*设置菜单可见*/
            //      menu.style.left = "50px";
            //      menu.style.top = "50px";
            //      menu.style.visibility = "visible";             
            //       },
        },
    };

    options: ITreeOptions = {
        displayField: 'name',
        idField: 'id',
        isExpandedField: 'expanded',
        actionMapping: this.actionMapping,
        // animateExpand: true,
        // animateSpeed: 30,
        // animateAcceleration: 1.2

    };

    public showTab() {
        // alert(123);
        this.display = true;
    }

    //lbstree组件的check事件传递到这边时所做的地图操作
    onCheck(checked: boolean) {
        if (checked) { //如果子组件弹射出来的变量为true、因为lbstree每次check都需要操作地图上的标记
            this.drawMovingMarker();
        }
    }

    sendToasterMsg(msg) {
        this.showToast(msg.type, msg.title, msg.msg);
    }

    ngOnInit() {

        // 初始化树的数据
        const params = new HttpParams();

        //绑定树节点鼠标单击定位
        this.lbstree.actionMapping.mouse.click = this.actionMapping.mouse.click;
        this.nodes = this.lbstree.getNodes();
        //获取从pages.component里解析好的数据并加载到地图车辆标记列表里

        this.singleCarNo = this.route.snapshot.params['singleCarNo'];

        if (this.singleCarNo != null && this.singleCarNo != undefined && this.singleCarNo != '') {
            if (this.singleCarNo == 'jshx123456JSHX') {
                this.lbstree.noteInitialization(this.nodes);
            } else {
                this.searchCarNo = this.singleCarNo;
            }
        } else {
            this.lbstree.noteInitialization(this.nodes);
        }

        this.drawMovingMarker();

    }


    public drawMovingMarker() {
        if (this.subscription != null) {
            this.subscription.unsubscribe();
        }
        // this.subscription.unsubscribe();
        if (this.markList.length > 0) {
            this.markList.forEach(mark => {
                mark.remove();
            });
        }
        this.markList = [];
        // 2,获取节点数据
        let nodeArray = new Array();
        nodeArray = this.lbstree.getAllcheckedNode();
        if (nodeArray.length > 0) {
            let keyIds = '';
            let searchKeyId = '';
            nodeArray.forEach((checkedNode) => {
                if (checkedNode.iconSkin !== 'm' && checkedNode.iconSkin !== 't') {
                    keyIds += "'" + checkedNode.id + "',";
                    searchKeyId += checkedNode.id + ',';
                }
            });
            const searchedIdList = searchKeyId.substring(0, searchKeyId.length - 1).split(',');
            let idsMap = new Map();
            for (let i = 0; i < searchedIdList.length; i++) {
                idsMap.set(searchedIdList[i], searchedIdList[i]);
            }

            const realData = this.$sessionStorage.retrieve('carRealData');
            const searchedData = new Array();
            for (let i = 0; i < realData.length; i++) {
                if (realData[i].KEYID == idsMap.get(realData[i].KEYID)) {
                    searchedData.push(realData[i]);
                }
            }
            let layers = [];
            searchedData.forEach(car => {
                const myDate = new Date();
                if (car.LAST_LATITUDE !== '0' && car.LAST_LONGITUDE !== '0') {
                    const myIcon2 = L.icon({
                        iconUrl: './assets/images/icon_map_car_on.svg',
                        iconSize: [28, 40],
                        iconAnchor: [14, 20],
                        popupAnchor: [-0, -40],
                        className: 'my-div-icon',
                        // shadowUrl: 'my-icon-shadow.png',
                        // shadowSize: [68, 95],
                        // shadowAnchor: [22, 94],
                    });

                    let lastTime = '';
                    if (car.LAST_TIME !== 'null') {
                        lastTime = car.LAST_TIME.substring(0, 4) + '-' + car.LAST_TIME.substring(4, 6) + '-'
                            + car.LAST_TIME.substring(6, 8) + ' ' + car.LAST_TIME.substring(8, 10) + ':'
                            + car.LAST_TIME.substring(10, 12) + ':' + car.LAST_TIME.substring(12);

                        const oldDate = new Date(lastTime);
                        if ((myDate.getTime() - oldDate.getTime()) / 1000 / 60 < 30) {
                            myIcon2.options.iconUrl = './assets/images/icon_map_car_on.svg';
                        } else {
                            myIcon2.options.iconUrl = './assets/images/icon_map_car_off.svg';
                        }
                    }

                    let altitude = 0;
                    if (car.LAST_ALTITUDE !== 'null') {
                        altitude = Number(car.LAST_ALTITUDE)
                    }
                    const tmpLatlon = transform(Number(car.LAST_LATITUDE),
                        Number(car.LAST_LONGITUDE));
                    const cumarker = L.marker([tmpLatlon[0], tmpLatlon[1]],
                        {
                            title: car.CAR_NO, icon: myIcon2,
                            rotationAngle: altitude, rotationOrigin: 'center'
                        }).addTo(this.map.leafletMap);
                    cumarker.bindPopup('<h1 hidden="hidden">,' + lastTime + ',' + car.KEYID + ',' + car.PLATECOLOR + ',' + tmpLatlon[0] + ',' + tmpLatlon[1] + ',</h1>'
                        + '<div class="map_pop">'
                        + '<div class="map_popbox"><img src="./assets/images/icon_map_car.png">'
                        + '<p>' + car.CAR_NO + '</p></div>'
                        + '<div class="map_coninfo">'
                        + '<p>车辆颜色:<b>' + exchangePlateColor(car.PLATECOLOR) + '</b></p>'
                        + ' <p>速度:<b>' + car.LAST_SPEED + 'km/h' + '</b></p>'
                        + ' <p>经度:<b>' + lonAndLatChange(car.LAST_LONGITUDE + "") + '</b></p>'
                        + ' <p>纬度:<b>' + lonAndLatChange(car.LAST_LATITUDE + "") + '</b></p>'
                        + '</div>'
                        + ' <p class="date1">日期:<b>' + lastTime + '</b></p>'
                        + ' <p class="date1" hidden="hidden"/>'
                        + '<div class="map_btn">'
                        + '<ul>'
                        + '<li><a id ="carDetail" >车辆信息<h1 hidden="hidden">,' + lastTime + ',' + car.KEYID + ',' + car.PLATECOLOR + ',' + tmpLatlon[0] + ',' + tmpLatlon[1] + ',</h1></a></li>'
                        + '<li><a href="/#/pages/components/CarHisLine">历史轨迹</a></li>'
                        + ' </ul>'
                        + ' </div>'
                        + '</div>'

                        // <span>车牌号：</span>' +
                        //     car.CAR_NO + ' 车牌颜色：' + this.exchangePlateColor(car.PLATECOLOR)
                        //     + '<br>速度：' + car.LAST_SPEED + 'km/h 日期：' + lastTime
                        //     + '<br>经度：' + car.LAST_LONGITUDE + ' 纬度：' + car.LAST_LATITUDE
                        , { autoPan: true });
                    this.markList.push(cumarker);
                    if (tmpLatlon[0] > 0 || tmpLatlon[1] > 0) {
                        layers.push(cumarker);
                    }
                }

            });
            var group = L.featureGroup(layers);
            if (group.getBounds().getNorthEast() != null && group.getBounds().getSouthWest() != null) {
                this.map.leafletMap.fitBounds(group.getBounds());
            }
            this.analyze(idsMap);
        }

    }

    analyze(idsMap) {
        this.subscription = this.pagesService.missionAnnounced$.subscribe(
            (result: any) => {
                if (result.keyId == idsMap.get(result.keyId)) {
                    this.handleMark(this.markList, result);
                }
            }
        );
    }

    handleMark(markList, analyzeResult) {
        const curMark = findCurMark(markList, analyzeResult.keyId);
        if (curMark !== null && curMark) {
            if (analyzeResult.commandId == 5122) {
                //报警信息设置地图车辆红色图标
                curMark.setIcon(this.iconAlarm);
                //点击图标冒泡信息处理
                let lastContent: string = curMark.getPopup().getContent();
                let subLastContent: string = lastContent;
                if (lastContent.indexOf('<p class="date1" hidden="hidden"/>') > 0) {
                    let warnInfo: string = '<p class="date1">报警类型：<b>' + exchangeWarnType(analyzeResult.warnTypeCode) + '</b></p>'
                        + '<p class="date1">报警时间：<b>' + analyzeResult.year + '-' + analyzeResult.month + '-' + analyzeResult.day + ' ' + analyzeResult.time + '</b></p>';
                    subLastContent = lastContent.replace('<p class="date1" hidden="hidden"/>', warnInfo);
                    (curMark as any).bindPopup(subLastContent);
                } else {
                    let content1: string = lastContent.substring(0, lastContent.indexOf('<p class="date1">报警类型：<b>'));
                    let content2: string = lastContent.substring(lastContent.lastIndexOf('</b></p>') + "</b></p>".length);
                    let warnInfo: string = '<p class="date1">报警类型：<b>' + exchangeWarnType(analyzeResult.warnTypeCode) + '</b></p>'
                        + '<p class="date1">报警时间：<b>' + analyzeResult.year + '-' + analyzeResult.month + '-' + analyzeResult.day + ' ' + analyzeResult.time + '</b></p>';
                    (curMark as any).bindPopup(content1 + warnInfo + content2);
                }
            } else if (analyzeResult.topic == 'DOTOFFLINE') {
                //暂不处理
            } else {
                //冒泡信息中获取传递的车辆颜色代码
                const lastContent = curMark.getPopup().getContent();
                const contentArray = lastContent.split(',');
                const lastTime = contentArray[1];
                let colorCode = contentArray.length > 3 ? contentArray[3] : "";
                // 冒泡信息中获取上一次的车辆经纬度
                const lastLat = contentArray.length > 4 ? contentArray[4] : "";
                const lastLon = contentArray.length > 5 ? contentArray[5] : "";
                if (compareDate(analyzeResult.gpsTime, lastTime)) {
                    let carColor = exchangePlateColor(analyzeResult.color);
                    if (analyzeResult.topic == 'Gpslocation') {
                        if (contentArray[3].length == 1) {
                            carColor = exchangePlateColor(parseInt(contentArray[3]));
                        }
                    }
                    (curMark as any).bindPopup('<h1 hidden="hidden">,' + analyzeResult.gpsTime + ',' + analyzeResult.keyId + ',' + colorCode + ',' + lastLat + ',' + lastLon + ',</h1>'
                        + '<div class="map_pop">'
                        + '<div class="map_popbox"><img src="./assets/images/icon_map_car.png">'
                        + '<p>' + curMark.options.title + '</p></div>'
                        + '<div class="map_coninfo">'
                        + '<p>车辆颜色:<b>' + carColor + '</b></p>'
                        + ' <p>速度:<b>' + analyzeResult.speed + 'km/h' + '</b></p>'
                        + ' <p>经度:<b>' + lonAndLatChange(analyzeResult.lon + "") + '</b></p>'
                        + ' <p>纬度:<b>' + lonAndLatChange(analyzeResult.lat + "") + '</b></p>'
                        + '</div>'
                        + ' <p class="date1">日期:<b>' + analyzeResult.year + '-' + analyzeResult.month + '-' + analyzeResult.day + ' ' + analyzeResult.time + '</b></p>'
                        + ' <p class="date1" hidden="hidden"/>'
                        + '<div class="map_btn">'
                        + '<ul>'
                        + '<li><a (click)="showTab()">车辆信息</a></li>'
                        + '<li><a href="/#/pages/components/CarHisLine?searchedCarNo">历史轨迹</a></li>'
                        + ' </ul>'
                        + ' </div>'
                        + '</div>'

                        // <span>车牌号：</span>' + curMark.options.title + ' 车牌颜色：'
                        // + exchangePlateColor(color)
                        // + '<br>速度：' + speed + 'km/h 日期：' + year + '-' + month + '-' + day + ' ' + time
                        // + '<br>经度：' + lonAndLatChange(lon+"") + ' 纬度：' + lonAndLatChange(lat+"")
                    );
                    curMark.options.rotationAngle = analyzeResult.direct;
                    curMark.options.rotationOrigin = 'center';
                    const myIcon3 = L.icon({
                        iconUrl: './assets/images/icon_map_car_on.svg',
                        iconSize: [28, 40],
                        iconAnchor: [14, 40],
                        popupAnchor: [-0, -40],
                    });
                    curMark.setIcon(myIcon3);
                    const gpsDate = new Date(analyzeResult.gpsTime.replace(/-/g, "\/"));
                    const lastDate = new Date(lastTime.replace(/-/g, "\/"))
                    const totalTime = gpsDate.getTime() - lastDate.getTime();
                    var date1 = new Date();  //开始时间
                    const mias = totalTime / 1000 //两个时间相差的秒数
                    if (mias < 1000 * 60 * 5 && (lastLat > 0 && lastLon > 0) && (analyzeResult.lat > 0 && analyzeResult.lon > 0)) {
                        //时间相差正常、上一次的经纬度正常、当前经纬度正常,移动过去
                        (curMark as any).slideTo([analyzeResult.lat, analyzeResult.lon], { duration: 3000 });
                    } else {//时间相差过大的，直接跳转过去
                        (curMark as any).setLatLng([analyzeResult.lat, analyzeResult.lon]);
                    }
                }
            }
        } else {
            if (!isUndefined(analyzeResult.lon) && !isUndefined(analyzeResult.lat)) {
                const marker = L.marker([analyzeResult.lat, analyzeResult.lon], { title: analyzeResult.carNo, icon: this.myIcon2 }).addTo(this.map.leafletMap);
                marker.bindPopup('<h1 hidden="hidden">,' + analyzeResult.gpsTime + ',' + analyzeResult.keyId + ',' + analyzeResult.color + ','
                    + analyzeResult.lat + ',' + analyzeResult.lon + ',</h1>'
                    + '<div class="map_pop">'
                    + '<div class="map_popbox"><img src="./assets/images/icon_map_car.png">'
                    + '<p>' + marker.options.title + '</p></div>'
                    + '<div class="map_coninfo">'
                    + '<p>车辆颜色:<b>' + exchangePlateColor(analyzeResult.color) + '</b></p>'
                    + ' <p>速度:<b>' + analyzeResult.speed + 'km/h' + '</b></p>'
                    + ' <p>经度:<b>' + lonAndLatChange(analyzeResult.lon + "") + '</b></p>'
                    + ' <p>纬度:<b>' + lonAndLatChange(analyzeResult.lat + "") + '</b></p>'
                    + '</div>'
                    + ' <p class="date1">日期:<b>' + analyzeResult.year + '-' + analyzeResult.month + '-' + analyzeResult.day + ' ' + analyzeResult.time + '</b></p>'
                    + ' <p class="date1" hidden="hidden"/>'
                    + '<div class="map_btn">'
                    + '<ul>'
                    + '<li><a (click)="showTab()">车辆信息</a></li>'
                    + '<li><a href="/#/pages/components/CarHisLine">历史轨迹</a></li>'
                    + ' </ul>'
                    + ' </div>'
                    + '</div>'
                    // <span>车牌号：</span>' + marker.options.title + ' 车牌颜色：'
                    //     + exchangePlateColor(color)
                    //     + '<br>速度：' + speed + 'km/h 日期：' + year + '-' + month + '-' + day + ' ' + time
                    //     + '<br>经度：' + lonAndLatChange(lon+"") + ' 纬度：' + lonAndLatChange(lat+"")
                )
                this.markList.push(marker);
            }
        }
    }

    public exchangePlateColor(plateColor) {
        let carcolor = '';
        if (plateColor === '1') {
            carcolor = '蓝色';
        } else if (plateColor === '2') {
            carcolor = '黄色';
        } else if (plateColor === '3') {
            carcolor = '黑色';
        } else if (plateColor === '4') {
            carcolor = '白色';
        } else {
            carcolor = '其他';
        }
        return carcolor;
    }



    filterFn(value, treeModel: TreeModel) {
        treeModel.filterNodes((node) => nodesearch(value, node.data.name));
    }

    ngAfterViewInit() {

        let session = this.$sessionStorage;
        getData(session, this.map, null);
        setInterval(() => {
            getData(session, this.map, null);
        }, 30000);

        if (this.singleCarNo != null && this.singleCarNo != undefined && this.singleCarNo != ''
            && this.singleCarNo != 'jshx123456JSHX') {
            this.lbstree.noteSearchInitialization(this.nodes);

            this.singleCarNo = 'jshx123456JSHX';
        }
        this.lbstree.searchCar(true);

        this.drawMovingMarker();
    }


    isArray(arr: any) {
        return Object.prototype.toString.apply(arr) === '[object Array]';
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

    ngOnDestroy() {
        if (this.subscription !== undefined && this.subscription !== null) {
            this.subscription.unsubscribe();
        }
    }

    subMQ() {
        // 2,获取所有勾选的节点
        const nodeArray = this.lbstree.getAllcheckedNode();
        if (nodeArray.length > 0) {
            let keyIds = '';
            nodeArray.forEach((checkedNode) => {
                if (checkedNode.iconSkin !== 'm' && checkedNode.iconSkin !== 't') {
                    keyIds += "'" + checkedNode.id + "',";
                }
            });
            // 4,订阅mq消息,实时刷新车辆定位
            keyIds = keyIds.substring(0, keyIds.length - 1);
            this.topic = "mqtt:DOTEXTENDINFO:COMMAND=0x301 AND KEYID IN (" + keyIds + ")";
            // this.topic = "mqtt:DOTEXTENDINFO:COMMAND=0x301 AND KEYID ='13376019042'";
            // this.client.subscribe(this.topic);
        }
    }

    unSubMQ() {
        const marker = L.marker([32.23123, 120.315465], { title: 'carNo', icon: this.myIcon2 }).addTo(this.map.leafletMap);
        setTimeout(() => {
            marker.remove();
        }, 3000);

        // this.client.unsubscribe('mqtt:DOTEXTENDINFO:COMMAND=0x301 and KEYID = 18012524172');
    }

    closeMQ() {
        // if (this.client != null) {
        //     this.client.end();
        // }
    }

}

function compareDate(d1, d2) {
    return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
}

function exchangePlateColor(plateColor) {
    let carcolor = '';
    if (plateColor === 1 || plateColor === '1') {
        carcolor = '蓝色';
    } else if (plateColor === 2 || plateColor === '2') {
        carcolor = '黄色';
    } else if (plateColor === 3 || plateColor === '3') {
        carcolor = '黑色';
    } else if (plateColor === 4 || plateColor === '4') {
        carcolor = '白色';
    } else {
        carcolor = '其他';
    }
    return carcolor;
}

function findCurMark(markList, keyId) {
    let curMark = null;
    if (!isUndefined(markList) && markList.length > 0) {
        for (let i = 0; i < markList.length; i++) {
            const lastContent = markList[i].getPopup().getContent();
            const contentArray = lastContent.split(',');
            if (contentArray[2] === keyId) {
                curMark = markList[i];
                break;
            }
            // if(markList[i].options.title === carNo) {
            //     curMark = markList[i];
            //     break;
            // }
        }
        return curMark;
    } else {
        return null;
    }
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

function nodesearch(needle, haystack) {
    const haystackLC = haystack.toLowerCase();
    const needleLC = needle.toLowerCase();

    const hlen = haystack.length;
    const nlen = needleLC.length;

    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needleLC === haystackLC;
    }
    outer: for (let i = 0, j = 0; i < nlen; i++) {
        const nch = needleLC.charCodeAt(i);

        while (j < hlen) {
            if (haystackLC.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
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

function add0(m) {
    return m < 10 ? '0' + m : m;
}

function lonAndLatChange(str) {
    let length = str.length;
    let num = str.indexOf(".");
    if (length - num > 6 && num != -1) {
        str = str.substring(0, num + 7);
    }
    return str;
}

function getData(session, map, oldControl) {
    let count = 0;
    let Offline = 0;
    let online = 0;
    const realData = session.retrieve('carRealData');
    const myDate = new Date();
    count = realData.length;
    for (let i = 0; i < realData.length; i++) {
        let lastTime = '';
        if (realData[i] !== 'null') {
            lastTime = realData[i].LAST_TIME.substring(0, 4) + '-' + realData[i].LAST_TIME.substring(4, 6) + '-'
                + realData[i].LAST_TIME.substring(6, 8) + ' ' + realData[i].LAST_TIME.substring(8, 10) + ':'
                + realData[i].LAST_TIME.substring(10, 12) + ':' + realData[i].LAST_TIME.substring(12);

            const oldDate = new Date(lastTime);
            if ((myDate.getTime() - oldDate.getTime()) / 1000 / 60 < 30) {
                online++
            }
        }
    }
    Offline = count - online;
    //更新车辆在离线値
    map.setCarStat(count, online, Offline);
}

