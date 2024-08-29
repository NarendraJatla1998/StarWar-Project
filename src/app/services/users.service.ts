import { Injectable } from "@angular/core";
import { catchError, forkJoin, map, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ApiHandler } from "./api.handler";
@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private apiHandler: ApiHandler, private http: HttpClient){

    }
 
    getAPIResponseData(endPoint: string, pageNum: number) {
        return this.apiHandler.get(`https://swapi.dev/api/${endPoint}/?page=${pageNum}`)
        .pipe(
            map((result)=>{
            if(result) {
                return result
            } else {
                return null;
            }
        })).pipe(catchError(this.errorHandler))
    }

    private errorHandler(error: any) {
        return of(error.error)
    }

    getCharacterDetails(url: any) {
      return this.apiHandler.get(url)
      .pipe(
          map((result)=>{
          if(result) {
              return result
          } else {
              return null;
          }
      })).pipe(catchError(this.errorHandler))
    }

    getResource(url: any) {
      return this.apiHandler.get(url)
        .pipe(
            map((result)=>{
            if(result) {
                return result
            } else {
                return null;
            }
        })).pipe(catchError(this.errorHandler))
    }
}
