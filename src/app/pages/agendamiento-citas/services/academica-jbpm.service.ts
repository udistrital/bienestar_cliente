import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'authorization': `Bearer ${window.localStorage.getItem('access_token')}`,
  }),
};

const path = environment.CONF_MENU_SERVICE;

@Injectable({
  providedIn: 'root'
})
export class AcademicaJbpmService {

  constructor(private http: HttpClient) { }
}
