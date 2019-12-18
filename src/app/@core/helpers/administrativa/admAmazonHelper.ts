import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

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
            ClaseParametro: 'Tipo de Documento'

        };
        // call request manager for the tree's data.
        return this.rqManager.get('parametro_estandar/?query=ClaseParametro:Tipo%20Documento&limit=-1', params);
    }

    /**
     * get
     * @param id id de la persona natural
     * @returns  objeto persona natural
     */
    public getPersonaNatural(id: string) {
        this.rqManager.setPath('ADMINISTRATIVA_PRUEBAS_SERVICE');
        return this.rqManager.get('informacion_persona_natural/' + id).pipe(
            map(res => res)
        );
    }

    /**
     * get
     * @param id id del proveedor
     * @returns  objeto persona natural
     */
    public getProveedor(id: string) {
        this.rqManager.setPath('ADMINISTRATIVA_PRUEBAS_SERVICE');
        return this.rqManager.get('informacion_proveedor/' + id).pipe(
            map(res => res)
        );
    }
}
