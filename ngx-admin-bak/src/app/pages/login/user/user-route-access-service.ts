import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { StateStorageService } from './state-storage.service';
import {Principal} from './principal.service';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import {AuthServerProvider} from 'app/pages/login/user/auth-jwt.service';

@Injectable()
export class UserRouteAccessService implements CanActivate {

    constructor(private router: Router,
                private principal: Principal,
                private $sessionStorage: SessionStorageService,
                private stateStorageService: StateStorageService,
                private authServerProvider: AuthServerProvider,
                private $localStorage: LocalStorageService,) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        
        // const isLogin = this.principal.isIdentityResolved;
        const authorities = route.data['authorities'];
        const logedWithoutRemember = this.$sessionStorage.retrieve('authenticationToken');
        const logedWithRemember = this.$localStorage.retrieve('authenticationToken');

        
        //判断有没有登录
   
        if((logedWithoutRemember != '' && logedWithoutRemember != null && logedWithoutRemember != undefined) || 
        (logedWithRemember != '' && logedWithRemember != null && logedWithRemember != undefined))
        {
            return true;
        }
        else{
            this.router.navigate(['/login']);
        }

        if (!authorities || authorities.length === 0) {
            
            return true;
        }

        return this.checkLogin(authorities, state.url);
    }

    checkLogin(authorities: string[], url: string): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(principal.identity().then((account) => {

            if (account && principal.hasAnyAuthorityDirect(authorities)) {
                return true;
            }

            this.stateStorageService.storeUrl(url);
            // this.router.navigate(['accessdenied']).then(() => {
            //     // only show the login dialog, if the user hasn't logged in yet
            //     if (!account) {
            //         // this.loginModalService.open();
            //     }
            //     this.router.navigateByUrl('http://localhost:4200/#/auth/login');
            // });
            this.router.navigate(['/login']);
            return false;
        }));
    }
}
