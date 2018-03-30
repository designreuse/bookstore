import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartsComponent } from './charts.component';
// import { EchartsComponent } from './echarts/echarts.component';
// import { D3Component } from './d3/d3.component';
// import { ChartjsComponent } from './chartjs/chartjs.component';
// import { NgTreeDemoComponent } from '../demos/ngtree2/ngtreedemo.component';
import { AlarmTrendChartComponent } from '../adas/alarmTrendChart/alarm-trend-chart.component';
// import { AlarmTypePieComponent } from '../carCharts/alarmTypePie/alarm-type-pie.component';
// import { DriverReportComponent } from '../adas/driversReport/driver-report.component';
import { DriverScoreComponent } from '../adas/driverScoreTable/driver-score.component';
import { AlarmdealComponent } from '../adas/alarmdealtable/alarmdealtable.component';
import { AlarmQueryComponent } from 'app/pages/adas/alarm-query/alarm-query.component';
import { UpgradeRecordComponent } from 'app/pages/adas/upgradeRecord/upgrade-record.component';
import { DriverAnormityComponent } from 'app/pages/adas/driver-anormity/driver-anormity.component';
import { SysUpComponent } from 'app/pages/adas/systemUpdateTable/sys-up.component';
const routes: Routes = [{
  path: '',
  component: ChartsComponent,
  children: [
    //   {
    //   path: 'echarts',
    //   component: EchartsComponent,
    // }, {
    //   path: 'd3',
    //   component: D3Component,
    // }, {
    //   path: 'chartjs',
    //   component: ChartjsComponent,
    // },
    // {
    //   path: 'AngularTreeDemo',
    //   component: NgTreeDemoComponent,
    // },
    {
      path: 'alarm-trend-chart',
      component: AlarmTrendChartComponent,
    },
    // {
    //   path: 'alarm-type-pie',
    //   component: AlarmTypePieComponent,
    // },
    // {
    //   path: 'driver-report',
    //   component: DriverReportComponent,
    // },
    {
      path: 'driver-score',
      component: DriverScoreComponent,
    },
    {
      path: 'alarm-deal',
      component: AlarmdealComponent,
    },
    {
      path: 'alarm-query',
      component: AlarmQueryComponent,
    },
    {
      path: 'upgrade-record',
      component: UpgradeRecordComponent,
    },
    {
      path: 'driver-anormity',
      component: DriverAnormityComponent,
    },
    {
      path: 'sys-up',
      component: SysUpComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsRoutingModule { }

export const routedComponents = [
  ChartsComponent,
  // EchartsComponent,
  // D3Component,
  // ChartjsComponent,
  // NgTreeDemoComponent,
  AlarmdealComponent,
];
