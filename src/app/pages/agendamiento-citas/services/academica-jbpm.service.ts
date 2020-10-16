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

const path = environment.ACADEMICA_JBPM_SERVICE;

@Injectable({
  providedIn: 'root'
})
export class AcademicaJbpmService {

  constructor(private http: HttpClient) { }

  get(endpoint) {
    return this.http.get(path + endpoint, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  getDatosBasicosEstudiante(codigoEstudiante) {
    return this.http.get(path + 'datos_basicos_estudiante/' + codigoEstudiante, httpOptions)
    .pipe(
      catchError(this.handleError),
    );
  }

  getCarrera(codCarrera) {
    return this.http.get(path + 'carrera/' + codCarrera, httpOptions)
    .pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError({
      status: error.status,
      message: 'Something bad happened; please try again later.',
    });
  }
}
