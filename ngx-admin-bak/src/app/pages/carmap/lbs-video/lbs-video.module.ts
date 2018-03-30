import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule,ButtonModule,PaginatorModule,SidebarModule,CheckboxModule,GrowlModule,CalendarModule,SliderModule } from 'primeng/primeng';
import { LbsVideoComponent } from './lbs-video.component';
import { LbsHistoryVideoComponent } from './lbs-history-video/lbs-history-video.component';


@NgModule({ 
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    PaginatorModule,
    SidebarModule,
    CheckboxModule,
    GrowlModule,
    CalendarModule,
    SliderModule
  ],
  exports: [
    LbsVideoComponent,LbsHistoryVideoComponent
  ],
  declarations: [LbsVideoComponent,LbsHistoryVideoComponent]
})
export class LbsVideoModule { }
