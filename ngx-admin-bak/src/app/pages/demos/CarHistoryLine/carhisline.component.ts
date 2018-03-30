import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { CarHisTrace, CarHisTraceAlarm, CarHisTraceStop } from './CarHisLine.model';
import * as L from 'leaflet';
import 'style-loader!leaflet/dist/leaflet.css';
import 'style-loader!angular2-toaster/toaster.css';
import { CarHisLineService } from './carhisline.service';
import 'leaflet-movingmaker';
import { transform } from 'utils/maptrans.utils';
import { Marker, Icon, Layer, LayerGroup } from 'leaflet';
import 'leaflet-rotatedmarker';
import { CarInfoData } from './car'
import { ActivatedRoute } from '@angular/router';
import { elementAt } from 'rxjs/operator/elementAt';
import { LbsMapComponent } from '../../components/map/map.component';
import { TabView, DataTable } from 'primeng/primeng';
import { CarTreeComponent } from 'app/pages/lbs-common/car-tree/car-tree.component';
import { PagesService } from 'app/pages/pages.service';
import { isDate, isNullOrUndefined, isUndefined } from 'util';
@Component({
    selector: 'ngx-carhistrace',
    templateUrl: './carhisline.component.html',
    styleUrls: ['./carhisline.component.scss'],
})

export class CarHisLineComponent implements OnInit {
    constructor(private toasterService: ToasterService
        , private service: CarHisLineService
        , public route: ActivatedRoute, private pagesService: PagesService) {
        this.carhistrace = [];
        this.milesoptions = {};
        this.speedoptions = {};
        this.layerGroup = L.featureGroup();
        this.arrowtitle = '隐藏';
    }

    @ViewChild('map') map: LbsMapComponent;
    @ViewChild('playbtn') playbtn: HTMLElement;
    @ViewChild('carTree') carTree: CarTreeComponent;

    types: string[] = ['default', 'info', 'success', 'warning', 'error'];
    private config: ToasterConfig;
    // leafletMap: any;
    cn: any;
    private searchedCarNo: any;
    private begindate: Date;
    private enddate: Date;
    private car: any = {};
    private milesoptions: any;
    private speedoptions: any;
    private labeldata: any = [];
    private miledata: any = [];
    private spddata: any = [];
    private carhistrace: CarHisTrace[];
    // private carInfoData: CarInfoData[];
    private carhisalarm: CarHisTraceAlarm[];
    private carhisstop: CarHisTraceStop[];
    speedChart: any;
    milesChart: any;
    private movingMarker: any;

    private layers: Layer[] = [];
    private layerGroup: L.FeatureGroup;
    private arrowtitle: string = '';

    speed: any = 1;
    dur: any = [];

    display: boolean = false;
    private carInfo: CarInfoData[];
    private selectedCars: CarInfoData[];
    private car_icon = L.icon({
        iconUrl: './assets/images/icon_map_car_on.svg',
        iconSize: [24, 36],
        iconAnchor: [12, 18],
        popupAnchor: [-0, -38],
    });

    private alarm_icon = L.icon({
        iconUrl: './assets/images/halarm.png',
        iconSize: [24, 24],
        iconAnchor: [12, 20],
        popupAnchor: [-0, -23],
    });

    private stop_icon = L.icon({
        iconUrl: './assets/images/hstop.png',
        iconSize: [24, 24],
        iconAnchor: [12, 20],
        popupAnchor: [-0, -23],
    });

    private start_icon = L.icon({
        iconUrl: './assets/images/hstart.png',
        iconSize: [24, 28],
        iconAnchor: [12, 25],
        popupAnchor: [-0, -30],
    });

    private end_icon = L.icon({
        iconUrl: './assets/images/hend.png',
        iconSize: [24, 28],
        iconAnchor: [12, 25],
        popupAnchor: [-0, -30],
    });



