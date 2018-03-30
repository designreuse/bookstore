
import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NB_AUTH_OPTIONS_TOKEN } from '@nebular/auth/auth.options';
import { getDeepFromObject } from '@nebular/auth/helpers';

import { NbAuthResult, NbAuthService } from '@nebular/auth/services/auth.service';
import { Principal } from './user/principal.service';
import { AuthServerProvider } from './user/auth-jwt.service';
import { OnInit } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'ssonb-login',
  template: `<span>页面跳转中...</span>`,
})
export class SsoNbLoginComponent implements OnInit {


  private carListData = [];
  private carTreeData = [];

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
    private $localStorage: LocalStorageService,
    private activeRoute: ActivatedRoute,
    private httpclient: HttpClient) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');
    this.carListData = new Array();
    this.carTreeData = new Array();
  }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params: ParamMap) => {
      const userName = params.get('userName');
      const pwd = params.get('pwd');
      const urlType = params.get('url');
      const ifshowMenu = params.get('showMenu');
      const jwtToken = this.$localStorage.retrieve('authenticationToken') ||
      this.$sessionStorage.retrieve('authenticationToken');
      let Base64 = require('js-base64').Base64;
      // if (isNullOrUndefined(jwtToken)) {
        this.$sessionStorage.clear('authenticationToken');
        this.$localStorage.clear('authenticationToken');
        //单点登录第一次登录时请求后台获取数据
        if (!isNullOrUndefined(userName) && !isNullOrUndefined(pwd)) {
          const email = Base64.decode(userName);
          const password = Base64.decode(pwd);
          const user = { email: email, password: password, rememberMe: false };
          this.service.authenticate(this.provider, user).subscribe((result: NbAuthResult) => {
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

            const params = new HttpParams();

            this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getTreeArrayData',
              {
                responseType: 'json', params,
              })
              .subscribe((data: any) => {
                this.carListData = data;
                for (let i = 0; i < data.length; i++) {
                  if (data[i].pId == 0) {
                    this.carListData[i]["expand"] = true;
                    break;
                  }
                }
                // this.$sessionStorage.store('carListData', this.carListData);

                //转换树的数据
                this.carTreeData = this.transformtoTree(this.carListData);
                this.$sessionStorage.store('carTreeData', this.carTreeData);
                this.$localStorage.store('carTreeData', this.carTreeData);

                //控制单点登录时是否显示左侧菜单栏
                this.$sessionStorage.store("hideMenu", ifshowMenu);
                this.$localStorage.store("hideMenu", ifshowMenu);

                let redirect = '/pages/dashboard';
                if (urlType !== undefined && urlType !== null) {
                  redirect = Base64.decode(urlType);
                }

                if (redirect) {
                  return this.router.navigateByUrl(redirect);
                }
              });

          });
        }
      // } else {
      //   //控制单点登录时是否显示左侧菜单栏
      //   this.$sessionStorage.store("hideMenu", ifshowMenu);
      //   this.$localStorage.store("hideMenu", ifshowMenu);

      //   //已经登录过的情况下直接跳转到对应页面
      //   let redirect = '/pages/dashboard';
      //   if (urlType !== undefined && urlType !== null) {
      //     redirect = Base64.decode(urlType);
      //   }

      //   if (redirect) {
      //     return this.router.navigateByUrl(redirect);
      //   }
      // }

    });



    //记住密码
    const loginInfo = this.$localStorage.retrieve("autoLogin");
    let Base64 = require('js-base64').Base64;
    if (loginInfo != null) {
      if (loginInfo.length > 0) {
        this.user.email = loginInfo[0];
        this.user.password = Base64.decode(loginInfo[1]);

        this.user.rememberMe = true;
      }
    }
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }

  private transformtoTree(data: any) {
    let i, l;
    const key = 'id', childKey = 'children';
    const parentKey = 'pId';
    if (!key || !data) return [];

    if (this.isArray(data)) {
      const r = [];
      const tmpMap = [];
      for (i = 0, l = data.length; i < l; i++) {
        if (!data[i]['checked'])
          data[i]['checked'] = false;
        tmpMap[data[i][key]] = data[i];
      }

      for (i = 0, l = data.length; i < l; i++) {
        if (tmpMap[data[i][parentKey]] && data[i][key] != data[i][parentKey]) {
          if (!tmpMap[data[i][parentKey]][childKey])
            tmpMap[data[i][parentKey]][childKey] = [];
          tmpMap[data[i][parentKey]][childKey].push(data[i]);
        } else {
          r.push(data[i]);
        }
      }
      return r;
    } else {
      return [data];
    }
  }

  isArray(arr: any) {
    return Object.prototype.toString.apply(arr) === '[object Array]';
  }

}
