import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { SysUserComponent } from './sys-user.component';
import { SysUserDetailComponent } from './sys-user-detail.component';
import { SysUserPopupComponent } from './sys-user-dialog.component';
import { SysUserDeletePopupComponent } from './sys-user-delete-dialog.component';

@Injectable()
export class SysUserResolvePagingParams implements Resolve<any> {

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

export const sysUserRoute: Routes = [
    {
        path: 'sys-user',
        component: SysUserComponent,
        resolve: {
            'pagingParams': SysUserResolvePagingParams
        },
        data: {
            authorities: ['402882b55ec22547015ec2273a330000'],
            pageTitle: 'lbsApp.sysUser.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'sys-user/:id',
        component: SysUserDetailComponent,
        data: {
            authorities: ['402882b55ec22547015ec2273a330000'],
            pageTitle: 'lbsApp.sysUser.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const sysUserPopupRoute: Routes = [
    {
        path: 'sys-user-new',
        component: SysUserPopupComponent,
        data: {
            authorities: ['402882b55ec22547015ec2273a330000'],
            pageTitle: 'lbsApp.sysUser.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sys-user/:id/edit',
        component: SysUserPopupComponent,
        data: {
            authorities: ['402882b55ec22547015ec2273a330000'],
            pageTitle: 'lbsApp.sysUser.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sys-user/:id/delete',
        component: SysUserDeletePopupComponent,
        data: {
            authorities: ['402882b55ec22547015ec2273a330000'],
            pageTitle: 'lbsApp.sysUser.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sys-user-role/:userId/editRole',
        component: SysUserPopupComponent,
        data: {
            authorities: ['402882b55ec22547015ec2273a330000'],
            pageTitle: 'lbsApp.sysUser.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
