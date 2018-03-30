import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../../@theme/theme.module';
import {AutoCompleteModule,TabViewModule,ButtonModule,DialogModule,
  SidebarModule,DataGridModule,CalendarModule,DataTableModule,GrowlModule, DropdownModule} from 'primeng/primeng';
import { ToasterModule } from 'angular2-toaster';
import { TreeModule } from 'angular-tree-component';
import { LbsTreeComponent } from 'app/pages/common-util/lbstree/lbstree.component';
@NgModule({ 
  imports: [
    ThemeModule,
    AgmCoreModule.forRoot(),
    LeafletModule.forRoot(),
    NgxEchartsModule,
    AutoCompleteModule,
    ButtonModule,
    TabViewModule,
    DataGridModule,
    CalendarModule,
    ToasterModule,
    TreeModule,
    DropdownModule
  ],
  exports: [
    LbsTreeComponent
  ],
  declarations: [LbsTreeComponent]
})
export class LbsTreeModule { }
