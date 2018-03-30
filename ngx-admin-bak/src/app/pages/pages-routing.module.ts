import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRouteAccessService } from 'app/pages/login/user/user-route-access-service';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
  }, {
    path: 'ui-features',
    loadChildren: './ui-features/ui-features.module#UiFeaturesModule',
  }, {
    path: 'components',
    loadChildren: './components/components.module#ComponentsModule',
  }, {
    path: 'maps',
    loadChildren: './maps/maps.module#MapsModule',
  }, {
    path: 'charts',
    loadChildren: './charts/charts.module#ChartsModule',
  }, {
    path: 'editors',
    loadChildren: './editors/editors.module#EditorsModule',
  }, {
    path: 'forms',
    loadChildren: './forms/forms.module#FormsModule',
  }, {
    path: 'tables',
    loadChildren: './tables/tables.module#TablesModule',
  },
  // {
  //   path: 'userTable',
  //   loadChildren: './userTable/testTable.module#TestTableModule',
  // }, 
  {
    path: '',
    redirectTo: 'components/CarHisLine',
    pathMatch: 'full',
  }, 
  // {
  //   path: 'alarmTable',
  //   loadChildren: './driver-alarm-table/alarmTable.module#AlarmTableModule',
  // },
  {
    path: 'electric-fence',
    loadChildren: './maps/maps.module#MapsModule',
  },{
    path: 'system-manager',
    loadChildren: './systemmanager/system-manager.module#SystemManagerModule',
  }
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
