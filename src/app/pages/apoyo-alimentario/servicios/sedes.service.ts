import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
import { SedeModel } from '../modelos/sede.model';

@Injectable({
  providedIn: 'root'
})
export class SedesService {

  private url = " https://apoyo-back.firebaseio.com";

  constructor(private http: HttpClient) {

  }

  getSedes(){
    return this.http.get(`${ this.url}/sedes.json`)
    .pipe(
      map( this.crearArreglo )
    );
  }

  private crearArreglo(sedesObj: object){
    const sedes: SedeModel [] = [];

    if ( sedesObj ===null) { return [];}

    Object.keys( sedesObj).forEach ( key => {
      const sede: SedeModel =sedesObj[key];
      if(sede){
      sede.id=key;
      sedes.push(sede);}
    });

    return sedes;
  }

  
}
