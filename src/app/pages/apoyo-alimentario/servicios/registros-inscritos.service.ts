import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { RegistroInscritoModel } from '../modelos/registroInscrito.model';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RegistrosInscritosService {
  private url = " https://apoyo-back.firebaseio.com";
  constructor(private http: HttpClient) { }

  crearRegistro (registro: RegistroInscritoModel){
    return this.http.post(`${ this.url}/registrosInscritos.json`, registro)
    .pipe( map( (resp :any )=> {
      registro.id=resp.name;
      return registro;
    })     
    );
  }


}
