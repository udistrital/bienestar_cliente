import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class CRPHelper {

    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager,
    ) { }

    public getSolicitudesCRP(id?: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('solicitudesCRP/' + id).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar los crps');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }

    public getInfoCDP(consecutivoCDP) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('solicitudesCDP/').pipe(
            map(
                res_crp => {
                    if (res_crp['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo cargar el CDP');
                        return undefined;
                    } else {
                        return res_crp.filter(n => n.infoCdp !== null && n.infoCdp.consecutivo === consecutivoCDP)[0];
                    }
                }
            )
        );
    }
    /**
       * CRP register
       * If the response has errors in the OAS API it should show a popup message with an error.
       * If the response suceed, it returns the data of the updated object.
       * @param solCrpData object to save in the DB
       * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
       */
    public solCrpRegister(solCrpData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        solCrpData.consecutivo = 1; // Tomar la unidad ejecutora del token cuando este definido.
        solCrpData.consecutivoCdp = 1;
        solCrpData.vigencia = solCrpData.Vigencia.vigencia;
        solCrpData.beneficiario = "";
        solCrpData.valor = "";
        solCrpData.compromiso
        solCrpData.activo = true;
        solCrpData.Codigo = solCrpData.Codigo.toString();
        solCrpData.NumeroDocumento = solCrpData.NumeroDocumento.toString();
        solCrpData.TipoDocumento = solCrpData.TipoDocumento.Valor;
        return this.rqManager.post(`solicitudesCRP/`, solCrpData).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo registrar el CRP');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }

    /**
     * CRP update
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param crpData fields to update
     * @returns  <Observable> object updated information. undefined if the proccess has errors.
     */
    public solCrpUpdate(crpData) {
        console.info(crpData);
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        /*         cdpData.UnidadEjecutora = 1; // Tomar la unidad ejecutora del token cuando este definido.
                cdpData.Organizacion = 1;
                cdpData.Vigencia = cdpData.Vigencia.vigencia;
                cdpData.activo = true;
                cdpData.Codigo = cdpData.Codigo.toString();
                cdpData.NumeroDocumento = cdpData.NumeroDocumento.toString();
                cdpData.TipoDocumento = cdpData.TipoDocumento.Valor; */
        return this.rqManager.put('solicitudesCRP/', crpData, crpData.Codigo).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No Se Pudo Actualizar el CRP, Compruebe que no exista un crp con el mismo Código.');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }



}
