import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import {DialogModule,GrowlModule,SidebarModule,DataTableModule,ButtonModule, CheckboxModule} from 'primeng/primeng';
import { LbsAlarmModule } from 'app/pages/lbs-alarm/lbs-alarm.module';
import { LbsAlarmComponent } from 'app/pages/lbs-alarm/lbs-alarm.component';
import { LbsTreeModule } from 'app/pages/common-util/lbstree/lbstree.module';
import { LbsTreeComponent } from 'app/pages/common-util/lbstree/lbstree.component';
// import { GlobalTimeComponent } from 'app/pages/global-time/global-time.component';
const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    SidebarModule,
    GrowlModule,
    ButtonModule,
    DataTableModule,
    LbsAlarmModule,
    LbsTreeModule,
    CheckboxModule,
  ],
  entryComponents: [
    LbsAlarmComponent,
    LbsTreeComponent,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    // GlobalTimeComponent,
  ],
})
export class PagesModule {
}
