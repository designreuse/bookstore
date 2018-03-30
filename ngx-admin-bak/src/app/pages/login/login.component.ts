/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS_TOKEN } from '@nebular/auth/auth.options';
import { getDeepFromObject } from '@nebular/auth/helpers';
import { NbAuthResult, NbAuthService } from '@nebular/auth/services/auth.service';
import { OnInit } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { Principal } from './user/principal.service';
import { AuthServerProvider } from './user/auth-jwt.service';

// import 'node';
// import 'stream';
// import * as iconv from 'iconv-lite';

@Component({
  selector: 'nb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class NbLoginComponent implements OnInit {

  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  account: Account;

  config: any = {
    forms: {
      login: {
        redirectDelay: 500,
        provider: 'email',
        rememberMe: true,
        showMessages: {
          success: true,
          error: true,
        },
      },
      register: {
        redirectDelay: 500,
        provider: 'email',
        showMessages: {
          success: true,
          error: true,
        },
        terms: true,
      },
      requestPassword: {
        redirectDelay: 500,
        provider: 'email',
        showMessages: {
          success: true,
          error: true,
        },
      },
      resetPassword: {
        redirectDelay: 500,
        provider: 'email',
        showMessages: {
          success: true,
          error: true,
        },
      },
      logout: {
        redirectDelay: 500,
        provider: 'email',
      },
      validation: {
        password: {
          required: true,
          minLength: 4,
          maxLength: 50,
        },
        email: {
          required: true,
        },
        fullName: {
          required: false,
          minLength: 4,
          maxLength: 50,
        },
      },
    },
  };

  constructor(protected service: NbAuthService,
    private principal: Principal,
    private authService: AuthServerProvider,
    protected router: Router,
    private $sessionStorage: SessionStorageService,
    private $localStorage: LocalStorageService) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');
  }

  ngOnInit() {
    this.$sessionStorage.clear('authenticationToken');
    this.$localStorage.clear('authenticationToken');
    //记住密码
    const loginInfo = this.$localStorage.retrieve("autoLogin");
    let Base64 = require('js-base64').Base64;
    if (loginInfo != null&&loginInfo.length > 0) {
        this.user.email = loginInfo[0];
        this.user.password = Base64.decode(loginInfo[1]);
        this.user.rememberMe = true;
    }

  }

  login(): void {

    this.errors = this.messages = [];
    this.submitted = true;

    //控制单点登录时是否显示左侧菜单栏
    this.$sessionStorage.clear("hideMenu");
    this.$localStorage.clear("hideMenu");

    this.service.authenticate(this.provider, this.user).subscribe((result: NbAuthResult) => {

      this.submitted = false;

      if (result.isSuccess()) {
        const bearerToken = result.getResponse().body.id_token;
        this.authService.storeAuthenticationToken(bearerToken, this.user.rememberMe);
        this.messages = result.getMessages();

        // 存储用户权限信息
        this.principal.identity().then((account) => {
          this.account = account;
        });
        //记住密码
        let Base64 = require('js-base64').Base64;
        if (this.user.rememberMe == true) {
          const loginArray = new Array();
          loginArray.push(this.user.email);
          loginArray.push(Base64.encode(this.user.password));
          this.$localStorage.clear("autoLogin");
          this.$localStorage.store("autoLogin", loginArray);
        } else {
          const isRemembered = this.$localStorage.retrieve('autoLogin');
          if (isRemembered != null) {
            if (isRemembered[0] == this.user.email) {
              this.$localStorage.clear("autoLogin");
            }

          }
        }
      } else {
        this.errors = result.getErrors();
      }

      const redirect = '/pages/dashboard'; // result.getRedirect();
      if (redirect) {
        return this.router.navigateByUrl(redirect);
        // this.router.navigate(['/pages/dashboard']);

        // setTimeout(() => {
        //   return this.router.navigateByUrl(redirect);
        // }, this.redirectDelay);
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
