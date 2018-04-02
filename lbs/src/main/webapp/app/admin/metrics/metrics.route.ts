import { Route } from '@angular/router';

import { JhiMetricsMonitoringComponent } from './metrics.component';
import {UserRouteAccessService} from '../../shared/auth/user-route-access-service';

export const metricsRoute: Route = {
    path: 'jhi-metrics',
    component: JhiMetricsMonitoringComponent,
    data: {
        pageTitle: 'metrics.title'
    }
};
