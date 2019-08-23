import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ArbolHelper {

    constructor(private rqManager: RequestManager,
        private pUpManager: PopUpManager) { }


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
        return this.rqManager.get(`arbol_rubro_apropiacion/arbol_apropiacion_valores/${unidadEjecutora}/${vigencia}`)
    }

}