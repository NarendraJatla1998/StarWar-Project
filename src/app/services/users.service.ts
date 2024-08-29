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

    searchPeople(term: string): Observable<any[]> {
        return this.http.get<any>(`https://swapi.dev/api/people/?search=${term}`).pipe(
          map(response => response.results)
        );
      }
    
      // Method to search for multiple terms and combine results
      searchMultipleTerms(terms: string[]): Observable<any[]> {
        // Create an array of observables for each search term
        const searchRequests = terms.map(term => this.searchPeople(term));
    
        // Use forkJoin to wait for all requests to complete
        return forkJoin(searchRequests).pipe(
          map((resultsArray: any) => {
            // Flatten the results array
            return [].concat(...resultsArray);
          })
        );
      }
  //   private baseUrl = 'https://swapi.dev/api';

  // constructor(private http: HttpClient) {}

  // getPeople(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/people`);
  // }

  // getFilms(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/films`);
  // }
}
