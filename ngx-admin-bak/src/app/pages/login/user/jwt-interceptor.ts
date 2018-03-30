import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { LocalStorageService } from 'ng2-webstorage/dist/app';
import { SessionStorageService } from 'ng2-webstorage/dist/services';

@Injectable()
export class NbAuthJWTInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = this.localStorage.retrieve('authenticationToken') ||
    this.sessionStorage.retrieve('authenticationToken');
    // req.headers.append('Authorization', 'Bearer ' + jwtToken);
    // req = req.clone({
    //   setHeaders: {
    //     Authorization: 'Bearer ' + jwtToken,
    //   },
    // });
    const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)});
    return next.handle(authReq);

    // return this.authService.getToken()
    //   .switchMap((token: NbAuthJWTToken) => {
    //     if (token) {
    //       const JWT = `Bearer ${token.getValue()}`;
    //       req = req.clone({
    //         setHeaders: {
    //           Authorization: JWT,
    //         },
    //       });
    //     }
    //     return next.handle(req);
    //   });
  }

  // protected get authService(): NbAuthService {
  //   return this.injector.get(NbAuthService);
  // }
}
