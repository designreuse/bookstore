import { Component, AfterViewInit, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { marker, Layer } from 'leaflet';
import 'style-loader!leaflet/dist/leaflet.css';

import MiniMap from 'leaflet-minimap';
import 'style-loader!leaflet-minimap/dist/Control.MiniMap.min.css';

import 'leaflet-mouse-position';
import 'style-loader!leaflet-mouse-position/src/L.Control.MousePosition.css';

import 'leaflet.fullscreen';
import 'leaflet-draw';
import 'style-loader!leaflet-draw/dist/leaflet.draw.css';
import 'leaflet.marker.slideto';
import 'leaflet-rotatedmarker';

// import 'leaflet.polylinemeasure';
// import 'style-loader!leaflet.polylinemeasure/Leaflet.PolylineMeasure.css';

import { environment } from 'environments/environment';

@Component({
    selector: 'ngx-basemap',
    template: `
    <div id="leaf">
    </div>
    `,
    styleUrls: ['./map.component.scss'],
    providers: [],
})

export class LbsMapComponent implements OnInit {

    //地图配置
    @Input() mapOption?: L.MapOptions;
    //车辆在离线状态统计
    @Input() carstatDisplay?: boolean = true;
    //鹰眼图显示
    @Input() minimapDisplay?: boolean = true;
    //比例尺显示
    @Input() scaleDisplay?: boolean = true;
    //鼠标位置显示
    @Input() mousePositionDisplay?: boolean = true;
    //全屏显示
    @Input() fullscreenDisplay?: boolean = true;
    //工具栏显示
    @Input() drawcontrolDisplay?: boolean = true;
    //缩放工具显示
    @Input() zoomDisplay?: boolean = true;
    //测距显示
    @Input() measureDisplay?: boolean = true;

    @Output() onDrawed = new EventEmitter<any>();
    @Output() onDrawStop = new EventEmitter<any>();
    @Output() onEdited = new EventEmitter<any>();
    @Output() onDeleted = new EventEmitter<any>();

    public leafletMap: any;
    private drawnItems: L.FeatureGroup;


    constructor() {
        if (this.mapOption == null)
            this.mapOption = {};
        if (this.mapOption.zoom == null)
            this.mapOption.zoom = 10;
        if (this.mapOption.center == null)
            this.mapOption.center = { lat: 32.055761, lng: 118.7981002 };
        if (this.mapOption.minZoom == null)
            this.mapOption.minZoom = 4;
        if (this.mapOption.maxZoom == null)
            this.mapOption.maxZoom = 17;

        this.drawnItems = L.featureGroup();
    }

    setCarStat(cnt: number, online: number, offline: number) {
        let all = document.getElementById("carcount");
        let on = document.getElementById("online");
        let off = document.getElementById("offline");

        if (all != null)
            all.innerText = cnt.toString();
        if (on != null)
            on.innerText = online.toString();
        if (off != null)
            off.innerText = offline.toString();
    }





    ngOnInit() {
        // 初始化地图
        const gaode = L.tileLayer(environment.gaodeMapUrl, { maxZoom: 18, subdomains: ['1', '2', '3', '4'] });
        const gaodeYx = L.tileLayer(environment.gaodeYxMapUrl, { maxZoom: 18, subdomains: ['1', '2', '3', '4'] });
        const gaodeYxMark = L.tileLayer(environment.gaodeYxMarkMapUrl, { maxZoom: 18, subdomains: ['1', '2', '3', '4'] });
        const hongxin = L.tileLayer(environment.hongxinMapUrl, { maxZoom: 18 });

        const gaodeMini = L.tileLayer(environment.gaodeMapUrl, { minZoom: 3, subdomains: ['1', '2', '3', '4'] });
        const gaodeYxMini = L.tileLayer(environment.gaodeYxMapUrl, { minZoom: 3, subdomains: ['1', '2', '3', '4'] });
        const gaodeYxMarkMini = L.tileLayer(environment.gaodeYxMarkMapUrl, { minZoom: 3, subdomains: ['1', '2', '3', '4'] });
        const hongxinMini = L.tileLayer(environment.hongxinMapUrl, { minZoom: 3 });

        // 多源地图集成
        const gaodeBase = L.layerGroup([gaode]);
        const gaodeimage = L.layerGroup([gaodeYx, gaodeYxMark]);
        const hongxinBase = L.layerGroup([hongxin]);
        const baseLayers = {
            "高德": gaodeBase,
            "高德影像": gaodeimage,
            "鸿信地图": hongxinBase,
        }

        const gaodeMiniGroup = L.layerGroup([gaodeMini]);
        const gaodeYxMiniGroup = L.layerGroup([gaodeYxMini, gaodeYxMarkMini]);
        const hongxinMiniGroup = L.layerGroup([hongxinMini]);
        const baseLayersCopy = {
            "高德": gaodeMiniGroup,
            "高德影像": gaodeYxMiniGroup,
            "鸿信地图": hongxinMiniGroup,
        }

        if (this.leafletMap == null) {
            // 地图初始化
            this.leafletMap = L.map('leaf', {
                layers: [gaodeBase],
                zoom: this.mapOption.zoom,
                center: this.mapOption.center,
                maxZoom: this.mapOption.maxZoom,
                minZoom: this.mapOption.minZoom,
                zoomControl: false,
                attributionControl: false
            })
        }
        L.control.layers(baseLayers, null).addTo(this.leafletMap);
        //去除地图右键菜单
        this.leafletMap.on('contextmenu', () => null);

        // 比例尺
        if (this.scaleDisplay) {
            L.control.scale().addTo(this.leafletMap);
        }



        // 鹰眼
        if (this.minimapDisplay) {
            const miniMap = new MiniMap(gaodeMini, {
                toggleDisplay: true, zoomLevelOffset: -4,
               
            }).addTo(this.leafletMap);
            //切换图层时小地图随之切换，注意baseLayersCopy要和baseLayers源一样且需重新定义minimap的源，如上面代码
            this.leafletMap.on('baselayerchange', function (e) {
                miniMap.changeLayer(baseLayersCopy[e.name]);
            });
        }

        //车辆在离线状态统计
        if (this.carstatDisplay) {
            const statusControl = L.Control.extend({
                options: { position: 'topleft' },
                onAdd(map) {
                    const divgroup = document.createElement('div');
                    divgroup.className = 'leaflet-bar';
                    //divgroup.style.border = 'none';
                    const div = document.createElement('div');

                    div.style.height = '2rem';
                    div.style.width = '22rem';
                    div.style.background = 'rgba(255,255,255,.85)';
                    //div.style.borderRadius = '.8rem';
                    divgroup.appendChild(div);

                    const li1 = document.createElement('li');
                    li1.style.height = '2rem';
                    li1.style.lineHeight = '2rem';
                    li1.style.display = 'inline-block';
                    li1.style.fontSize = '0.9rem';
                    li1.style.color = '#999';
                    li1.style.marginLeft = '1rem';
                    li1.style.verticalAlign = 'middle';
                    li1.innerHTML = '总数:<b style="color:#31bc6f" ><span id="carcount">' + 0 + '</span></b>辆';
                    const li2 = document.createElement('li');
                    li2.style.height = '2rem';
                    li2.style.lineHeight = '2rem';
                    li2.style.display = 'inline-block';
                    li2.style.fontSize = '0.9rem';
                    li2.style.color = '#999';
                    li2.style.verticalAlign = 'middle';
                    li2.innerHTML = '&nbsp&nbsp<span style="margin: 0.3rem 0.3rem; color:black;font-size: .8rem">|<span>&nbsp&nbsp';
                    const li3 = document.createElement('li');
                    li3.style.height = '2rem';
                    li3.style.lineHeight = '2rem';
                    li3.style.display = 'inline-block';
                    li3.style.fontSize = '0.9rem';
                    li3.style.color = '#999';
                    li3.style.verticalAlign = 'middle';
                    li3.innerHTML = '<img src="./assets/images/icon_map_car_on.png" style = "width:16%;margin-bottom:2px;" > 在线:<b><span id="online">' + 0 + '</span></b>辆';

                    const li4 = document.createElement('li');
                    li4.style.height = '2rem';
                    li4.style.lineHeight = '2rem';
                    li4.style.display = 'inline-block';
                    li4.style.fontSize = '0.9rem';
                    li4.style.color = '#999';
                    li4.style.verticalAlign = 'middle';
                    li4.innerHTML = '<span style="margin: 0.3rem 0.3rem; color:black;font-size: .8rem">|<span>';

                    const li5 = document.createElement('li');
                    li5.style.height = '2rem';
                    li5.style.lineHeight = '2rem';
                    li5.style.display = 'inline-block';
                    li5.style.fontSize = '0.9rem';
                    li5.style.color = '#999';
                    li5.style.verticalAlign = 'middle';
                    li5.innerHTML = '&nbsp&nbsp<img src="./assets/images/icon_map_car_off.png" style = "width:12%;margin-bottom: 2px;"> 离线:<b><span id="offline">' + 0 + '</span></b>辆';

                    divgroup.ondblclick = function (params: any) {
                        event.stopPropagation();
                    }

                    div.appendChild(li1);
                    div.appendChild(li2);
                    div.appendChild(li3);
                    div.appendChild(li4);
                    div.appendChild(li5);
                    return divgroup;
                },
            });
            this.leafletMap.addControl(new statusControl());
        }

        //地图缩放工具
        if (this.zoomDisplay) {
            L.control.zoom({
                zoomInTitle: '放大',
                zoomOutTitle: '缩小',
            }).setPosition('topleft').addTo(this.leafletMap);
        }
        //地图测距
        // if (this.measureDisplay) {
        //     const measure = L.control.polylineMeasure({
        //         position: 'topleft',
        //         unit: 'metres',
        //         measureControlTitleOn: '测距',
        //         measureControlTitleOff: '测距',
        //         tempLine: {
        //             color: '#3388ff',
        //             weight: 4
        //         },
        //         fixedLine: {
        //             color: '#3355ff',
        //             weight: 4
        //         },
        //         startCircle: {
        //             fillColor: '#99FF99',
        //             radius: 4
        //         },
        //         intermedCircle: {
        //             fillColor: '#FFFF77',
        //             radius: 4
        //         },
        //         endCircle: {
        //             fillColor: '#F94B4B',
        //             radius: 4
        //         }
        //     });
        //     measure.addTo(this.leafletMap);
        // }

        // 打点，画线，画区域工具栏
        if (this.drawcontrolDisplay) {
            const MyCustomMarker = L.Icon.extend({
                options: {
                    // shadowUrl: null,
                    // iconAnchor: new L.Point(12, 12),
                    iconSize: new L.Point(28, 40),
                    popupAnchor: [-0, -20],
                    iconUrl: './assets/images/marker-icon.png',
                },
            });
            this.drawnItems = L.featureGroup().addTo(this.leafletMap);

            const drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: this.drawnItems,
                },
                draw: {
                    // rectangle: {
                    //   shapeOptions: {allowIntersection: false , showArea: true},
                    // },
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                    },
                    marker: {
                        icon: new MyCustomMarker(),
                    },
                    // circlemarker: false,
                },
            });
            (L as any).drawLocal = {
                draw: {
                    toolbar: {
                        actions: {
                            title: '取消绘图',
                            text: '取消',
                        },
                        finish: {
                            title: '完成绘图',
                            text: '完成',
                        },
                        undo: {
                            title: '删除最后一个点',
                            text: '删除最后一个点',
                        },
                        buttons: {
                            polyline: '画线',
                            polygon: '画多边形',
                            rectangle: '画矩形',
                            circle: '画圆',
                            marker: '标记点',
                            circlemarker: '圆形标记点',
                        },
                    },
                    handlers: {
                        circle: {
                            tooltip: {
                                start: '点击并拖动绘制圆.',
                            },
                            radius: '半径',
                        },
                        circlemarker: {
                            tooltip: {
                                start: '单击地图绘制圆形标记.',
                            },
                        },
                        marker: {
                            tooltip: {
                                start: '单击地图绘制标记.',
                            },
                        },
                        polygon: {
                            tooltip: {
                                start: '单击地图以开始绘制.',
                                cont: '单击下一个点继续绘制.',
                                end: '单击第一个点完成绘制.',
                            },
                        },
                        polyline: {
                            error: '<strong>错误:</strong> 图形的边不能交叉!',
                            tooltip: {
                                start: '单击开始绘制线条.',
                                cont: '单击下一个点继续绘制线条.',
                                end: '双击结束绘制线条.',
                            },
                        },
                        rectangle: {
                            tooltip: {
                                start: '点击并拖动绘制矩形.',
                            },
                        },
                        simpleshape: {
                            tooltip: {
                                end: '松开鼠标完成绘图.',
                            },
                        },
                    },
                },
                edit: {
                    toolbar: {
                        actions: {
                            save: {
                                title: '保存所有改动',
                                text: '保存',
                            },
                            cancel: {
                                title: '取消编辑，丢弃所有改动',
                                text: '取消',
                            },
                            clearAll: {
                                title: '清除所有图形',
                                text: '清除',
                            },
                        },
                        buttons: {
                            edit: '编辑图形',
                            editDisabled: '没有图形可以编辑',
                            remove: '移除图形',
                            removeDisabled: '没有图形可以移除',
                        },
                    },
                    handlers: {
                        edit: {
                            tooltip: {
                                text: '拖动辅助点或标记来编辑图形.',
                                subtext: '单击“取消”撤消更改.',
                            },
                        },
                        remove: {
                            tooltip: {
                                text: '选中需要移除的图形.',
                            },
                        },
                    },
                },
            };
            drawControl.setPosition('topleft');
            this.leafletMap.addControl(drawControl);

            this.leafletMap.addEventListener(L.Draw.Event.CREATED, this.graphicalDrawed, this);

            this.leafletMap.addEventListener(L.Draw.Event.EDITED, this.graphicalEdited, this);

            this.leafletMap.addEventListener(L.Draw.Event.DELETED, this.graphicalDeleted, this);

            this.leafletMap.addEventListener(L.Draw.Event.DRAWSTOP, this.graphicalDrawStop, this);
            
        }

        // 全屏
        if (this.fullscreenDisplay) {
            L.control.fullscreen({
                position: 'topleft',
                content: '<i class="fa fa-arrows-alt"></i>',
                forceSeparateButton: true,
                title: '全屏',
            }).addTo(this.leafletMap);
        }

        //  鼠标经纬度
        if (this.mousePositionDisplay) {
            L.control.mousePosition({
                numDigits: 6,
                lngFirst: true,
            }).setPosition('bottomleft').addTo(this.leafletMap);
        }


        this.leafletMap.on('zoom', function (event) {
            // console.log(event.target._zoom);
        });

        this.leafletMap.on('popupopen', function() {
            console.log("car_detail")
            $("#carDetail").click(function() {
                console.log("car_detail1111");
            });
        });
    }

    graphicalDrawed(event) {
        const layer = event.layer;
        console.log(layer); 
        this.drawnItems.addLayer(layer);
        this.onDrawed.emit(event);
    }

    graphicalDrawStop(event) {
        console.log(event);
        this.onDrawStop.emit(event);
    }

    graphicalEdited(event) {
        this.onEdited.emit(event);
    }

    graphicalDeleted(event) {
        
        this.onDeleted.emit(event);
    }

    //添加单个图层
    addLayer(layerType, latlng, radius?) {
        let layer;
        if(layerType == "marker") {
            layer = L.marker(latlng);
        }else if (layerType == "circlemarker") {
            layer = L.circleMarker(latlng);
        }else if (layerType == "circle") {
            layer = L.circle(latlng,radius);
        }else if(layerType == "rectangle") {
            layer = L.rectangle(latlng);
        }else if (layerType == "polygon") {
            layer = L.polygon(latlng);
        }else if (layerType == "polyline") {
            layer = L.polyline(latlng);
        }
        this.drawnItems.addLayer(layer);
    }

    removeLayer(layer) {
        this.drawnItems.removeLayer(layer);
    }

    clearLayers() {
        this.drawnItems.clearLayers();
    }
}

