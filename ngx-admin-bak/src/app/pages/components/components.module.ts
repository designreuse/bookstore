import { NgModule } from '@angular/core';

import { TreeModule } from 'ng2-tree';
import { ToasterModule } from 'angular2-toaster';
import { ThemeModule } from '../../@theme/theme.module';

// import{ZtreeModule} from './ztree/ztree.module';//ztree

import { ComponentsRoutingModule, routedComponents } from './components-routing.module';
// import { NgxEchartsModule  } from 'ngx-echarts';

@NgModule({
  imports: [
    ThemeModule,
    ComponentsRoutingModule,
    TreeModule,
    ToasterModule,    
    // ZtreeModule,
    // ButtonModule,
    // TabViewModule,
    // DataGridModule,
    // CalendarModule,
    // DataTableModule,  
    // ChartModule, 
    // NgxEchartsModule,
  ],
  exports:[ ],
  declarations: [
    ...routedComponents,   
  ],

})
export class ComponentsModule { }
