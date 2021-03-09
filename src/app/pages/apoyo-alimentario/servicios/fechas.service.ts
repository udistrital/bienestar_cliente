import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { FechaModel } from '../modelos/fecha.model';

@Injectable({
  providedIn: 'root'
})
export class FechasService {

  private url = " https://apoyo-back.firebaseio.com";

  constructor(private http: HttpClient) { }

  crearFecha (fecha: FechaModel){
    return this.http.post(`${ this.url}/fechas.json`, fecha)
    .pipe( map( (resp :any )=> {
      fecha.id=resp.name;
      return fecha;
    })     
    );
  }
  

  actualizar (fecha :FechaModel){
    const fechaTemp ={
      ...fecha
    };

    delete fechaTemp.id;
    return this.http.put(`${ this.url}/fechas/${ fecha.id }.json`, fechaTemp);   

  }

  borrarFecha ( id: string){
    return this.http.delete(`${ this.url}/fechas/${ id }.json`);
  }

  getFecha( id:string){
    return this.http.get(`${ this.url}/fechas/${ id }.json`);
  }

  getFechas(){
    return this.http.get(`${ this.url}/fechas.json`)
    .pipe(
      map( this.crearArreglo )
    );
  }

  private crearArreglo(fechasObj: object){
    const fechas: FechaModel [] = [];

    if ( fechasObj ===null) { return [];}

    Object.keys( fechasObj).forEach ( key => {
      const fecha: FechaModel =fechasObj[key];
      fecha.id=key;

      fechas.push(fecha);
    });

    return fechas;
  }

  fechaActual(fecha: Date){
  
    let f1 = new Date(fecha); // Fecha ingresada por el usuario
    let f2 = new Date(Date.now()); //Fecha actual

    if(f1.getFullYear() < f2.getFullYear()){
        return false;
    }
    else if(f1.getMonth() < f2.getMonth()){
        return false;
    }
    else if(f1.getDate()+1 < f2.getDate()){
      return false;
    }
    
    return true;
  }

  

}
