import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ArbolHelper {

    constructor(private rqManager: RequestManager) { }


    /**
      * Gets full arbol
      *  returns full rubro's tree information (all nodes and branches).
      * @returns  data with tree structure for the ndTree module.
      */
    public getFullArbol(vigencia = '0') {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        // this.rqManager.setPath('DUMMY_SERVICE');
        // Set the optional branch for the API request.
        const unidadEjecutora = 1;
        // const raiz = 3;
        // call request manager for the tree's data.
        return this.rqManager.get(`arbol_rubro_apropiacion/arbol_apropiacion_valores/${unidadEjecutora}/${vigencia}`);
    }

    /**
      * Gets full arbol by Estado
      *  returns full rubro's tree information (all nodes and branches).
      * @returns  data with tree structure for the ndTree module.
      */
    public getFullArbolEstado(vigencia = '0', estado = 'registrada') {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        // this.rqManager.setPath('DUMMY_SERVICE');
        // Set the optional branch for the API request.
        const unidadEjecutora = 1;
        // const raiz = 3;
        // call request manager for the tree's data.
        return this.rqManager.get(`arbol_rubro_apropiacion/arbol_por_estado/${unidadEjecutora}/${vigencia}/${estado}`);
    }

}
