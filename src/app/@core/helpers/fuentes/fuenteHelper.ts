import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
  providedIn: 'root',
})
export class FuenteHelper {

  constructor(
    private rqManager: RequestManager,
    private pUpManager: PopUpManager,
  ) {}

    public getFuentes(id?: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('fuente_financiamiento/' + id).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar las fuentes');
                        return undefined;
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
        fuenteData.UnidadEjecutora = 1; // Tomar la unidad ejecutora del token cuando este definido.
        fuenteData.Organizacion = 1;
        fuenteData.Vigencia = fuenteData.Vigencia.vigencia;
        fuenteData.activo = true;
        fuenteData.Codigo = fuenteData.Codigo.toString();
        fuenteData.NumeroDocumento = fuenteData.NumeroDocumento.toString();
        fuenteData.TipoDocumento = fuenteData.TipoDocumento.Valor;
        return this.rqManager.post(`fuente_financiamiento/`, fuenteData).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo registrar la Fuente de Financiamiento');
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
        console.info(fuenteData);
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        fuenteData.UnidadEjecutora = 1; // Tomar la unidad ejecutora del token cuando este definido.
        fuenteData.Organizacion = 1;
        fuenteData.Vigencia = fuenteData.Vigencia.vigencia;
        fuenteData.activo = true;
        fuenteData.Codigo = fuenteData.Codigo.toString();
        fuenteData.NumeroDocumento = fuenteData.NumeroDocumento.toString();
        fuenteData.TipoDocumento = fuenteData.TipoDocumento.Valor;
        return this.rqManager.put('fuente_financiamiento/', fuenteData , fuenteData.Codigo).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No Se Pudo Actualizar La Fuente, Compruebe que no exista una fuente con el mismo Código.');
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
    public fuenteDelete(id: number) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.delete('fuente_financiamiento/', id).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No Se Pudo Eliminar La fuente, Compruebe que no exista una fuente con el mismo Código.');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }

}
