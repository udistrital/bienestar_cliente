import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { PeriodoModel } from '../modelos/perido.model';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PeriodosService {
  private url = "http://localhost:8080"; /* variable de entorno */

  constructor(private http: HttpClient) { }

  crearPeriodo(periodo: PeriodoModel) {
    /* return this.http.post(`${ this.url}/periodos.json`, periodo)
    .pipe( map( (resp :any )=> {
      periodo.id=resp.name;
      return periodo;
    })     
    ); */
    return this.http.post("http://localhost:8080/periodo", periodo);

  }
  actualizar(periodo: PeriodoModel) {
    const periodoTemp = {
      ...periodo
    };
    return this.http.put("http://localhost:8080/periodo/edit", periodoTemp);

  }
  borrarPeriodo(id: string) {
    return this.http.delete(`http://localhost:8080/periodo?id=${id}`);
  }
  getPeriodo(id: string) {
    /* return this.http.get(`${ this.url}/periodos/${ id }.json`); */
    return this.http.get(`http://localhost:8080/periodo?id=${id}`);
  }
  getPeriodoNuevo() {
    return this.http.get("http://localhost:8080/periodos")
      .pipe(
        map(this.seleccionarPeriodoNuevo)
      );
  }




  getPeriodos() {
    /* return this.http.get(`${ this.url}/periodos.json`)
    .pipe(
      map( this.crearArreglo )
    ); */
    return this.http.get("http://localhost:8080/periodos")
      .pipe(
        map(this.crearArreglo)
      );
  }

  private crearArreglo(periodosObj: object) {
    if (periodosObj === null) { return []; }

    const periodos: PeriodoModel[] = [];

    Object.keys(periodosObj).forEach(key => {
      const periodo: PeriodoModel = periodosObj[key];
      periodos.push(periodo);
    });

    return periodos;
  }

  private seleccionarPeriodoNuevo(periodosObj: object): PeriodoModel {
    var periodoR: PeriodoModel;
    if (periodosObj === null) { return null; }
    Object.keys(periodosObj).forEach(key => {
      const periodo: PeriodoModel = periodosObj[key];
      if (periodo.estado === "nuevo") {
        periodoR = periodo;
      }
    });
    return periodoR;
  }
}
