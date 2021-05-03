import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';



const headers = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Authorization': `Bearer ${window.localStorage.getItem('access_token')}`,
  })
}
const estudianteUrl = environment.ACADEMICA_JBPM_SERVICE;
const infoUrl = environment.TERCEROS_CRUD_SERVICE;
const consultaInfo = 'datos_identificacion/?query=TipoDocumentoId:14,Numero:';
const info = 'info_complementaria_tercero/?query=TerceroId.Id:';
const grupoComplementaria = ',InfoComplementariaId.GrupoInfoComplementariaId.Id:';
const infoComplementaria = ',InfoComplementariaId.Id:'
@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  constructor(private http: HttpClient) { }
  getEstudiante(codigo) {
    return this.http.get(estudianteUrl + 'datos_basicos_estudiante/' + codigo, headers);
  }
  getProyecto(codigop) {
    return this.http.get(estudianteUrl + 'carrera/' + codigop, headers);
  }
  getInfoPorCodigo(codigo) {
    return this.http.get(infoUrl + consultaInfo + codigo, headers);
  }
  getInfoGrupoComplementaria(terceroId, Id) {
    return this.http.get(infoUrl + info + terceroId + grupoComplementaria + Id, headers);
  }
  getInfoComplementaria(terceroId, Id) {
    return this.http.get(infoUrl + info + terceroId + infoComplementaria + Id, headers);
  }
}
