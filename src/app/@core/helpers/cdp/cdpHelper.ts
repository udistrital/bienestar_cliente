import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';


@Injectable({
    providedIn: 'root',
})
export class CDPHelper {

    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager,
    ) { }

    /**
   * CDP get solicitudes
   * consulta las solicitudes de CDP (no se ha expedido doc)
   * lista de SCDP si todo ok, alerta si falla.
   * @param id en caso de que se desee consultar una solicitud especifica
   * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
   */

    public getSolicitudesCDP(id?: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('solicitudesCDP/' + id).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar los cdps');
                        return undefined;
                    }
                    return res ? res.filter(e => e.infoCdp === null || e.infoCdp === {}) : undefined;
                },
            ),
        );

    }

    /**
    * CDP get
    * consulta los CDP (se ha expedido doc)
    * lista de CDP si todo ok, alerta si falla.
    * @param id en caso de que se desee consultar un CDP especifico
    * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
    */

    public getListaCDP(id?: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('solicitudesCDP/' + id).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar los cdps');
                        return undefined;
                    }
                    return res ?
                        res.filter(
                            e => e.infoCdp !== null && e.infoCdp.consecutivo && e.infoCdp.fechaExpedicion && e.infoCdp.estado).map(
                                e => {
                                    return {
                                        ...e,
                                        consecutivo_cdp: e.infoCdp.consecutivo,
                                        estado_cdp: e.infoCdp.estado,
                                        fecha_cdp: e.infoCdp.fechaExpedicion,
                                    };
                                }
                            )
                        : undefined;
                },
            ),
        );

    }

    /**
    * get nece adm
    * consulta las necesidades desde administrativa
    * necesidad si  todo ok, alerta si falla.
    * @param id en caso de que se desee consultar una necesidad especifica
    * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
    */
    public getNecesidadAdm(id) {
        this.rqManager.setPath('ADMINISTRATIVA_SERVICE');
        return this.rqManager.get(`necesidad/`).pipe(
            map(
                res_adm => {
                    if (res_adm['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo cargar la Necesidad');
                        return undefined;
                    } else {
                        return res_adm.filter(n => n.Id === id)[0];
                    }
                }
            )
        );
    }

    /**
    * get nece plan cuentas
    * consulta las necesidades desde plan cuentas
    * necesidad si  todo ok, alerta si falla.
    * @param id en caso de que se desee consultar una necesidad especifica
    * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
    */
    public getNecesidadPC(idnecesidad) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get(`necesidades/`).pipe(
            map(
                res_pc => {
                    if (res_pc['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo cargar la Necesidad');
                        return undefined;
                    } else {
                        res_pc = res_pc.filter(n => n.idAdministrativa + '' === idnecesidad + '');
                        return res_pc[0];
                    }
                }
            )
        );

    }

      /**
    * get nece adm
    * consulta las necesidades desde administrativa
    * necesidad si  todo ok, alerta si falla.
    * @param id en caso de que se desee consultar una necesidad especifica
    * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
    */
   public getFullNecesidad(id) {
    this.rqManager.setPath('NECESIDADES_CRUD_SERVICE');
    return this.rqManager.get(`necesidad/getfullnecesidad/`+id).pipe(
        map(
            res_adm => {
                if (res_adm['Type'] === 'error') {
                    this.pUpManager.showErrorAlert('No se pudo cargar la Necesidad');
                    return undefined;
                } else {
                    console.info(res_adm);
                }
            }
        )
    );
}

    /**
     * CDP update
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param cdpData fields to update
     * @returns  <Observable> object updated information. undefined if the proccess has errors.
     */
    public cdpUpdate(cdpData) {
        console.info(cdpData);
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        cdpData.UnidadEjecutora = 1; // Tomar la unidad ejecutora del token cuando este definido.
        cdpData.Organizacion = 1;
        cdpData.Vigencia = cdpData.Vigencia.vigencia;
        cdpData.activo = true;
        cdpData.Codigo = cdpData.Codigo.toString();
        cdpData.NumeroDocumento = cdpData.NumeroDocumento.toString();
        cdpData.TipoDocumento = cdpData.TipoDocumento.Valor;
        return this.rqManager.put('cdp/', cdpData, cdpData.Codigo).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No Se Pudo Actualizar La CDP, Compruebe que no exista una cdp con el mismo Código.');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }



}
