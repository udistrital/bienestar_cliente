import { RequestManager } from '../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class CommonHelper {

    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager,
    ) { }

    public geCurrentVigencia(offset?: number) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        const params = {
            offset,
        };
        let query = '';
        if (offset) {
            query = `?offset=${offset}`;
        }
        return this.rqManager.get(`vigencia/vigencia_actual${query}`, params).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager
                            .showErrorAlert('No se puede obtener la información de la vigencia actual  ');
                        return undefined;
                    }
                    return res;
                }
            )
        );
    }

}
