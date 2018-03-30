import { SystemManagerComponent } from './system-manager.component';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { DropdownModule, ButtonModule, InputTextModule, DataGridModule } from 'primeng/primeng';
import { CalendarModule, DataTableModule, GrowlModule, DialogModule } from 'primeng/primeng';
import { TreeModule } from 'angular-tree-component';

import { routedComponents, SystemManagerRoutingModule } from './system-manager-routing.module';

import { LbsTreeModule } from 'app/pages/common-util/lbstree/lbstree.module';
import { LbsTreeComponent } from 'app/pages/common-util/lbstree/lbstree.component';
import { LbsCommonModule } from 'app/pages/lbs-common/lbs-common.module';
import { ToasterModule } from 'angular2-toaster/src/toaster.module';

const components = [
  SystemManagerComponent,
];

@NgModule({
  imports: [ThemeModule,
    SystemManagerRoutingModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    TreeModule,
    DropdownModule,
    ButtonModule,
    DataGridModule,
    CalendarModule,
    DataTableModule,
    GrowlModule,
    Ng2SmartTableModule,
    InputTextModule,
    LbsTreeModule,
    LbsCommonModule,
    DialogModule,
    ToasterModule,
  ], exports: [
    RoleManagerComponent,
  ],
  entryComponents: [
    LbsTreeComponent
  ],
  declarations: [...routedComponents,...components],
})
export class SystemManagerModule { }
