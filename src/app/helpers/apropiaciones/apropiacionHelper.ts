import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';
import { Observable, forkJoin } from 'rxjs';

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
        apropiacionData.UnidadEjecutora = 1; // Tomar la unidad ejecutora del token cuando este definido.
        apropiacionData.Organizacion = 1;
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

    }

    public getFullArbol(raiz) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        // Set the optional branch for the API request.
        const unidadEjecutora = 1;
        const vigencia = 2019;
        // call request manager for the tree's data.
        return this.rqManager.get(`arbol_rubro_apropiacion/arbol_apropiacion/${raiz}/${unidadEjecutora.toString()}/${vigencia.toString()}`);

    }

    public getFullRaices() {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        // Set the optional branch for the API request.
        const unidadEjecutora = 1;
        const vigencia = 2019;
        // call request manager for the tree's data.
        const roots = new Observable<any>((observer) => {
            const rootsObsv: Observable<any>[] = [];

            this.rqManager.get(`arbol_rubro_apropiacion/RaicesArbolApropiacion/${unidadEjecutora.toString()}/${vigencia.toString()}`).toPromise().then(res => {

                for (const element of res) {

                    rootsObsv.push(this.getFullArbol(element.Codigo));

                }
                forkJoin(rootsObsv).subscribe(treeUnformated => {
                    const tree = [];

                    for (const branch of treeUnformated) {
                        if (branch) {
                            tree.push(branch[0]);
                        }
                    }
                    observer.next(tree);
                    observer.complete();
                });

            });

            // observable execution

        });
        return roots;
    }

    public getRootsBalance(unidadEjecutora: number, vigencia: number) {

        let totalIncomes = 0;
        let totalExpenses = 0;

        this.rqManager.get(`arbol_rubro_apropiacion/RaicesArbolApropiacion/${unidadEjecutora}/${vigencia}`).toPromise().then((res) => {
            for (const aprRoot of res) {
                if (aprRoot.Codigo === '2') {
                    totalIncomes = aprRoot.ApropiacionInicial;
                } else if (aprRoot.Codigo === '3') {
                    totalExpenses = aprRoot.aprRoot.ApropiacionInicial;
                }
            }
        });
        return {
            totalIncomes,
            totalExpenses,
        };
    }

}
