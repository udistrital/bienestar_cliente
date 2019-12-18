import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root'
})
export class DocumentoPresupuestalHelper {

    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager
    ) { }

    /**
     * GetAllDocumentoPresupuestalByTipo
     * Obtiene todos los documentos presupuestales dependiendo de una vigencia, centro gestor y el tipo de documento a obtener
     * @param vigencia Vigencia del documento
     * @param centroGestor centro gestor que expedio el documento
     * @param tipo tipo del documento presupuestal
     * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
     */
    public GetAllDocumentoPresupuestalByTipo(
        vigencia: string,
        centroGestor: string,
        tipo: string
    ) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager
            .get(
                'documento_presupuestal/' + vigencia + '/' + centroGestor + '/' + tipo
            )
            .pipe(
                map((res: object[]) => {
                    if (res['Type'] === 'error') {
                        return undefined;
                    }
                    return res;
                })
            );
    }

    /**
     * get
     * Get por defecto de documento_presupuestal
     * @param query Consulta con la cual se hace el get, es opcional, si no se envía se devuelven todos los registros
     * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
     */
    public get(vigencia: string, centroGestor: string, query?: string) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager
            .get(
                'documento_presupuestal/' +
                vigencia +
                '/' +
                centroGestor +
                '?query=' +
                query
            )
            .pipe(
                map((res: object[]) => {
                    if (res['Type'] === 'error') {
                        return undefined;
                    }
                    return res;
                })
            );
    }
}
