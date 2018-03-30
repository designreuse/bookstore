import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule,ButtonModule,PaginatorModule,SidebarModule,CheckboxModule,GrowlModule } from 'primeng/primeng';
import { LbsVideoDemoComponent } from './lbs-video.component';


@NgModule({ 
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    PaginatorModule,
    SidebarModule,
    CheckboxModule,
    GrowlModule,
  ],
  exports: [
    LbsVideoDemoComponent,
  ],
  declarations: [LbsVideoDemoComponent]
})
export class LbsVideoModule { }
