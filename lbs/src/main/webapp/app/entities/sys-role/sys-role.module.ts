import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LbsSharedModule } from '../../shared';
import {
    SysRoleService,
    SysRolePopupService,
    SysRoleComponent,
    SysRoleDetailComponent,
    SysRoleDialogComponent,
    SysRolePopupComponent,
    SysRoleDeletePopupComponent,
    SysRoleDeleteDialogComponent,
    sysRoleRoute,
    sysRolePopupRoute,
    SysRoleResolvePagingParams,
} from './';
import {SysRolePrivilegeComponent} from './sys-role-privilege.component';

const ENTITY_STATES = [
    ...sysRoleRoute,
    ...sysRolePopupRoute,
];

@NgModule({
    imports: [
        LbsSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        SysRoleComponent,
        SysRoleDetailComponent,
        SysRoleDialogComponent,
        SysRoleDeleteDialogComponent,
        SysRolePopupComponent,
        SysRoleDeletePopupComponent,
        SysRolePrivilegeComponent,
    ],
    entryComponents: [
        SysRoleComponent,
        SysRoleDialogComponent,
        SysRolePopupComponent,
        SysRoleDeleteDialogComponent,
        SysRoleDeletePopupComponent,
        SysRolePrivilegeComponent,
    ],
    providers: [
        SysRoleService,
        SysRolePopupService,
        SysRoleResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LbsSysRoleModule {}
