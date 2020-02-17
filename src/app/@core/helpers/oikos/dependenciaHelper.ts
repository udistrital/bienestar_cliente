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
    public get(id?: any, query?: string) {
        this.rqManager.setPath('OIKOS_SERVICE');
        const params = {
            limit: 0,
        };
        const url = id ? id : '?' + query;
        // call request manager for the tree's data.
        return this.rqManager.get('dependencia/' + url);
    }
}
