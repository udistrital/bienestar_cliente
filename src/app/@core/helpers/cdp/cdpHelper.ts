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
  ) {}

    public getSolicitudesCDP(id?: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('solicitudesCDP/' + id).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar los cdps');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }
    /**
       * CDP register
       * If the response has errors in the OAS API it should show a popup message with an error.
       * If the response suceed, it returns the data of the updated object.
       * @param cdpData object to save in the DB
       * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
       */
    public cdpRegister(cdpData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        cdpData.UnidadEjecutora = 1; // Tomar la unidad ejecutora del token cuando este definido.
        cdpData.Organizacion = 1;
        cdpData.Vigencia = cdpData.Vigencia.vigencia;
        cdpData.activo = true;
        cdpData.Codigo = cdpData.Codigo.toString();
        cdpData.NumeroDocumento = cdpData.NumeroDocumento.toString();
        cdpData.TipoDocumento = cdpData.TipoDocumento.Valor;
        return this.rqManager.post(`cdp_financiamiento/`, cdpData).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo registrar la CDP de Financiamiento');
                        return undefined;
                    }
                    return res;
                },
            ),
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
        return this.rqManager.put('cdp_financiamiento/', cdpData , cdpData.Codigo).pipe(
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