    doSearch() {

        if (isUndefined(this.car.carno) || this.car.carno == '') {
            this.showToast(this.types[3], null, '请输入车牌！');
            return;
        }


        if (!isDate(this.begindate)) {
            this.showToast(this.types[3], null, '请选择开始时间！');
            console.log('开始时间为空');
            return;
        }

        if (!isDate(this.enddate)) {
            this.showToast(this.types[3], null, '请选择结束时间！');
            console.log('结束时间为空');
            return;
        }

        if (this.begindate > this.enddate) {
            this.showToast(this.types[3], null, '开始时间晚于结束时间，请重新选择时间段！');
            console.log('开始时间晚于结束时间');
            return;
        }

        if (this.layers.length > 0)
            this.layerGroup.clearLayers();

        this.service.getCarHisLineList(this.car.carno, this.pagesService.formateDateToStr(this.begindate), this.pagesService.formateDateToStr(this.enddate))
            .subscribe(carhis => {

                if (carhis.resultCode == 0) {
                    this.carhistrace = carhis.carHisList;
                    this.carhisalarm = carhis.alarmData;
                    this.carhisstop = carhis.stopData;


                    //let movingMarker: any;
                    let tmp = [];

                    let after = [];
                    let updateLabel = [];
                    let updatemiledata = [];
                    let updatespeeddata = [];

                    if (this.layers.length > 0) {
                        this.layers = [];
                    }


                    //添加报警点
                    if (this.carhisalarm.length > 0) {
                        for (let i = 0; i < this.carhisalarm.length; i++) {
                            let transLatlon = transform(Number(this.carhisalarm[i].alarminfo_latitude), Number(this.carhisalarm[i].alarminfo_longitude));
                            let latlong = L.latLng(transLatlon[0], transLatlon[1]);
                            let alarm = L.marker(latlong,
                                { icon: this.alarm_icon });
                            let alarm_d = new Date(this.carhisalarm[i].alarm_date);
                            alarm.bindPopup('<div class="map_pop">'
                                + '<div class="map_alarminfo"><p><span>报警时间:</span><b>' + alarm_d.toLocaleDateString() + ' ' + alarm_d.getHours() + ':' + alarm_d.getMinutes() + ':' + alarm_d.getSeconds() + '<b></p>'
                                + ' <p><span>报警描述:</span><b>' + this.carhisalarm[i].alarm_desc + '</b></p></div>'
                                + '</div>'
                            );
                            this.layers.push(alarm);
                        }
                    }

                    //添加停车点
                    if (this.carhisstop.length > 0) {
                        for (let i = 0; i < this.carhisstop.length; i++) {
                            let transLatlon = transform(Number(this.carhisstop[i].lat), Number(this.carhisstop[i].lon));
                            let latlong = L.latLng(transLatlon[0], transLatlon[1]);
                            let stop = L.marker(latlong,
                                { icon: this.stop_icon });
                            this.layers.push(stop);
                        }

                    }


                    after = this.carhistrace;
                    this.labeldata = [];
                    this.miledata = [];
                    this.spddata = [];

                    for (let his in after) {
                        let tmpLatlon = transform(Number(after[his].lat), Number(after[his].lon));
                        const latlong = L.latLng(tmpLatlon[0], tmpLatlon[1]);
                        tmp.push(latlong);

                        this.miledata.push(Number(after[his].distance));
                        this.spddata.push(Number(after[his].speed));
                        this.labeldata.push(after[his].time);
                    }


                    if (tmp.length > 0) {
                        let line = L.polyline(tmp);
                        let centerpoint = Math.ceil(tmp.length / 2);

                        let firstPoint = L.marker(tmp[0], {
                            icon: this.start_icon,
                            title: "起点",
                            opacity: 0.8
                        });

                        let lastPoint = L.marker(tmp[tmp.length - 1], {
                            icon: this.end_icon,
                            title: "终点",
                            opacity: 0.8
                        });


                        /*根据两点间距离计算动画运行时间*/
                        for (let i = 0; i < tmp.length; i++) {
                            if (i < tmp.length - 1) {
                                let dis = tmp[i + 1].distanceTo(tmp[i]);
                                this.dur.push(Math.floor(dis) * 10);
                            }
                        }

                        this.movingMarker = L.Marker.movingMarker(tmp, this.dur, {
                            icon: this.car_icon,
                            rotationAngle: Number(after[0].direction),
                            rotationOrigin: 'center',
                        });

                        this.layers.push(line);
                        this.layers.push(firstPoint);
                        this.layers.push(lastPoint);
                        this.layers.push(this.movingMarker);
                        this.layerGroup = L.featureGroup(this.layers).addTo(this.map.leafletMap);
                        // this.leafletMap.setView(tmp[0], 16);

                        if (this.layerGroup.getBounds().getNorthEast() != null && this.layerGroup.getBounds().getSouthWest() != null) {
                            this.map.leafletMap.fitBounds(this.layerGroup.getBounds());
                        }


                        this.movingMarker.on('move', function (e: any) {
                            const latlng = e.latlng;
                            // console.log(e.target._currentIndex);
                            try {
                                let dir = Number(after[this._currentIndex].direction);
                                e.target.options.rotationAngle = dir;
                                e.target.options.rotationOrigin = 'center';

                                if (this._currentIndex == after.length - 2) {
                                    resetBtn();
                                }


                                // if (updateLabel.length < (this._currentIndex + 1)) {
                                //     updateLabel.push(after[this._currentIndex].time);
                                //     updatemiledata.push(Number(after[this._currentIndex].distance));
                                //     updatespeeddata.push(Number(after[this._currentIndex].speed));

                                //     this.speedChart = {
                                //         xAxis: [{
                                //             data: updateLabel
                                //         }],
                                //         series: [{
                                //             data: updatespeeddata
                                //         }]
                                //     };

                                // }                              

                            } catch (error) {
                                console.log(error);
                            }

                            this._map.panTo(latlng);
                            // console.log(this);

                        });

                    }
                    else {
                        if (this.layers.length > 0)
                            this.layerGroup.clearLayers();
                    }

                    this.milesChart = {
                        xAxis: [{
                            data: this.labeldata
                        }],
                        series: [{
                            data: this.miledata
                        }]
                    };

                    this.speedChart = {
                        xAxis: [{
                            data: this.labeldata
                        }],
                        series: [{
                            data: this.spddata
                        }]
                    };
                } else {
                    this.showToast(this.types[1], null, carhis.message);
                }

            });
    }


