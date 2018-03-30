import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapsComponent } from './maps.component';
// import { GmapsComponent } from './gmaps/gmaps.component';
// import { LeafletComponent } from './leaflet/leaflet.component';
// import { BubbleMapComponent } from './bubble/bubble-map.component';
// import { LeafletDemoComponent } from 'app/pages/demos/leaflet/leafletdemo.component';
// import { PrimeNgDemoComponent } from 'app/pages/demos/primeng/primengdemo.component';

import { CarHisLineComponent } from 'app/pages/carmap/CarHistoryLine/carhisline.component';
import { CarPositionComponent } from 'app/pages/carmap/CarPosition/carposition.component';
import { LbsTreeComponent } from 'app/pages/common-util/lbstree/lbstree.component';
import { LbsMapComponent } from 'app/pages/components/map/map.component';
// import { SystemUpdateComponent } from 'app/pages/demos/SystemUpdate/system-update.component';
// import { SysUpComponent } from 'app/pages/carCharts/systemUpdateTable/sys-up.component';
import { ElectricFenceComponent } from 'app/pages/demos/electronic-fence/electronic-fence.component';
import { LbsVideoComponent } from 'app/pages/carmap/lbs-video/lbs-video.component';
import { LbsHistoryVideoComponent } from 'app/pages/carmap/lbs-video/lbs-history-video/lbs-history-video.component';

const routes: Routes = [{
  path: '',
  component: MapsComponent,
  children: [
    //   {
    //   path: 'gmaps',
    //   component: GmapsComponent,
    //  }, 
    //  {
    //   path: 'leaflet',
    //   component: LeafletComponent,
    // }, {
    //   path: 'bubble',
    //   component: BubbleMapComponent,
    // }, {
    //   path: 'LeafletDemo',
    //   component: LeafletDemoComponent,
    // },
    // {
    //   path: 'PrimeNgDemo',
    //   component: PrimeNgDemoComponent,
    // },
    {
      path: 'CarHisLine',
      component: CarHisLineComponent,
    },
    {
      path: 'CarPosition/:singleCarNo',
      component: CarPositionComponent,
    },
    // {
    //   path: 'systemupdate',
    //   // component: SystemUpdateComponent,
    // },
    {
      path: 'electronicFence',
      component: ElectricFenceComponent,
    },
    {
      path: 'lbs-video',
      component: LbsVideoComponent,
    },
    {
      path: 'lbs-history-video',
      component: LbsHistoryVideoComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapsRoutingModule { }

export const routedComponents = [
  MapsComponent,
  // GmapsComponent,
  // LeafletComponent,
  // BubbleMapComponent,
  // LeafletDemoComponent,
  // PrimeNgDemoComponent,
  CarHisLineComponent,
  CarPositionComponent,
  LbsMapComponent,
  // SystemUpdateComponent,
  // SysUpComponent,
  ElectricFenceComponent,
  LbsVideoComponent,
  LbsHistoryVideoComponent
];
