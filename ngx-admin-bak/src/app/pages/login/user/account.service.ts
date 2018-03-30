import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class AccountService  {
    constructor(private http: Http, private httpclient: HttpClient) { }

    get(): Observable<any> {
        return this.httpclient.request('get', environment.INTERFACE_URL + '/api/account');
        // .map((res: Response) => res.json());
        // this.http.get('http://localhost:18500/api/account').map((res: Response) => res.json());
    }

    save(account: any): Observable<Response> {
        return this.http.post(environment.INTERFACE_URL + '/api/account', account);
    }
}
