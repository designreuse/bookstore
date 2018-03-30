import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components.component';
import { TreeComponent } from './tree/tree.component';
import { NotificationsComponent } from './notifications/notifications.component';

//import {SelectZtreeComponent} from './ztree/select-ztree.component';
// import {ZtreeComponent} from './ztree/ztree.component';
// import { ZtreeDemoComponent } from 'app/pages/demos/ztreeDemo/ztreedemo.component';
// import { CarHisLineComponent } from '../demos/CarHistoryLine/carhisline.component';
// import { LbsMapComponent } from '../components/map/map.component';

const routes: Routes = [{
  path: '',
  component: ComponentsComponent,
  children: [
    {
      path: 'tree',
      component: TreeComponent,
    }, {
      path: 'notifications',
      component: NotificationsComponent,
    },
    // {
    //   path: 'ZtreeDemo',
    //   component: ZtreeDemoComponent,
    // },
    // {
    //   path: 'CarHisLine',
    //   component: CarHisLineComponent,
    // },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsRoutingModule { }

export const routedComponents = [
  ComponentsComponent,
  TreeComponent,
  NotificationsComponent,
  // ZtreeDemoComponent,
  //SelectZtreeComponent
  // CarHisLineComponent,
  // LbsMapComponent,
];