    onhisplay(event: any) {
        this.map.leafletMap.setZoom(16);
        if ((this.playbtn as any).nativeElement.innerText == "播放") {
            (this.playbtn as any).nativeElement.innerHTML = " <img src='../../../../assets/images/location_pause.png' >暂停";
            if (this.movingMarker != null)
                this.movingMarker.start();
        } else {
            (this.playbtn as any).nativeElement.innerHTML = " <img src='../../../../assets/images/location_play.png' >播放";
            if (this.movingMarker != null)
                this.movingMarker.pause();
        }
    }


    onhisstop(event: any) {
        // console.log(event);
        // let btnforward = document.getElementById('btn-add-speed');
        // let btnbackward = document.getElementById('btn-sub-speed');
        // let btnplay = document.getElementById('btn-paly');
        // btnforward.setAttribute("disabled", "disabled");
        // btnbackward.setAttribute("disabled", "disabled");

        if (this.movingMarker != null)
            this.movingMarker.stop();
        if ((this.playbtn as any).nativeElement.innerText == "暂停") {
            (this.playbtn as any).nativeElement.innerHTML = " <img src='../../../../assets/images/location_play.png' >播放";

        }

        // if (btnplay.innerText == " 暂停") {
        //     btnplay.innerHTML = "<span class='fa fa-play'></span> 播放";
        // }
    }

    onaddspeed(event: any) {

        for (let idx in this.dur) {
            if (this.speed < 6) {
                let tmp = Math.floor(this.dur[idx] * 0.8);
                this.dur[idx] = tmp;
                if (this.movingMarker != null)
                    this.movingMarker.setDurations(idx, tmp);
            }
        }

        if (this.speed < 6) {
            let s = this.speed;
            s++;
            this.speed = s;
        }


    }

    onsubspeed(event: any) {

        for (let idx in this.dur) {
            if (this.speed > 1) {
                let tmp = Math.floor(this.dur[idx] * 1.25);
                this.dur[idx] = tmp;
                if (this.movingMarker != null)
                    this.movingMarker.setDurations(idx, tmp);
            }
        }


        if (this.speed > 1) {
            let s = this.speed;
            s--;
            this.speed = s;
        }
    }


