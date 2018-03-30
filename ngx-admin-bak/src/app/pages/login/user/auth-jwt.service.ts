import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { environment } from 'environments/environment';
@Injectable()
export class AuthServerProvider {
    constructor(
        private http: Http,
        private $localStorage: LocalStorageService,
        private $sessionStorage: SessionStorageService,
    ) {}

    getToken() {
        return this.$localStorage.retrieve(
          'authenticationToken') || this.$sessionStorage.retrieve('authenticationToken');
    }

    login(credentials) {

        const data = {
            username: credentials.username,
            password: credentials.password,
            rememberMe: credentials.rememberMe,
        };

        this.http.post(environment.INTERFACE_URL + '/api/authenticate', data).map(
            (res: Response) => res.json()).toPromise().then((resp) => {
                const bearerToken = resp.id_token; // resp.headers.get('Authorization');
                this.storeAuthenticationToken(bearerToken, credentials.rememberMe);
                if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
                    const jwt = bearerToken.slice(7, bearerToken.length);
                    this.storeAuthenticationToken(jwt, credentials.rememberMe);
                    return jwt;
                }
            });

        //  return this.http.post('http://localhost:18500/api/authenticate', data).map(authenticateSuccess.bind(this));

        // function authenticateSuccess(resp) {
        //     const bearerToken = resp.headers.get('Authorization');
        //     if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        //         const jwt = bearerToken.slice(7, bearerToken.length);
        //         this.storeAuthenticationToken(jwt, credentials.rememberMe);
        //         return jwt;
        //     }
        // }
    }

    loginWithToken(jwt, rememberMe) {
        if (jwt) {
            this.storeAuthenticationToken(jwt, rememberMe);
            return Promise.resolve(jwt);
        } else {
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    }

    storeAuthenticationToken(jwt, rememberMe) {
        // if (rememberMe) {
            this.$localStorage.store('authenticationToken', jwt);
        // } else {
            this.$sessionStorage.store('authenticationToken', jwt);
        // }
    }

    logout(): Observable<any> {
        return new Observable((observer) => {
            this.$localStorage.clear('authenticationToken');
            this.$sessionStorage.clear('authenticationToken');
            observer.complete();
        });
    }
}
