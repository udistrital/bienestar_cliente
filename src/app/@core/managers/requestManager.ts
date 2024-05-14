import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorManager } from './errorManager';
/**
 * This class manage the http connections with internal REST services. Use the response format {
 *  Code: 'xxxxx',
 *  Body: 'Some Data' (this element is returned if the request is success)
 *  ...
 * }
 */
@Injectable({
  providedIn: 'root',
})
export class RequestManager {
  private path: string;
  public httpOptions: any;
  constructor(private http: HttpClient, private errManager: HttpErrorManager) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        
      }),
    };
  }


  /**
   * Use for set the source path of the service (service's name must be present at src/app/app-config.ts)
   * @param service: string
   */
  setPath(service: string) {
    this.path = environment[service];
  }


  /**
   * Perform a GET http request
   * @param endpoint service's end-point
   * @param params (a Key, Value object with que query params for the request)
   * @returns Observable<any>
   */
  get(endpoint, params?) {
    const queryParams = new HttpParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        queryParams.append(key, value + '');
      }

    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
    };
    this.httpOptions.params = queryParams;
    return this.http.get<any>(`${this.path}${endpoint}`, this.httpOptions).pipe(
      map(
        (res) => {

          if (res && res.hasOwnProperty('Body') && res['Type'] !== 'error') {
            return res['Body'];
          } else {
            return res;
          }
        },
      ),
    );
  }

  /**
   * Perform a POST http request
   * @param endpoint service's end-point
   * @param element data to send as JSON
   * @param httpOptions httpOptionsCustom
   * @returns Observable<any>
   */
  post(endpoint, element, httpOptions?) {
    return this.http.post<any>(`${this.path}${endpoint}`, element, httpOptions || this.httpOptions).pipe(
      catchError(this.errManager.handleError),
      map(
        (res) => {

          if (res && res.hasOwnProperty('Body') && res['Type'] !== 'error') {
            return res['Body'];
          } else {
            return res;
          }
        },
      ),
    );
  }

  /**
   * Perform a PUT http request
   * @param endpoint service's end-point
   * @param element data to send as JSON, With the id to UPDATE
   * @returns Observable<any>
   */
  put(endpoint, element, id) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'authorization': `Bearer ${window.localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }),
    };
    return this.http.put<any>(`${this.path}${endpoint}/${id}`, element, this.httpOptions).pipe(
      catchError(this.errManager.handleError),
    );
  }

  /**
   * Perform a PUT http request
   * @param endpoint service's end-point
   * @param element data to send as JSON, With the params to UPDATE
   * @returns Observable<any>
   */
  putParams(endpoint, element) {
    return this.http.put<any>(`${this.path}${endpoint}`, element, this.httpOptions).pipe(
      catchError(this.errManager.handleError),
    );
  }

  /**
   * Perform a DELETE http request
   * @param endpoint service's end-point
   * @param id element's id for remove
   * @returns Observable<any>
   */
  delete(endpoint, id) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'authorization': `Bearer ${window.localStorage.getItem('access_token')}`,
      }),
    };
    return this.http.delete<any>(`${this.path}${endpoint}/${id}`, this.httpOptions).pipe(
      catchError(this.errManager.handleError),
    );
  }
}
