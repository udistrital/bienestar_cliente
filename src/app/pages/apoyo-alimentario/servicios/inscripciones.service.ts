import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { PeriodoModel } from '../modelos/perido.model';
import { map } from 'rxjs/operators'
import { InscripcionModel } from '../modelos/inscripcion.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {

  private url = " https://apoyo-back.firebaseio.com";

  constructor( private http: HttpClient ) { }

  subirInscripciones(inscripciones: File, periodo: PeriodoModel) {
    const formData: FormData = new FormData();
    formData.append( 'inscripciones', new Blob([inscripciones], { type: 'text/csv' }), inscripciones.name);

    return this.http.post(`http://localhost:8080/subirInscripciones?id=${periodo.id}`, formData);
    
  }


}
