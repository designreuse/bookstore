import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { SysRoleComponent } from './sys-role.component';
import { SysRoleDetailComponent } from './sys-role-detail.component';
import { SysRolePopupComponent } from './sys-role-dialog.component';
import { SysRoleDeletePopupComponent } from './sys-role-delete-dialog.component';

@Injectable()
export class SysRoleResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const sysRoleRoute: Routes = [
    {
        path: 'sys-role',
        component: SysRoleComponent,
        resolve: {
            'pagingParams': SysRoleResolvePagingParams
        },
        data: {
            authorities: ['402882bd5f3862d9015f38761e0e0001'],
            pageTitle: 'lbsApp.sysRole.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'sys-role/:id',
        component: SysRoleDetailComponent,
        data: {
            authorities: ['402882bd5f3862d9015f38761e0e0001'],
            pageTitle: 'lbsApp.sysRole.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const sysRolePopupRoute: Routes = [
    {
        path: 'sys-role-new',
        component: SysRolePopupComponent,
        data: {
            authorities: ['402882bd5f3862d9015f38761e0e0001'],
            pageTitle: 'lbsApp.sysRole.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sys-role/:id/edit',
        component: SysRolePopupComponent,
        data: {
            authorities: ['402882bd5f3862d9015f38761e0e0001'],
            pageTitle: 'lbsApp.sysRole.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sys-role/:id/delete',
        component: SysRoleDeletePopupComponent,
        data: {
            authorities: ['402882bd5f3862d9015f38761e0e0001'],
            pageTitle: 'lbsApp.sysRole.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sys-role-privilege/:roleId/editPrivilege',
        component: SysRolePopupComponent,
        data: {
            authorities: ['402882bd5f3862d9015f38761e0e0001'],
            pageTitle: 'lbsApp.sysRole.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }

];
