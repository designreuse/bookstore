import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import * as _ from 'lodash';
// import { CarHisTrace } from '../CarHistoryLine/carhisline.model';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class CarHisLineService {
    constructor(private httpclient: HttpClient) { }

    public getCarHisLineList(carno: string, starttime: string, endtime: string): Observable<any> {
        let params = new HttpParams()
            .set('carNo', encodeURI(carno))
            .set('startTime', starttime)
            .set('endTime', endtime);

        let requestUrl = environment.INTERFACE_URL + "/api/getCarHistoryInfo";
        return this.httpclient
            .request('POST', requestUrl,
            {
                responseType: 'json', params
            }).do(console.log)
            ;
    }


    public getCarRealData(carNo: string, companyName: string): Observable<any> {
        let params = new HttpParams()
            //.set('carNo', encodeURI(carNo))
            //.set('groupName', groupName) ;
            .set('keyId', "13382564004") ;

        let requestUrl = environment.INTERFACE_URL + "/api/getCarRealData";
        return this.httpclient
            .request('POST', requestUrl,
            {
                responseType: 'json', params
            }).do(console.log)
            .map(
            data => _.values(data),
            response => {
                console.log(response.data);
            }

            );
    }


}