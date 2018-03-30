import { RoleData } from './roleModel';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpRequest, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable()
export class RoleManagerService {
    constructor(private httpclient: HttpClient) { }

    addRoleData(roleData: RoleData) {
        const params = new HttpParams().set('role_name', roleData.ROLE_NAME)
            .set('role_desc',roleData.ROLE_DESC);

        let requestUrl = environment.INTERFACE_URL+"/api/insertRole";
        return this.httpclient
            .post(requestUrl,null,
            {   
                params: params,
                responseType: 'json'
            }).do(console.log);
    }

    searchRoles() {
        let requestUrl = environment.INTERFACE_URL+"/api/getroles";
        return this.httpclient
            .post(requestUrl,
            {   
                responseType: 'json'
            }).do(console.log);
    }

    editRoleData(roleData: RoleData) {
        const params = new HttpParams()
            .set('role_id',roleData.ROLE_ID)
            .set('role_name', roleData.ROLE_NAME)
            .set('role_desc',roleData.ROLE_DESC);

        let requestUrl = environment.INTERFACE_URL+"/api/updateRole";
        return this.httpclient
            .post(requestUrl,null,
            {   
                params: params,
                responseType: 'json'
            }).do(console.log)
            ;
    }

    deleteRoleData(role_id) {
        const params = new HttpParams().set('role_id', role_id);

        let requestUrl = environment.INTERFACE_URL+"/api/delRole";
        return this.httpclient
            .post(requestUrl,null,
            {   
                params: params,
                responseType: 'json'
            }).do(console.log)
            ;
    }

    getRoleAuth(role_id) {
        const params = new HttpParams().set('roleId', role_id);
        let requestUrl = environment.INTERFACE_URL+"/api/getrolePris";
        return this.httpclient
            .post(requestUrl,null,
            {   
                params: params,
                responseType: 'json'
            }).do(console.log);
    }

    setRoleAuth(role_id, idList) {
        const params = new HttpParams().set('role_id',role_id).set('priIdList', idList);
        let requestUrl = environment.INTERFACE_URL+"/api/setRolePri";
        return this.httpclient
            .post(requestUrl,null,
            {   
                params: params,
                responseType: 'json'
            }).do(console.log);
    }

    getAllAuth() {
        let requestUrl = environment.INTERFACE_URL+"/api/getallPris";
        return this.httpclient
            .post(requestUrl,null,
            {   
                responseType: 'json'
            }).do(console.log);
    }
}
