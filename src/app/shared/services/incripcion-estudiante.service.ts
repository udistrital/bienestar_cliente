import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.dev';

const api = environment.TERCEROS_CRUD_SERVICE;
const baseInfoComplementaria = `${api}info_complementaria?query=GrupoInfoComplementariaId%3A`

@Injectable({
  providedIn: 'root'
})
export class IncripcionEstudianteService {

  constructor(private httpClient: HttpClient) {
   }


  obtenerGrupoInfoComplementaria(query: any): Observable<any>{
    return this.httpClient.get(`${baseInfoComplementaria}${query}`);
  }
}
