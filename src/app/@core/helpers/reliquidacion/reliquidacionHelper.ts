import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';
import { ApiConstanst } from '../../../shared/constants/api.constans';
import { UtilsService } from '../../../shared/services/utils.service';

const infoComplementaria = 'info_complementaria';
const baseInfoComplementaria = 'info_complementaria?query=GrupoInfoComplementariaId%3A';

@Injectable({
    providedIn: 'root',
})
export class ReliquidacionHelper {



    constructor(private rqManager: RequestManager,
        private pUpManager: PopUpManager) {
    }

    /**
     * Gets estudiante
     *  returns one user level at once.
     * @param [user] user to request info from the API
     * @returns  branch information.
     */
    public getEstudiante(user) {
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


    /**
     * Gets estudiante
     *  returns one user level at once.
     * @param [user] user to request info from the API
     * @returns  branch information.
     */
    async getEstudianteAsync(user): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getEstudiante(user).subscribe((res) => {
                resolve(res);
            })
        });
    }

    /**
     * Gets estudiante
     *  returns one user level at once.
     * @param [user] user to request info from the API
     * @returns  branch information.
     */
    obtenerGrupoInfoComplementaria(query: any): any {
        this.rqManager.setPath('TERCEROS_CRUD_SERVICE');
        return this.rqManager.get(`${baseInfoComplementaria}${query}`).pipe(
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

    /**
     * Gets INFO COMPLEMENTARIA
     *  returns one user level at once.
     */
    obtenerInfoComplementaria(id: any): any {
        this.rqManager.setPath('TERCEROS_CRUD_SERVICE');
        return this.rqManager.get(`${infoComplementaria}/${id}`).pipe(
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

    /**
     * Gets INFO COMPLEMENTARIA
     *  returns one user level at once.
     */
    grabarSolicitudReliquidacion(body: any): any {
        this.rqManager.setPath('TERCEROS_CRUD_SERVICE');
        return this.rqManager.post('info_complementaria_tercero', body).pipe(
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

    /**
     * Gets INFO COMPLEMENTARIA
     *  returns one user level at once.
     */
    actualizarSolicitudReliquidacion(body: any): any {
        this.rqManager.setPath('TERCEROS_CRUD_SERVICE');
        return this.rqManager.put('info_complementaria_tercero/', body, body.Id).pipe(
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

    /**
     * Gets tipo de solicitud
     *  returns one user level at once.
     */
    obtenerTipoSolicitudEnviada(esActualizar?: any): any {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        let tipoSolicitud = ApiConstanst.SOLICITUDES.ESTADO_SOLICITUD_RELIQUIDACION;
        if (esActualizar) {
            tipoSolicitud = ApiConstanst.SOLICITUDES.ESTADO_SEGUNDA_REVISION;
        }
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.get('estado_tipo_solicitud/' + tipoSolicitud).pipe(
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


    /**
     * Gets tipo de solicitud
     *  returns one user level at once.
     */
    obtenerEstadoTipoSolicitud(): any {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.get('estado_tipo_solicitud?query=TipoSolicitud.Id:' + ApiConstanst.SOLICITUDES.TIPO_SOLICITUD_RELIQUDIACION).pipe(
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

    /**
     * Gets tipo de solicitud
     *  returns one user level at once.
     */
    obtenerTipoObservacion(): any {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.get('tipo_observacion').pipe(
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


    grabarPaquete(paquete: any) {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.post('paquete', paquete).pipe(
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


    grabarSoportePaquete(soporte: any) {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.post('soporte_paquete', soporte).pipe(
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

    grabarPaqueteSolicitud(soporte: any) {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.post('paquete_solicitud', soporte).pipe(
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


    getSolicitudes(params) {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.get(`solicitud_evolucion_estado?${UtilsService.crearQueryParams(params)}`).pipe(
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

    deleteSolicitud(params) {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.delete(`solicitud_evolucion_estado`,params.Id).pipe(
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

    getSolicitud(id) {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.get(`solicitud/${id}`).pipe(
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


    actualizarSolicitud(params) {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        const id = params.Id;
        params.Id = null;
        return this.rqManager.put(`solicitud/`, params, id).pipe(
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


    /**
    * Gets INFO COMPLEMENTARIA
    *  returns one user level at once.
    */
    getSolicitudTercero(id: any): any {
        this.rqManager.setPath('TERCEROS_CRUD_SERVICE');
        return this.rqManager.get(`info_complementaria_tercero/${id}`).pipe(
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


     /**
    * Gets INFO COMPLEMENTARIA
    *  returns one user level at once.
    */
      getObservaciones(solicitud: any, solicitudId?: any): any {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.get(`observacion?order=desc&sortby=Id&query=SolicitudId.Id:${(solicitudId || solicitud.SolicitudId.Id)}`).pipe(
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

     /**
    * Gets INFO COMPLEMENTARIA
    *  returns one user level at once.
    */
      updateSolicitudEstado(solicitudAnterior: any): any {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.put('solicitud_evolucion_estado/',solicitudAnterior,solicitudAnterior.Id).pipe(
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

     /**
    * Gets INFO COMPLEMENTARIA
    *  returns one user level at once.
    */
      getSolicitudEstado(id: any): any {
        this.rqManager.setPath('SOLICITUD_CRUD_SERVICE');
        return this.rqManager.get(`solicitud_evolucion_estado/${id}`).pipe(
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
