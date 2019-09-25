import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AdmAmazonHelper {

    constructor(private rqManager: RequestManager) { }
    /**
     * get
     * @param[limit] número de resultados
     * @returns  arreglo con todas las dependencias.
     */
    public getAllTipoDocumento() {
        this.rqManager.setPath('ADMINISTRATIVA_PRUEBAS_SERVICE');
        const params = {
            limit: -1,
            ClaseParametro: "Tipo de Documento"

        };
        // call request manager for the tree's data.
        return this.rqManager.get('parametro_estandar/?query=ClaseParametro:Tipo%20Documento&limit=-1', params);
    }
}
