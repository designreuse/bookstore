import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AlarmData, AlarmType } from './alarmModel';
// import { CarterminalComponent } from 'app/pages/baseinfomanage/carterminal/carterminal.component';

@Injectable()
export class AlarmDealService {
    constructor(private httpclient: HttpClient) { }

    getAlarmType(): Promise<any> {
        return this.httpclient.request('POST', environment.INTERFACE_URL + '/api/getAlarmType',
            {
                responseType: 'json',
            })
            .toPromise();
    };

    getAlarmData(carNo: string, alarmType: string, groupIdList: any[], keyIdList: any[], driverName: string, alarmLevel: string, alarmTreat: string, startTime: string, endTime: string): Promise<any> {
        let url = environment.INTERFACE_URL + '/api/getAlarmInfo';

        let params = new HttpParams().set('carNo', encodeURI(carNo))
            .set('keyIdList', keyIdList.join(','))
            .set('alarmType', alarmType)
            .set('groupIdList', groupIdList.join(','))
            .set('driverName', driverName)
            .set('alarmLevel', alarmLevel)
            .set('alarmTreat', alarmTreat)
            .set('startTime', startTime)
            .set('endTime', endTime);

        return this.httpclient.request('POST', url, { responseType: 'json', params })
            .toPromise();

    }


    // saveAlarmDealInfo(info: AlarmData): Observable<AlarmData> {
    saveAlarmDealInfo(info: AlarmData): Observable<Object> {
        let url = environment.INTERFACE_URL + '/api/dealAlarmInfo';
        let params = new HttpParams().set('id',info.ID)
            .set('alarmType', info.ALARM_TYPE + '')
            .set('alarmDate', info.ALARMDATE + '')
            .set('alarminfoLatitude', info.ALARMINFO_LATITUDE + '')
            .set('alarminfoLongitude', info.ALARMINFO_LONGITUDE + '')
            .set('alarmSpeed', info.ALARM_SPEED + '')
            .set('alarmName', info.alarmName + '')
            .set('alarmTreat', info.ALARM_TREAT + '')
            .set('alarmTreatContent', info.ALARM_TREATCONTENT + '')
            .set('keyId', info.KEY_ID + '')
            .set('alarmDesc', info.ALARM_DESC + '')
            .set('alarmEndDate', info.ALARM_ENDDATE + '')
            .set('treatPerson', info.TREAT_PERSON + '');
        return this.httpclient.request('POST', url, { responseType: 'json', params });
    }

    getAlarmDataById(id: any): Promise<any> {
        let url = environment.INTERFACE_URL + '/api/getAlarmTreatInfoById';
        let params = new HttpParams()
            .set('id', id)
        return this.httpclient.request('POST', url, { responseType: 'json', params })
            .toPromise();

    }
}