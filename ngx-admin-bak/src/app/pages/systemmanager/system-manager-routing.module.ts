import { SystemManagerComponent } from './system-manager.component';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: SystemManagerComponent,
  children: [
    {
      path: 'role-manager',
      component: RoleManagerComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemManagerRoutingModule { }

export const routedComponents = [
  RoleManagerComponent,
];
