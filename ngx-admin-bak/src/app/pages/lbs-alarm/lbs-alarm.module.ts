import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DialogModule,ButtonModule,DataTableModule,PaginatorModule,SidebarModule} from 'primeng/primeng';
import { LbsAlarmComponent } from 'app/pages/lbs-alarm/lbs-alarm.component';
import { LbsAlarmSearchComponent } from 'app/pages/lbs-alarm/lbs-alarm-search/lbs-alarm-search.component';
import { LbsAlarmTableComponent } from 'app/pages/lbs-alarm/lbs-alarm-table/lbs-alarm-table.component';
import { LbsAlarmCtrlComponent } from 'app/pages/lbs-alarm/lbs-alarm-ctrl/lbs-alarm-ctrl.component';


@NgModule({ 
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    DataTableModule,
    // SharedModule,
    // DropdownModule,
    PaginatorModule,
    SidebarModule,
  ],
  exports: [
    LbsAlarmComponent,
  ],
  declarations: [LbsAlarmComponent, LbsAlarmSearchComponent, LbsAlarmTableComponent, LbsAlarmCtrlComponent]
})
export class LbsAlarmModule { }
