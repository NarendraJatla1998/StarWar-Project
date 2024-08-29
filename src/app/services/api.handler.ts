import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ApiHandler {
    constructor(private http: HttpClient){}
    requestOptions: Object = {
        responseType: 'text'
    }

    public get<T>(path: string, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders()): Observable<T>{
        return this.http.get<T>(path);
    }
}