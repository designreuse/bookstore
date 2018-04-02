import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LbsSharedModule } from '../../shared';
import {
    SysUserService,
    SysUserPopupService,
    SysUserComponent,
    SysUserDetailComponent,
    SysUserDialogComponent,
    SysUserPopupComponent,
    SysUserDeletePopupComponent,
    SysUserDeleteDialogComponent,
    sysUserRoute,
    sysUserPopupRoute,
    SysUserResolvePagingParams,
} from './';
import {SysUserRoleComponent} from './sys-user-role.component';

const ENTITY_STATES = [
    ...sysUserRoute,
    ...sysUserPopupRoute,
];

@NgModule({
    imports: [
        LbsSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        SysUserComponent,
        SysUserDetailComponent,
        SysUserDialogComponent,
        SysUserDeleteDialogComponent,
        SysUserPopupComponent,
        SysUserDeletePopupComponent,
        SysUserRoleComponent
    ],
    entryComponents: [
        SysUserComponent,
        SysUserDialogComponent,
        SysUserPopupComponent,
        SysUserDeleteDialogComponent,
        SysUserDeletePopupComponent,
        SysUserRoleComponent
    ],
    providers: [
        SysUserService,
        SysUserPopupService,
        SysUserResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LbsSysUserModule {}
