import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import 'style-loader!leaflet/dist/leaflet.css';
import MiniMap from 'leaflet-minimap';
import 'style-loader!leaflet-minimap/dist/Control.MiniMap.min.css';
import 'leaflet-mouse-position';
import 'style-loader!leaflet-mouse-position/src/L.Control.MousePosition.css';
import 'leaflet.fullscreen';
import 'leaflet-draw';
import 'style-loader!leaflet-draw/dist/leaflet.draw.css';
import 'leaflet.markercluster';
import 'style-loader!leaflet.markercluster/dist/MarkerCluster.css';
import 'style-loader!leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-movingmaker';
// import 'coordtransform';


// import { PruneCluster } from 'exports-loader?PruneClusterForLeaflet!prunecluster/dist/PruneCluster.js'
@Component({
  selector: 'ngx-leaflet',
  styleUrls: ['./leafletdemo.component.scss'],
  template: `<nb-card>
  <nb-card-header>Leaflet Maps</nb-card-header>
  <nb-card-body>
    <div id="leaf" >
    </div>
  </nb-card-body>
</nb-card>`,
})
export class LeafletDemoComponent implements OnInit {

  private centerPoint: any;
  private options: any;
  private leafletMap: any;

  constructor () {
  }

  ngOnInit() {
    
    const center = { lat: 32.044924, lng:118.765011 };
    const zoom = 15;
 
    const gaodeMini = L.tileLayer(
      'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
    , { maxZoom: 18, subdomains: ['1', '2', '3', '4'] });

    const openstreetmap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18});

    const tianditu = L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}'
    , { maxZoom: 18, subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] });
    const tiandituMark = L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}'
    , { maxZoom: 18, subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] });
    const tiandituYx = L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}'
    , { maxZoom: 18, subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] });
    const tiandituYxMark = L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}'
    , { maxZoom: 18, subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] });

    const gaode = L.tileLayer(
      'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
    , { maxZoom: 18, subdomains: ['1', '2', '3', '4'] });
    const gaodeYx = L.tileLayer('http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
    , { maxZoom: 18, subdomains: ['1', '2', '3', '4'] });
    const gaodeYxMark = L.tileLayer('http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
    , { maxZoom: 18, subdomains: ['1', '2', '3', '4'] });

    const hongxin = L.tileLayer(
      'http://202.102.112.19:6080/arcgis/rest/services/mapmercator/MapServer/tile/{z}/{y}/{x}'
    , { maxZoom: 18});

    // 多源地图集成
    const hongxinBase = L.layerGroup([hongxin]);
    const tiandituBase = L.layerGroup([tianditu, tiandituMark]);
    const tiandituimage = L.layerGroup([tiandituYx, tiandituYxMark]);
    const gaodeBase = L.layerGroup([gaode]);
    const gaodeimage = L.layerGroup([gaodeYx, gaodeYxMark]);
    const openstreetmapBase = L.layerGroup([openstreetmap]);
    const baseLayers = {
      '高德': gaodeBase,
      '高德影像': gaodeimage,
      '天地图': tiandituBase,
      '天地图影像': tiandituimage,
      // 'openstreetmap': openstreetmapBase,
      '鸿信地图': hongxin,
    }

    if (this.leafletMap == null) {
      // 地图初始化
      this.leafletMap = L.map('leaf', {
        layers: [gaodeBase],
        zoom: 15,
        minZoom: 8,
        center: center,
        zoomControl: false,
      })
    }

    // const bd09togcj02 = (coordtransform as any).bd09togcj02(116.404, 39.915);



    L.control.layers(baseLayers, null).addTo(this.leafletMap);

    // 比例尺
    L.control.scale().addTo(this.leafletMap);
    L.control.zoom({
      zoomInTitle: '放大',
      zoomOutTitle: '缩小',
    }).addTo(this.leafletMap);
    // 鹰眼
    const miniMap = new MiniMap(gaodeMini, {toggleDisplay: true}).addTo(this.leafletMap);

    // 打点，画线，画区域工具栏
    const MyCustomMarker = L.Icon.extend({
      options: {
          // shadowUrl: null,
          // iconAnchor: new L.Point(12, 12),
          iconSize: new L.Point(28, 40),
          popupAnchor: [-0, -20],
          iconUrl: './assets/images/marker-icon.png',
      },
    });
    const drawnItems = L.featureGroup().addTo(this.leafletMap);

    const drawControl = new L.Control.Draw({
      edit: {
          featureGroup: drawnItems,
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
    (L as any).drawLocal =  {
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
    this.leafletMap.addControl(drawControl);
    this.leafletMap.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      // layer.toGeoJSON()
      if (event.layerType === 'marker') {
        layer.bindPopup('这是一个弹窗');
      }
      const a = event.target;
      const area = L.GeometryUtil.geodesicArea(event);
      // const area2 = L.GeometryUtil.readableArea(event);

      drawnItems.addLayer(layer);
    });
    const myIcon = L.icon({
      iconUrl: './assets/images/greencar.png',
      iconSize: [24, 36],
      iconAnchor: [14, 30],
      popupAnchor: [-0, -30],
      // shadowUrl: 'my-icon-shadow.png',
      // shadowSize: [68, 95],
      // shadowAnchor: [22, 94],
     });

    // 打点
    const curmarker = L.marker([32.044924, 118.765011], {
       pane: 'markerPane',
       icon: myIcon,
     });
     const popupHtml =
     '车牌号:苏A323X1  颜色:黄色<br> 速度: 60km/h  里程:20356km<br> 日期: 2017-11-10 16:21:11 <br> 经度:118.765011  纬度:32.044924<br>'
     curmarker.addTo(this.leafletMap);
     curmarker.bindPopup(popupHtml).openPopup();


    //  鼠标经纬度
    L.control.mousePosition({
      numDigits: 6,
      lngFirst: true,
    }).addTo(this.leafletMap);

    // 全屏，添加到放大缩小下方的按钮
    // const icon: L.Control.Fullscreen = L.control.fullscreen({
    //   position: 'topleft',
    //   title: 'Full Screen',
    //   titleCancel: 'Exit Full Screen',
    //   forceSeparateButton: false,
    //   forcePseudoFullscreen: false,
    // });

    // icon.addTo(this.leafletMap);

    // 全屏
    L.control.fullscreen({
      position: 'topleft',
      content: '<i class="fa fa-arrows-alt"></i>',
      forceSeparateButton: true,
      title: '全屏',
    }).addTo(this.leafletMap);

    // L.control.coordinates({}).addTo(this.leafletMap);

    // 地图聚合功能
    const markerCluster = L.markerClusterGroup({});
    markerCluster.clearLayers();
    const markerList = [];
    const latlonArray = [[32.155761, 118.7881002], [32.165761, 118.8281002], [32.170761, 118.7981002],
     [32.155701, 118.7781002], [32.145761, 118.6881002], [32.155061, 118.8181002], [32.150761, 118.8101002],
     [32.158861, 118.8001002], [32.135761, 118.8281002], [32.140061, 118.7081002], [32.125761, 118.8581002],
     [32.105761, 118.8281002]];

     for (const latlon in latlonArray) {
        if (latlon != null) {
          const cumarker = L.marker([ latlonArray[latlon][0], latlonArray[latlon][1]], {title: latlon, icon: myIcon});
          cumarker.bindPopup('第' + (Number(latlon) + 1) + '个点');
          markerList.push(cumarker);
        }
     }

    markerCluster.addLayers(markerList);
    this.leafletMap.addLayer(markerCluster);

    // 历史轨迹
    const parisKievLL = [[32.155761, 118.7881002], [32.165761, 118.8281002], [32.125761, 118.8581002]];
    // 移动的标记--每个线段都需要设置移动时间，不设置的话就会停止在上一个线段的终点
    // L.Marker.MarkMoving.movingMarker
    const marker1 = L.Marker.movingMarker(parisKievLL, [10000, 2000], {icon: myIcon}).addTo(this.leafletMap);
    // 轨迹
    L.polyline([L.latLng(32.155761, 118.7881002), L.latLng(32.165761, 118.8281002),
        L.latLng(32.125761, 118.8581002)]).addTo(this.leafletMap);
    marker1.bindPopup('<b>轨迹移动 !</b>').openPopup();
    marker1.start();

    // Controls
    const MoveControl = L.Control.extend({
      options: {position: 'topright'},
      onAdd(map) {
            const pauseBtn = document.createElement('button');
            pauseBtn.innerText = '■';
            pauseBtn.onclick = function() {
                marker1.pause();
            };
            const playBtn = document.createElement('button');
            playBtn.innerText = '▶️';
            playBtn.onclick = function() {
                marker1.start();
            };
            const div = document.createElement('div');
            div.appendChild(pauseBtn);
            div.appendChild(playBtn);
            return div;
        },
      });
      this.leafletMap.addControl(new MoveControl());
    }

}
