import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { ChartsRoutingModule, routedComponents } from './charts-routing.module';
import { ChartjsBarComponent } from './chartjs/chartjs-bar.component';
import { ChartjsLineComponent } from './chartjs/chartjs-line.component';
import { ChartjsPieComponent } from './chartjs/chartjs-pie.component';
import { ChartjsMultipleXaxisComponent } from './chartjs/chartjs-multiple-xaxis.component';
import { ChartjsBarHorizontalComponent } from './chartjs/chartjs-bar-horizontal.component';
import { ChartjsRadarComponent } from './chartjs/chartjs-radar.component';
import { D3BarComponent } from './d3/d3-bar.component';
import { D3LineComponent } from './d3/d3-line.component';
import { D3PieComponent } from './d3/d3-pie.component';
import { D3AreaStackComponent } from './d3/d3-area-stack.component';
import { D3PolarComponent } from './d3/d3-polar.component';
import { D3AdvancedPieComponent } from './d3/d3-advanced-pie.component';
import { EchartsLineComponent } from './echarts/echarts-line.component';
import { EchartsPieComponent } from './echarts/echarts-pie.component';
import { EchartsBarComponent } from './echarts/echarts-bar.component';
import { EchartsMultipleXaxisComponent } from './echarts/echarts-multiple-xaxis.component';
import { EchartsAreaStackComponent } from './echarts/echarts-area-stack.component';
import { EchartsBarAnimationComponent } from './echarts/echarts-bar-animation.component';
import { EchartsRadarComponent } from './echarts/echarts-radar.component';
import { AlarmTrendChartComponent } from '../adas/alarmTrendChart/alarm-trend-chart.component';
// import { AlarmTypePieComponent } from '../carCharts/alarmTypePie/alarm-type-pie.component';
// import { DriverReportComponent } from '../adas/driversReport/driver-report.component';
import { DriverScoreComponent } from '../adas/driverScoreTable/driver-score.component';
import { DropdownModule, ButtonModule, InputTextModule, DataGridModule, MultiSelectModule, OverlayPanelModule, SidebarModule, GalleriaModule } from 'primeng/primeng';
import { CalendarModule, DataTableModule, GrowlModule, DialogModule, ConfirmDialogModule, CheckboxModule, MenuModule, ContextMenuModule } from 'primeng/primeng';
import { TreeModule } from 'angular-tree-component';
import { AlarmQueryComponent } from 'app/pages/adas/alarm-query/alarm-query.component';
import { LbsTreeModule } from 'app/pages/common-util/lbstree/lbstree.module';
import { LbsTreeComponent } from 'app/pages/common-util/lbstree/lbstree.component';
import { LbsCommonModule } from 'app/pages/lbs-common/lbs-common.module';
import { ToasterModule } from 'angular2-toaster/src/toaster.module';
import { UpgradeRecordComponent } from 'app/pages/adas/upgradeRecord/upgrade-record.component';
import { DriverAnormityComponent } from 'app/pages/adas/driver-anormity/driver-anormity.component';
import { SysUpComponent } from 'app/pages/adas/systemUpdateTable/sys-up.component';
import { DetailComponent } from '../adas/driver-anormity/detail/detail.component';
import { DealComponent } from '../adas/driver-anormity/deal/deal.component';

const components = [
  ChartjsBarComponent,
  ChartjsLineComponent,
  ChartjsPieComponent,
  ChartjsMultipleXaxisComponent,
  ChartjsBarHorizontalComponent,
  ChartjsRadarComponent,
  D3BarComponent,
  D3LineComponent,
  D3PieComponent,
  D3AreaStackComponent,
  D3PolarComponent,
  D3AdvancedPieComponent,
  EchartsLineComponent,
  EchartsPieComponent,
  EchartsBarComponent,
  EchartsMultipleXaxisComponent,
  EchartsAreaStackComponent,
  EchartsBarAnimationComponent,
  EchartsRadarComponent,
  AlarmTrendChartComponent,
  // AlarmTypePieComponent,
  // DriverReportComponent,
  DriverScoreComponent,
  AlarmQueryComponent,
  UpgradeRecordComponent,
  DriverAnormityComponent,
  DetailComponent,
  DealComponent,
  SysUpComponent,
];

@NgModule({
  imports: [ThemeModule,
    ChartsRoutingModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    TreeModule,
    DropdownModule,
    ButtonModule,
    DataGridModule,
    CalendarModule,
    DataTableModule,
    CheckboxModule,
    MenuModule,
    ContextMenuModule,
    GrowlModule,
    SidebarModule,
    Ng2SmartTableModule,
    InputTextModule,
    LbsTreeModule,
    LbsCommonModule,
    DialogModule,
    ToasterModule,
    ConfirmDialogModule,
    MultiSelectModule,
    OverlayPanelModule,
    GalleriaModule,
  ], exports: [
    AlarmTrendChartComponent,
    // AlarmTypePieComponent
  ],
  entryComponents: [
    LbsTreeComponent
  ],
  declarations: [...routedComponents, ...components],
})
export class ChartsModule { }
