import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LbsSysUserModule } from './sys-user/sys-user.module';
import { LbsSysRoleModule } from './sys-role/sys-role.module';
import { LbsSysPrivilegeModule } from './sys-privilege/sys-privilege.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        LbsSysUserModule,
        LbsSysRoleModule,
        LbsSysPrivilegeModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LbsEntityModule {}