    // 消息弹框
    showToast(type: string, title: string, msg: string) {
        this.config = new ToasterConfig({
            positionClass: 'toast-center',
            timeout: 5000,
            newestOnTop: true,
            tapToDismiss: true,
            preventDuplicates: false,
            animation: 'fade',
            limit: 3
        });

        const toast: Toast = {
            type: type,
            title: title,
            body: msg,
            timeout: 5000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml
        };

        this.toasterService.popAsync(toast);
    }

    ngOnInit() {
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

        this.car.carno = '苏MC5609';
        this.begindate = new Date(2017, 11, 24, 11, 30, 0);
        this.enddate = new Date(2017, 11, 24, 11, 59, 59);
    }

    ngAfterViewInit() {
        //里程图表
        this.milesoptions = {
            legend: {
                show: false
            },
            grid: {
                left: '25px',
                top: '10px',
                right: '10px',
                bottom: '20px'
            },
            tooltip: {
                trigger: 'axis',
                formatter: '{b} </br>{c} km',
            },
            xAxis: {
                data: [],
                silent: true,
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                min: 0,
            },
            series: [{
                type: 'line',
                data: [0]
            }]
        };

        //速度图表
        this.speedoptions = {
            legend: {
                show: false
            },
            grid: {
                left: '25px',
                top: '10px',
                right: '2px',
                bottom: '20px'
            },
            tooltip: {
                trigger: 'axis',
                formatter: '{b} </br>{c} km/h'
            },
            xAxis: {
                type: 'category',
                data: [],
                boundaryGap: true,
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                scale: true,
                min: 0
            },
            series: [{
                type: 'line',
                data: [0]
            }]
        };
    }

    /*tab页--显示隐藏*/
    showhide(e) {
        // console.log(e.target.offsetParent.offsetParent.children[1]);
        if (e.target.className == "fa fa-chevron-down") {
            e.target.className = "fa fa-chevron-up";
            e.target.offsetParent.offsetParent.className = "middle-bottom-panel-hide";
            e.target.offsetParent.offsetParent.children[1].className = "tabview-hide";
            this.arrowtitle = '显示';
        }
        else {
            e.target.className = "fa fa-chevron-down";
            e.target.offsetParent.offsetParent.className = "middle-bottom-panel-show";
            e.target.offsetParent.offsetParent.children[1].className = "tabview-show";
            this.arrowtitle = '隐藏';
        }
    }

    showQuery() {
        this.display = true;
    }

    doSearchCar() {
        this.service.getCarRealData(this.car.plateNo,
            this.car.groupName)
            .subscribe(carinfo => {
                this.carInfo = carinfo;

                let data: CarInfoData[];
                data = this.carInfo;
                for (let i in data) {
                    if (data[i].PLATECOLOR == '1') {
                        data[i].PLATECOLOR = '蓝色';
                    }
                }

                // alert(this.carInfo[0].CAR_NO)
            });




    }

    onRowSelect(event) {
        //this.msgs = [];
        //this.msgs.push({severity: 'info', summary: 'Car Selected', detail: event.data.vin + ' - ' + event.data.brand});
        let selectCars2: CarInfoData[];
        // selectCars2=event.data;
        //    for(let CarInfoData of selectCars2){
        //        alert(CarInfoData.CAR_NO);
        //         this.car.carno=CarInfoData.CAR_NO;
        //    }
        //alert((event.data).size);
        //    if(selectCars2.length>1){

        //    }
        //alert(event.data.CAR_NO);
        // for(let i in selectCars2){
        //      alert(selectCars2[i].CAR_NO);
        // }
        //alert(event.type);
        this.car.carno = event.data.CAR_NO;

    }
    reset() {
        this.car.plateNo = "";
        this.car.groupName = "";
        //this.car.carno="";

    }

    confirm() {
        this.display = false;
        this.car.carno = this.carTree.getCarNo();
    }

    reset2() {
        this.display = false;
    }

    onRowUnselect(event) {
        // this.msgs = [];
        // this.msgs.push({severity: 'info', summary: 'Car Unselected', detail: event.data.vin + ' - ' + event.data.brand});
    }




}

function resetBtn() {
    const btnplay = document.getElementById('btn-paly');
    if (btnplay != null)
        btnplay.innerHTML = "<span class='fa fa-play'></span> 播放";
}