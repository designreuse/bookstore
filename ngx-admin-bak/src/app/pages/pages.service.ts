import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { transform } from 'utils/maptrans.utils';
import * as iconv from 'iconv-lite';
import * as mqtt from 'mqtt';
import { isDate, isNullOrUndefined, isUndefined } from 'util';
@Injectable()
export class PagesService {
    //声明变量 订阅Observer，下面这个是一个可以实现组件之间通讯必不可少的
    private missionAnnouncedSource = new Subject<string>();
    // private missionConfirmedSource = new Subject<string>();
    missionAnnounced$ = this.missionAnnouncedSource.asObservable();
    // missionConfirmed$ = this.missionConfirmedSource.asObservable();


    //当组件或者服务中的数据有更改的时候调用这个方法即可将更改的数据推送到其他组件。
    announceMission(analyzeResult: any) {
        this.missionAnnouncedSource.next(analyzeResult);
    }

    //将年月日转为标准格式的日期字符串 ,返回结果示例 2017-01-01
    formateStrToDateStr(y, m, d) {
        let dateStr = '';
        if (!isNullOrUndefined(y)) {
            dateStr = y
        }

        if (!isNullOrUndefined(m)) {
            m++;
            dateStr += '-' + (m >= 10 ? m : '0' + m)
        }

        if (!isNullOrUndefined(d)) {
            dateStr += '-' + (d >= 10 ? d : '0' + d)
        }
        return dateStr;
    }

    //将日期类型转为标准格式的日期字符串 ,返回结果示例 2017-01-01 00:00:00
    formateDateToStr(curDate) {
        let curDateStr = '';
        if (!isNullOrUndefined(curDate) && isDate(curDate)) {
            curDateStr = this.formateStrToDateStr(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
            curDateStr += ' ' + (curDate.getHours() >= 10 ? curDate.getHours() : '0' + curDate.getHours());
            curDateStr += ':' + (curDate.getMinutes() >= 10 ? curDate.getMinutes() : '0' + curDate.getMinutes());
            curDateStr += ':' + (curDate.getSeconds() >= 10 ? curDate.getSeconds() : '0' + curDate.getSeconds());
        }
        return curDateStr;
    }
    //将日期类型转为标准格式的日期字符串 ,返回结果示例 2017-01-01
    fmtDateToStr(curDate) {
        let curDateStr = '';
        if (!isNullOrUndefined(curDate) && isDate(curDate)) {
            curDateStr = this.formateStrToDateStr(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
        }
        return curDateStr;
    }
}