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
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo expedir el CDP');
                        return undefined;
                    }
                    return res ? res.filter(e => e.infoCdp === null || e.infoCdp === "") : undefined;
                },
            ),
        );
    }
}
