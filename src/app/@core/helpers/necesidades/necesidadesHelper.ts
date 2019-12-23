import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class NecesidadesHelper {

    constructor(private rqManager: RequestManager,
        private pUpManager: PopUpManager,
      ) { }

    /**
     * getEstadoRechazado
     * Obtiene el estado Rechazada del servicio estado_necesidad
     * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
     */
    public getEstadoRechazado() {
        this.rqManager.setPath('NECESIDADES_CRUD_SERVICE');
        return this.rqManager.get('estado_necesidad?query=CodigoAbreviacionn:R').pipe(
            map(
                (res) => {
                    if (res[0]) {
                        return res[0];
                    }
                    return undefined;
                },
            ),
        );
    }

    /**
     * postNecesidadRechazada
     * registra una necesidad rechazada
     * @param necesidadRechazada objeto de la necesidad rechazada
     * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
     */
    public postNecesidadRechazada(necesidadRechazada: object) {
        this.rqManager.setPath('NECESIDADES_CRUD_SERVICE');
        return this.rqManager.post('necesidad_rechazada', necesidadRechazada).pipe(
            map(
                (res) => {
                    if (res[0]) {
                        this.pUpManager.showInfoAlert(necesidadRechazada['justificacion'], `Error al rechazar la necesidad Nº ${necesidadRechazada['ConsecutivoNecesidad']}`);
                    }
                    this.pUpManager.showInfoAlert(necesidadRechazada['justificacion'], `Solicitud de neceisdad Nº ${necesidadRechazada['ConsecutivoNecesidad']} rechazada`);
                },
            ),
        );
    }

    /**
     * putNecesidad
     * actuala la información de una necesidad
     * @param necesidad objeto de tipo necesidad
     * @param id id de la necesidad
     * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
     */
    public putNecesidad(necesidad: object, id: number) {
        this.rqManager.setPath('NECESIDADES_CRUD_SERVICE');
        return this.rqManager.put('necesidad/', necesidad, id).pipe(
            map(
                (res) => {
                    if (res[0]) {
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }


    /**
     * getEstados
     * obtiene los estados de las necesidades
     * @param id id del estado
     * @param query query para la consulta
     * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
     */
    public getEstados(query?: string, id?: string) {
        this.rqManager.setPath('NECESIDADES_CRUD_SERVICE');

        return this.rqManager.get(id ? `estado_necesidad/${id}` : `estado_necesidad?${query}`).pipe(
            map(
                (res) => {
                    console.info(res);
                    if (res['Status'] === '404') {
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

}
