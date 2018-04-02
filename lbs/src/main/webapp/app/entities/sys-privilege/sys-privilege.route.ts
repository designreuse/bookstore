import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { SysPrivilegeComponent } from './sys-privilege.component';
import { SysPrivilegeDetailComponent } from './sys-privilege-detail.component';
import { SysPrivilegePopupComponent } from './sys-privilege-dialog.component';
import { SysPrivilegeDeletePopupComponent } from './sys-privilege-delete-dialog.component';

@Injectable()
export class SysPrivilegeResolvePagingParams implements Resolve<any> {

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

export const sysPrivilegeRoute: Routes = [
    {
        path: 'sys-privilege',
        component: SysPrivilegeComponent,
        resolve: {
            'pagingParams': SysPrivilegeResolvePagingParams
        },
        data: {
            authorities: ['402882bd5f3862d9015f38764ba30002'],
            pageTitle: 'lbsApp.sysPrivilege.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'sys-privilege/:id',
        component: SysPrivilegeDetailComponent,
        data: {
            authorities: ['402882bd5f3862d9015f38764ba30002'],
            pageTitle: 'lbsApp.sysPrivilege.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const sysPrivilegePopupRoute: Routes = [
    {
        path: 'sys-privilege-new',
        component: SysPrivilegePopupComponent,
        data: {
            authorities: ['402882bd5f3862d9015f38764ba30002'],
            pageTitle: 'lbsApp.sysPrivilege.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sys-privilege/:id/edit',
        component: SysPrivilegePopupComponent,
        data: {
            authorities: ['402882bd5f3862d9015f38764ba30002'],
            pageTitle: 'lbsApp.sysPrivilege.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sys-privilege/:id/delete',
        component: SysPrivilegeDeletePopupComponent,
        data: {
            authorities: ['402882bd5f3862d9015f38764ba30002'],
            pageTitle: 'lbsApp.sysPrivilege.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
