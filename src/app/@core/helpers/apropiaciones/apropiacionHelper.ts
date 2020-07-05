import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
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
       * Apropiacion Producto update
       * If the response has errors in the OAS API it should show a popup message with an error.
       * If the response suceed, it returns the data of the updated object.
       * @param apropiacionData object to save in the DB
       * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
       */
    public apropiacionProductoUpdate(apropiacionData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        apropiacionData.UnidadEjecutora = '1'; // Tomar la unidad ejecutora del token cuando este definido.
        apropiacionData.Organizacion = '1';

        return this.rqManager.putParams(`arbol_rubro_apropiacion/${apropiacionData.Codigo}/${apropiacionData.Vigencia}/${apropiacionData.UnidadEjecutora}`,
            apropiacionData).pipe(
                map(
                    (res) => {
                        if (res['Type'] === 'error') {
                            if (res['Message'] !== '') {
                                this.pUpManager.showErrorAlert(res['Message']);
                            } else {
                                this.pUpManager.showErrorAlert('No se pudo actualizar la información del producto al rubro seleccionado.');
                            }
                            return undefined;
                        }
                        return res;
                    },
                ),
            );

    }

    /**
       * Apropiacion Inicial Update
       * If the response has errors in the OAS API it should show a popup message with an error.
       * If the response suceed, it returns the data of the updated object.
       * @param apropiacionData object to save in the DB
       * @returns  <Observable> data of the object updated at the DB. undefined if the request has errors
       */
    public apropiacionApprove(apropiacionData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.post(`arbol_rubro_apropiacion/aprobacion_masiva/${apropiacionData.UnidadEjecutora}/${apropiacionData.Vigencia}`,
            apropiacionData).pipe(
                map(
                    (res) => {
                        if (res['Type'] === 'error') {
                            this.pUpManager
                                .showErrorAlert('No se pudo realizar la aprobación de la Apropiación Inicial de la Vigencia ' + apropiacionData.Vigencia);
                            return undefined;
                        }
                        return res;
                    },
                ),
            );

    }

    public getFullArbolByNode(node, vigencia) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        // Set the optional branch for the API request.
        const unidadEjecutora = 1;
        // call request manager for the tree's data.
        // return this.rqManager.get(`arbol_rubro_apropiacion/${raiz}/${vigencia.toString()}/${unidadEjecutora.toString()}`);
        return this.rqManager.get(`arbol_rubro_apropiacion/arbol_apropiacion/${node}/${unidadEjecutora.toString()}/${vigencia.toString()}`);
    }



    public getRootsBalance(vigencia: number, afectationObj?: any) {
        const unidadEjecutora = 1;
        this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
        return this.rqManager.post(`modificacion_apropiacion/simulacion_afectacion_modificacion/${unidadEjecutora.toString()}/${vigencia}`, afectationObj).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager
                            .showErrorAlert(res['Body']);
                        return undefined;
                    }
                    return res;
                }
            ),
            catchError(
                err => {
                    return undefined;
                }
            )
        );

    }

    public getVigenciasList() {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        const unidadEjecutora = 1;
        return this.rqManager.get(`vigencia/vigencias_total`).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager
                            .showErrorAlert('No se puede obtener la información de las vigencias  ');
                        return undefined;
                    }
                    return res;
                }
            )
        );
    }

}
