import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarTreeComponent } from './car-tree/car-tree.component';
import { GroupTreeComponent } from './group-tree/group-tree.component';
import { DialogModule, ButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { ThemeModule } from 'app/@theme/theme.module';
import { RoleAuthTreeComponent } from './role-auth-tree/role-auth-tree.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DialogModule,
    FormsModule,
    TreeModule,
    ButtonModule,
  ],
  exports: [
    CarTreeComponent, GroupTreeComponent,RoleAuthTreeComponent
  ],
  declarations: [CarTreeComponent, GroupTreeComponent,RoleAuthTreeComponent]
})
export class LbsCommonModule { }
