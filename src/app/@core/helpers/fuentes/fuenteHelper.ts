import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class FuenteHelper {

    query_params: String;
    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager,
    ) { }
    /**
       * getFuentes
       * If the response has errors in the OAS API it should show a popup message with an error.
       * If the response suceed, it returns the data of the object.
       * @param id object to get in the DB
       * @param param object with the params to get in the DB
       * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
       */
    public getFuentes(id?: any, params?: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        if (params) {
            this.query_params = id ? id + '/' + params.Vigencia + '/' + params.UnidadEjecutora : params.Vigencia + '/' + params.UnidadEjecutora;
        } else {
            this.query_params = '0/1';
        }
        return this.rqManager.get('fuente_financiamiento/' + this.query_params).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar las fuentes');
                        return undefined;
                    } else if (!id || this.query_params === '0/1') {
                        res.forEach(element => {
                            element.Vigencia === 0 ? element.Vigencia = 'sin vigencia asignada' : element.Vigencia;
                        });
                    }
                    return res;
                },
            ),
        );

    }
    /**
       * Fuente register
       * If the response has errors in the OAS API it should show a popup message with an error.
       * If the response suceed, it returns the data of the updated object.
       * @param fuenteData object to save in the DB
       * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
       */
    public fuenteRegister(fuenteData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        fuenteData.UnidadEjecutora = '1';  // Tomar la unidad ejecutora del token cuando este definido.
        fuenteData.Organizacion = 1;
        /* fuenteData.Vigencia = fuenteData.Vigencia; */
        fuenteData.activo = true;
        return this.rqManager.post(`fuente_financiamiento/`, fuenteData).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert(res['Message']);
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }

    /**
     * Fuente update
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param fuenteData fields to update
     * @returns  <Observable> object updated information. undefined if the proccess has errors.
     */
    public fuenteUpdate(fuenteData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        fuenteData.UnidadEjecutora = '1'; // Tomar la unidad ejecutora del token cuando este definido.
        fuenteData.Organizacion = 1;
/*         fuenteData.Vigencia = fuenteData.Vigencia; */
        fuenteData.activo = true;
/*         fuenteData.Codigo = fuenteData.Codigo.toString();
        fuenteData.NumeroDocumento = fuenteData.NumeroDocumento.toString();
        fuenteData.TipoDocumento = fuenteData.TipoDocumento.Valor; */
        return this.rqManager.put('fuente_financiamiento/', fuenteData, fuenteData.Codigo + '/' + fuenteData.Vigencia + '/' + fuenteData.UnidadEjecutora).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No Se Pudo Actualizar La Fuente');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }

    /**
     * Fuente delete
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param id the id of the object to remove in the DB.
     * @returns  <Observable> object with api response. undefined if the proccess has errors
     */
    public fuenteDelete(id: number, params?: any) {
        if (params) {
            this.query_params = '/' + params.Vigencia + '/' + params.UnidadEjecutora;
        }
        this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
        return this.rqManager.delete('fuente_financiamiento_apropiacion', id.toString() + this.query_params).pipe(
            map(
                (res) => {
                    return res;
                },
            ),
        );

    }

       // getPlanAdquisicionByFuente obtiene la información del plan de adquisiciones con una vigencia y una fuente
       public getPlanAdquisicionByFuente(vigencia: string, fuente: string) {
        this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
        return this.rqManager.get('fuente_financiamiento_apropiacion/plan_adquisiciones_rubros_fuente/' + vigencia + '/' + fuente).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar el plan de adquisición');
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

}
