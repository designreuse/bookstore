import { Injectable } from '@angular/core';
import {Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { SysUser } from './sys-user.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class SysUserService {

    private resourceUrl = 'api/sys-users';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(sysUser: SysUser): Observable<SysUser> {
        const copy = this.convert(sysUser);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(sysUser: SysUser): Observable<SysUser> {
        const copy = this.convert(sysUser);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<SysUser> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    updateUserRole(userId: string , roleId: string):  Observable<ResponseWrapper> {
        return this.http.post('api/sys-users/updateUserRole', '', {
            params:{'userId': userId ,'roleId': roleId}
        })
    }

    deleteUserRole(userId: string , roleId: string):  Observable<ResponseWrapper> {
        return this.http.post('api/sys-users/deleteUserRole', '', {
            params:{'userId': userId ,'roleId': roleId}
        })
    }
    findUserRole(userId: string):  Observable<ResponseWrapper> {
        return this.http.post('api/sys-users/findUserRoleName', '', {
            params:{'userId': userId }
        })
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.lastlogindate = this.dateUtils
            .convertLocalDateFromServer(entity.lastlogindate);
        entity.createdon = this.dateUtils
            .convertLocalDateFromServer(entity.createdon);
        entity.modifedon = this.dateUtils
            .convertLocalDateFromServer(entity.modifedon);
        entity.modifiedon = this.dateUtils
            .convertLocalDateFromServer(entity.modifiedon);
    }

    private convert(sysUser: SysUser): SysUser {
        const copy: SysUser = Object.assign({}, sysUser);
        copy.lastlogindate = this.dateUtils
            .convertLocalDateToServer(sysUser.lastlogindate);
        copy.createdon = this.dateUtils
            .convertLocalDateToServer(sysUser.createdon);
        copy.modifedon = this.dateUtils
            .convertLocalDateToServer(sysUser.modifedon);
        copy.modifiedon = this.dateUtils
            .convertLocalDateToServer(sysUser.modifiedon);
        return copy;
    }
}
