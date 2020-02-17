import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';


@Injectable({
    providedIn: 'root',
})

export class MovimientosHelper {

    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager,
    ) { }

    /**
    * postMovimiento
    * Registra un movimiento
    * @param data data del movimiento
    * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
    */
    public postMovimiento(data: object) {
        this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
        return this.rqManager.post('movimiento', data).pipe(
            map(
                (res: object) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo expedir el Documento');
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

    /**
    * getByDocumentoPresupuestal
    * obtiene un movimiento a partir de su doc presupuestal
    * @param vigencia vigencia del movimiento
    * @param centroGestor centro gestor del movimiento
    * @param id id del documento presupuetal vinculado al movimiento
    * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
    */
    public getByDocumentoPresupuestal(vigencia: string, centroGestor: string, id: string) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('movimiento/' + vigencia + '/' + centroGestor + '/' + id).pipe(
            map(
                (res: object) => {
                    if (res['Type'] === 'error') {
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

    public getChildMovsByMovParentUUID(vigencia: string, centroGestor: string, id: string) {
        this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
        return this.rqManager.get('movimiento/get_doc_by_mov_parentUUID/' + vigencia + '/' + centroGestor + '/' + id).pipe(
            map(
                (res: any) => {
                    if (res && res['Type'] === 'error') {
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

    /**
    * getByMovimientoPadre
    * obtiene un movimiento a partir de su movimiento padre
    * @param vigencia vigencia del movimiento
    * @param centroGestor centro gestor del movimiento
    * @param idPadre id del documento presupuetal vinculado al movimiento
    * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
    */
   public getByMovimientoPadre(vigencia: string, centroGestor: string, idPadre: string) {
    this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
    return this.rqManager.get('movimiento/get_movimentos_by_parent_id/' + vigencia + '/' + centroGestor + '/' + idPadre).pipe(
        map(
            (res: object) => {
                if (res['Type'] === 'error') {
                    return undefined;
                }
                return res;
            },
        ),
    );
}
}
