import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class CierreVigenciaHelper {

    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager,
    ) { }

    /**
    * getSolicitudesCdp
    * Consulta la informacion de precierre
    * cierre si todo ok, alerta si falla.
    * @param vigencia vigencia para obtener cierre
    * @param area area funcional del cierre
    * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
    */
    public getInfoCierre(vigencia: string, area: string,) {
        this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
        return this.rqManager.get('vigencia/get_cierre/'+vigencia+'/'+area).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar la informacion del cierre');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }


}
