import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RequestManager } from '../../@core/managers/requestManager';
import { PopUpManager } from '../../@core/managers/popUpManager';
import { map } from 'rxjs/operators';



const headers = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Authorization': `Bearer ${window.localStorage.getItem('access_token')}`,
  })
}
const estudianteUrl = environment.ACADEMICA;
const infoUrl = environment.TERCEROS_CRUD_SERVICE;
const oikosUrl = environment.OIKOS_SERVICE;
const consultaFacultades = 'dependencia_tipo_dependencia?query=TipoDependenciaId.Id:2'
const consultaInfo = 'datos_identificacion/?query=TipoDocumentoId:14,Numero:';
const consultaIdentificacion = 'datos_identificacion/?query=TerceroId.Id:';
const info = 'info_complementaria_tercero/?query=TerceroId.Id:';
const grupoComplementaria = ',InfoComplementariaId.GrupoInfoComplementariaId.Id:';
const infoComplementaria = ',InfoComplementariaId.Id:'
@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  constructor(private http: HttpClient,
    private rqManager: RequestManager,
    private pUpManager: PopUpManager) { }
  getEstudiante(codigo) {
    return this.http.get(estudianteUrl + 'datos_basicos_estudiante/' + codigo, headers);
  }
  getCodigoTercero(terceroId,codIden){
    return this.http.get(infoUrl + consultaIdentificacion + terceroId + ',TipoDocumentoId.Id:'+codIden, headers);
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
  getFacultades() {
    return this.http.get(oikosUrl + consultaFacultades, headers);
  }
  getEstudiantePorUser(user) {
    this.rqManager.setPath('TERCEROS_CRUD_SERVICE');

    return this.rqManager.get(`datos_identificacion?query=TerceroId.UsuarioWSO2%3A${user}`).pipe(
      map(
        (res) => {
          if (res['Type'] === 'error') {
            this.pUpManager.showErrorAlert('No se Pudo registrar el rubro, compruebe que no exista un rubro con el mismo código o que este código sea admitido.');
            return undefined;
          }
          return res;
        },
      ),
    );
  }
  grabarSolicitud(solicitud: any) {
    this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
    return this.rqManager.post('solicitud', solicitud).pipe(
      map(
        (res) => {
          if (res['Type'] === 'error') {
            this.pUpManager.showErrorAlert('No se se pudo cargar la información.');
            return undefined;
          }
          return res;
        },
      ),
    );
  }
  grabarSolicitante(solicitante: any) {
    this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
    return this.rqManager.post('solicitante', solicitante).pipe(
      map(
        (res) => {
          if (res['Type'] === 'error') {
            this.pUpManager.showErrorAlert('No se se pudo cargar la información.');
            return undefined;
          }
          return res;
        },
      ),
    );
  }
  grabarObservacion(params) {
    this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
    return this.rqManager.post(`observacion`, params).pipe(
      map(
        (res) => {
          if (res['Type'] === 'error') {
            this.pUpManager.showErrorAlert('No se se pudo cargar la información.');
            return undefined;
          }
          return res;
        },
      ),
    );

  }

  grabarSolicitudEvolucion(params) {
    this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
    return this.rqManager.post(`solicitud_evolucion_estado`, params).pipe(
      map(
        (res) => {
          if (res['Type'] === 'error') {
            this.pUpManager.showErrorAlert('No se se pudo cargar la información.');
            return undefined;
          }
          return res;
        },
      ),
    );

  }
}
