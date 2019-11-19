import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class PlanAdquisicionHelper {

    constructor(private rqManager: RequestManager,
        private pUpManager: PopUpManager,
      ) { }



    public getPlanAdquisicionByRubro(query?: any) {
        this.rqManager.setPath('PLAN_ADQUISICION_SERVICE');
        return this.rqManager.get('plan_adquisiciones_rubro/' + query).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar el plan de adquisición');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }


}
