import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';


@Injectable()
export class CarPositionService {
    constructor(private httpclient: HttpClient) { }

}
