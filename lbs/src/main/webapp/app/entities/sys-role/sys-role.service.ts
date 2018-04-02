import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { SysRole } from './sys-role.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class SysRoleService {

    private resourceUrl = 'api/sys-roles';

    constructor(private http: Http) { }

    create(sysRole: SysRole): Observable<SysRole> {
        const copy = this.convert(sysRole);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(sysRole: SysRole): Observable<SysRole> {
        const copy = this.convert(sysRole);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<SysRole> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
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

    updateRolePrivilege(roleId: string, privilegeId: string):  Observable<ResponseWrapper> {
        return this.http.post('api/sys-roles/updateRolePrivilege', '', {
            params:{'privilegeId': privilegeId ,'roleId': roleId}
        })
    }

    deleteRolePrivilege(roleId: string, privilegeId: string):  Observable<ResponseWrapper> {
        return this.http.post('api/sys-roles/deleteRolePrivilege', '', {
            params:{'roleId': roleId ,'privilegeId': privilegeId}
        })
    }

    findRolePrivilege(roleId: string):  Observable<ResponseWrapper> {
        return this.http.post('api/sys-roles/findRolePrivilegeName', '', {
            params:{'roleId': roleId }
        })
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(sysRole: SysRole): SysRole {
        const copy: SysRole = Object.assign({}, sysRole);
        return copy;
    }
}
