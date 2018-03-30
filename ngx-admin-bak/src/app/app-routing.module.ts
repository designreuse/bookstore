import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import {NbLogoutComponent} from './pages/login/logout.component';
import {NbLoginComponent} from './pages/login/login.component';
import {UserRouteAccessService} from './pages/login/user/user-route-access-service';
import { Injectable }          from '@angular/core';
import { SsoNbLoginComponent } from 'app/pages/login/ssologin.component';

const routes: Routes = [ 
  {     
    path: 'pages', 
    loadChildren: 'app/pages/pages.module#PagesModule',
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [      
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'ssoLogin/:userName/:pwd/:showMenu/:url',
        component: SsoNbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: [
    UserRouteAccessService,
  ]
})
export class AppRoutingModule {
}
