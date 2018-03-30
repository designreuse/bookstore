/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {APP_BASE_HREF} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {CoreModule} from './@core/core.module';
import {DialogModule} from 'primeng/primeng';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ThemeModule} from './@theme/theme.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NB_AUTH_TOKEN_WRAPPER_TOKEN, NbAuthJWTToken} from '@nebular/auth';
import {NbLoginComponent} from './pages/login/login.component';
import {NbLogoutComponent} from './pages/login/logout.component';
import {NbEmailPassAuthProvider} from './pages/login/email-pass-auth.provider';
import {NbAuthModule} from '@nebular/auth/auth.module';
import {AuthServerProvider} from './pages/login/user/auth-jwt.service';
import {Principal} from './pages/login/user/principal.service';
import {AccountService} from './pages/login/user/account.service';
import {LocalStorageService} from 'ng2-webstorage/dist/app';
import {SessionStorageService} from 'ng2-webstorage/dist/services';
import {NbAuthJWTInterceptor} from 'app/pages/login/user/jwt-interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {UserRouteAccessService} from 'app/pages/login/user/user-route-access-service';
import {StateStorageService} from 'app/pages/login/user/state-storage.service';
import {CarHisLineService} from 'app/pages/carmap/CarHistoryLine/carhisline.service';
import {CarPositionService} from 'app/pages/carmap/CarPosition/carposition.service';
import {PagesService} from 'app/pages/pages.service';
// import { HasAnyAuthorityDirective } from './@core/utils/has-any-authority.directive';
import {AlarmDealService} from 'app/pages/adas/alarmdealtable/alarmdealtable.service';
import {SsoNbLoginComponent} from 'app/pages/login/ssologin.component';

@NgModule({
  declarations: [AppComponent,
    // HasAnyAuthorityDirective,
    NbLoginComponent,
    NbLogoutComponent,
    SsoNbLoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    NbAuthModule.forRoot({
      forms: {
        login: {
          redirectDelay: 3000,
        },
      },
      providers: {
        //
        // email: {
        //   service: NbDummyAuthProvider,
        //   config: {
        //     alwaysFail: true,
        //     delay: 1000,
        //   },
        // },
        email: {
          service: NbEmailPassAuthProvider,
          config: {
            login: {
              endpoint: 'http://localhost:4400/api/authenticate',
            },
            register: {
              endpoint: 'http://localhost:4400/api/auth/register',
            },
            logout: {
              endpoint: 'http://localhost:4400/api/auth/logout',
              redirect: {
                success: '/auth/login',
                failure: '/auth/login',
              },
            },
            requestPass: {
              endpoint: 'http://localhost:4400/api/auth/request-pass',
              redirect: {
                success: '/auth/reset-password',
              },
            },
            resetPass: {
              endpoint: 'http://localhost:4400/api/auth/reset-pass',
              redirect: {
                success: '/auth/login',
              },
            },
          },
        },
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: NB_AUTH_TOKEN_WRAPPER_TOKEN, useClass: NbAuthJWTToken},
    Principal,
    NbEmailPassAuthProvider,
    AuthServerProvider,
    AccountService,
    LocalStorageService,
    SessionStorageService,
    {provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true},
    UserRouteAccessService,
    StateStorageService,
    CarHisLineService,
    CarPositionService,
    PagesService,
    AlarmDealService,
  ],
  exports: [
    // HasAnyAuthorityDirective,
    NbLoginComponent,
    SsoNbLoginComponent,
  ],
})
export class AppModule {
}
