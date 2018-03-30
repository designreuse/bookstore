import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { MapsRoutingModule, routedComponents } from './maps-routing.module';
import {AutoCompleteModule,TabViewModule,ButtonModule,DialogModule,
  SidebarModule,DataGridModule,CalendarModule,DataTableModule,GrowlModule, DropdownModule, InputTextModule, OverlayPanelModule, CheckboxModule, ContextMenuModule,SliderModule} from 'primeng/primeng';
import { ToasterModule } from 'angular2-toaster';
import { TreeModule } from 'angular-tree-component';
import { LbsTreeComponent } from 'app/pages/common-util/lbstree/lbstree.component';
import { LbsTreeModule } from 'app/pages/common-util/lbstree/lbstree.module';
import { CarTreeComponent } from 'app/pages/lbs-common/car-tree/car-tree.component';
import { LbsCommonModule } from 'app/pages/lbs-common/lbs-common.module';
import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';

@NgModule({
  imports: [
    ThemeModule,
    AgmCoreModule.forRoot(),
    LeafletModule.forRoot(),
    MapsRoutingModule,
    NgxEchartsModule,
    AutoCompleteModule,
    ButtonModule,
    TabViewModule,
    DataGridModule,
    CalendarModule,
    ToasterModule,
    DataTableModule,
    DropdownModule,
    CheckboxModule,
    ContextMenuModule,
    SliderModule,
    OverlayPanelModule,
    TreeModule,
    DialogModule,
    SidebarModule,
    GrowlModule,
    LbsTreeModule,
    LbsCommonModule,
    DropdownModule,
    InputTextModule,
    ConfirmDialogModule
  ],
  exports: [],
  entryComponents: [
    LbsTreeComponent,
    CarTreeComponent
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class MapsModule { }
