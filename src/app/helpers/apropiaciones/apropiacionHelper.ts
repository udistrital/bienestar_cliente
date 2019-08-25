import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class ApropiacionHelper {

    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager,
    ) { }


    /**
       * Apropiacion Inicial register
       * If the response has errors in the OAS API it should show a popup message with an error.
       * If the response suceed, it returns the data of the updated object.
       * @param apropiacionData object to save in the DB
       * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
       */
    public apropiacionRegister(apropiacionData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        apropiacionData.UnidadEjecutora = '1'; // Tomar la unidad ejecutora del token cuando este definido.
        apropiacionData.Organizacion = '1';
        console.info(apropiacionData.ApropiacionAnterior);
        if (parseFloat(apropiacionData.ApropiacionAnterior) === 0) {
            return this.rqManager.post(`arbol_rubro_apropiacion/`, apropiacionData).pipe(
                map(
                    (res) => {
                        if (res['Type'] === 'error') {
                            this.pUpManager.showErrorAlert('No se pudo registrar la Apropiación Inicial al rubro seleccionado.');
                            return undefined;
                        }
                        return res;
                    },
                ),
            );
        } else if (apropiacionData.ApropiacionAnterior > 0) {
            return this.rqManager.putParams(`arbol_rubro_apropiacion/${apropiacionData.Codigo}/${apropiacionData.Vigencia}/${apropiacionData.UnidadEjecutora}`,
                apropiacionData).pipe(
                    map(
                        (res) => {
                            if (res['Type'] === 'error') {
                                this.pUpManager.showErrorAlert('No se pudo actualizar la Apropiación Inicial al rubro seleccionado.');
                                return undefined;
                            }
                            return res;
                        },
                    ),
                );
        } else {
            this.pUpManager.showErrorAlert('Valor Invalido de Apropiación');
        }


    }

    /**
       * Apropiacion Inicial Update
       * If the response has errors in the OAS API it should show a popup message with an error.
       * If the response suceed, it returns the data of the updated object.
       * @param apropiacionData object to save in the DB
       * @returns  <Observable> data of the object updated at the DB. undefined if the request has errors
       */
    public apropiacionUpdate(apropiacionData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        apropiacionData.UnidadEjecutora = 1; // Tomar la unidad ejecutora del token cuando este definido.
        apropiacionData.Organizacion = 1;
        return this.rqManager.putParams(`arbol_rubro_apropiacion/${apropiacionData.Rubro.Codigo}/${apropiacionData.Vigencia}/${apropiacionData.UnidadEjecutora}`,
            apropiacionData).pipe(
                map(
                    (res) => {
                        if (res['Type'] === 'error') {
                            this.pUpManager.showErrorAlert('No se pudo actualizar la Apropiación Inicial al rubro seleccionado.');
                            return undefined;
                        }
                        return res;
                    },
                ),
            );

    }

    public getFullArbol(raiz) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        // Set the optional branch for the API request.
        const unidadEjecutora = 1;
        const vigencia = 2019;
        // call request manager for the tree's data.
        // return this.rqManager.get(`arbol_rubro_apropiacion/${raiz}/${vigencia.toString()}/${unidadEjecutora.toString()}`);
        return this.rqManager.get(`arbol_rubro_apropiacion/arbol_apropiacion/${raiz}/${unidadEjecutora.toString()}/${vigencia.toString()}`);
    }



    public getRootsBalance(vigencia: number) {
        const unidadEjecutora = 1;
        return this.rqManager.get(`arbol_rubro_apropiacion/comprobar_balance/${unidadEjecutora.toString()}/${vigencia}`);

    }

}
