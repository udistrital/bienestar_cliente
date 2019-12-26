import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class VigenciaHelper {
    router: any;

    constructor(private rqManager: RequestManager) {}

    public getVigenciasTotal() {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('vigencia/vigencias_total').pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        return undefined;
                    } else {
                        return res;
                    }

                },
            ),
        );
    }
}
