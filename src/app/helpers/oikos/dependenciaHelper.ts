import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DependenciaHelper {

    constructor(private rqManager: RequestManager) { }
    /**
     * get
     * @param[limit] número de resultados
     * @returns  arreglo con todas las dependencias.
     */
    public get() {
        this.rqManager.setPath('OIKOS_SERVICE');
        const params = {
            limit: 0,
        };
        // call request manager for the tree's data.
        return this.rqManager.get('dependencia', params);
    }
}
