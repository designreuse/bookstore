import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LbsSharedModule } from '../../shared';
import {
    SysPrivilegeService,
    SysPrivilegePopupService,
    SysPrivilegeComponent,
    SysPrivilegeDetailComponent,
    SysPrivilegeDialogComponent,
    SysPrivilegePopupComponent,
    SysPrivilegeDeletePopupComponent,
    SysPrivilegeDeleteDialogComponent,
    sysPrivilegeRoute,
    sysPrivilegePopupRoute,
    SysPrivilegeResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...sysPrivilegeRoute,
    ...sysPrivilegePopupRoute,
];

@NgModule({
    imports: [
        LbsSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        SysPrivilegeComponent,
        SysPrivilegeDetailComponent,
        SysPrivilegeDialogComponent,
        SysPrivilegeDeleteDialogComponent,
        SysPrivilegePopupComponent,
        SysPrivilegeDeletePopupComponent,
    ],
    entryComponents: [
        SysPrivilegeComponent,
        SysPrivilegeDialogComponent,
        SysPrivilegePopupComponent,
        SysPrivilegeDeleteDialogComponent,
        SysPrivilegeDeletePopupComponent,
    ],
    providers: [
        SysPrivilegeService,
        SysPrivilegePopupService,
        SysPrivilegeResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LbsSysPrivilegeModule {}
