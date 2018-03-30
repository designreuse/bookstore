import { ElecFenceInfo } from './electronic-fence';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpRequest, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable()
export class ElectronicFenceService {
    constructor(private httpclient: HttpClient) { }

    setElecFenceInfo(elecFence: ElecFenceInfo) {
        
        let requestUrl = "http://localhost:8080/elecfence/info";
        return this.httpclient
            .post(requestUrl,elecFence,
            {   
                responseType: 'json'
            }).do(console.log)
            ;
    }

    doSearchElecFence() {
        let requestUrl = "http://localhost:8080/elecfence/info";
        return this.httpclient.get(requestUrl)
        .do(console.log);
    }

    doEditElecFence(elecFence: ElecFenceInfo) {
        let requestUrl = "http://localhost:8080/elecfence/info";
        return this.httpclient
            .put(requestUrl,elecFence,
            {   
                responseType: 'json'
            }).do(console.log)
            ;
    }
}
