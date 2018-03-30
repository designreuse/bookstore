import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { environment } from 'environments/environment';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { NbSearchService } from "@nebular/theme";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position: string = 'normal';

  items: MenuItem[];
  user: any;
  //userMenu = [{ title: 'Profile' }, { title: 'Log out' }];
  userMenu = [{ title: '注销', url: '#/auth/logout' }];
  companyName: string;
  showMenu = true;
  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private userService: UserService,
    private analyticsService: AnalyticsService,
    private $sessionStorage: SessionStorageService,
    private searchService: NbSearchService,
    protected router: Router,
    private http: Http,
    private httpclient: HttpClient, ) {
  }

  ngOnInit() {
    this.items = [
      {
        icon: 'fa-home',
        routerLink: '/pages/dashboard',
      },
      {
        label: '车辆信息',
        items: [
          { label: '地图监控', routerLink: '/pages/maps/CarPosition/' + 'jshx123456JSHX' },
          { label: '车辆轨迹', routerLink: '/pages/maps/CarHisLine' }
        ]
      },
      {
        label: '统计报表',
        items: [
          { label: '主动安全报警', routerLink: '/pages/charts/alarm-deal' },
          { label: '主动安全报警统计', routerLink: '/pages/charts/alarm-trend-chart' },
          { label: '驾驶员评分表', routerLink: '/pages/charts/driver-score' },
          { label: '报警查询日志', routerLink: '/pages/charts/alarm-query' },
          { label: '历史升级记录查询报表', routerLink: '/pages/charts/upgrade-record' },
          { label: '驾驶员异常处理报表', routerLink: '/pages/charts/driver-anormity' },
          { label: '监控视频', routerLink: '/pages/charts/lbs-video' },
        ]
      }, {
        label: '系统维护',
        items: [
          { label: '终端在线升级', routerLink: '/pages/charts/sys-up' }
        ]
      },

    ];

    const ifShow = this.$sessionStorage.retrieve('hideMenu');
    if (ifShow !== undefined && ifShow !== null && ifShow == 'h') {
      this.showMenu = false;
    }
    // this.companyName = this.$sessionStorage.retrieve('companyName');
    // document.getElementsByTagName('title')[0].innerHTML = this.companyName;
    // if (this.companyName == null) {
      const params = new HttpParams();
      this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getCompanyInfoByUser',
        {
          responseType: 'json', params,
        }).subscribe((data: any) => {
          this.companyName = data.COMPANY_FULLNAME;
          document.getElementsByTagName('title')[0].innerHTML = this.companyName;
          this.$sessionStorage.store("companyName", data.COMPANY_FULLNAME);
        });
    // }
    const userName = this.$sessionStorage.retrieve('userName');
    this.user = { name: userName, picture: 'assets/images/kitten-cosmic.png' };
    // this.userService.getUsers()
    //   .subscribe((users: any) => this.user = users.nick);
    this.searchService.onSearchSubmit().subscribe((data: { term: string, tag: string }) => {
      console.info(`term: ${data.term}, from search: ${data.tag}`);
      const singleCarNo = data.term;
      if (singleCarNo != null && singleCarNo != '') {
        const redirect = '/pages/maps/CarPosition';
        if (redirect) {
          return this.router.navigateByUrl('/pages/maps/CarPosition/' + singleCarNo);
        }
        // const redirect = '/pages/maps/CarPosition';
        // if (redirect) 
        // {
        //   return this.router.navigateByUrl(redirect);
        // }
      }
    });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
    this.$sessionStorage.clear('searchCarNo');
  }

  // this.searchService.onSearchSubmit().subscribe((data: { term: string, tag: string }) => {
  //   console.info(`term: ${data.term}, from search: ${data.tag}`);
  // });
}
