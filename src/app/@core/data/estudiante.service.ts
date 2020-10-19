import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';

import { Estudiante } from './../data/models/estudiante'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  bearer: { headers: HttpHeaders; };
  URL = 'https://autenticacion.portaloas.udistrital.edu.co/apioas/academica_jbpm/v1/estudiantes_matriculados/2020/3';

  constructor(private http: HttpClient) {
    this.bearer = {
      headers: new HttpHeaders({
          'Accept': 'application/json',
          'authorization': 'Bearer ' + window.localStorage.getItem('access_token'),
      }),
    }
  }

  obtenerEstudiantes(): Observable<Estudiante[]>{
    // Consulta un servicio que retorna un xml <estudiantes><estudiante /></estudiantes>
    return this.http.get(this.URL, this.bearer)
    .map((response: Response) => {
      return response['estudiantes']['estudiante'] as Estudiante[];
    })
  }

}
