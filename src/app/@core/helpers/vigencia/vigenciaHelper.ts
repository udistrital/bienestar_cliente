import { Injectable } from "@angular/core";
import { RequestManager } from '../../managers/requestManager';
import { PopUpManager } from '../../managers/popUpManager';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class VigenciaHelper {
    router: any;

    constructor(
       private rqManager: RequestManager,
       private pUpManager: PopUpManager, 
    ){ }

     /**
    * getFullVigencias
    * Consulta todas las vigencias.
    * retorna las vigencias guardadas si todo esta bien, en caso contrario muestra una alerta .
    * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
    */
    public getFullVigencias() {
        const query = 'vigencia_actual_area';
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('vigencia/vigencias_total').pipe(
            map(
                (res) => {
                    
                    if (res === 'error'){
                        this.pUpManager.showErrorAlert('No se pueden consultar las vigencias');
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }
}
