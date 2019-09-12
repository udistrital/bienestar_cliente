import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class RubroHelper {

    constructor(private rqManager: RequestManager,
        private pUpManager: PopUpManager) { }

    /**
     * Gets arbol
     *  returns one tree level at once.
     * @param [branch] tree's branch to request info from the API
     * @returns  branch information.
     */
    public getArbol(branch?: string) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        // this.rqManager.setPath('DUMMY_SERVICE');
        // Set the optional branch for the API request.
        // const unidadEjecutora = 1;
        const params = {
            rama: branch,
        };
        // call request manager for the tree's data.
        return this.rqManager.get(`arbol_rubro/arbol/${branch}`, params);

    }

    /**
     * Gets full arbol
     *  returns full rubro's tree information (all nodes and branches).
     * @returns  data with tree structure for the ndTree module.
     */
    public getFullArbol(vigencia = '0') {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        // this.rqManager.setPath('DUMMY_SERVICE');
        // Set the optional branch for the API request.
        const unidadEjecutora = 1;
        // const raiz = 3;
        // call request manager for the tree's data.
        return this.rqManager.get(`arbol_rubro_apropiacion/arbol_apropiacion_valores/${unidadEjecutora.toString()}/${vigencia}`);
        // const roots = new Observable<any>((observer) => {
        //     const rootsObsv: Observable<any>[] = [];

        // this.rqManager.get(`arbol_rubro_apropiacion/arbol_apropiacion_valores/${unidadEjecutora.toString()}/${vigencia}`).toPromise().then(res => {

        //     for (const element of res) {

        //         rootsObsv.push(this.getArbol(element.Codigo));

        //     }
        //     forkJoin(rootsObsv).subscribe(treeUnformated => {
        //         const tree = [];

        //         for (const branch of treeUnformated) {
        //             if (branch) {
        //                 tree.push(branch[0]);
        //             }
        //         }
        //         observer.next(tree);
        //         observer.complete();
        //     });

        // });

        // observable execution

        // });
        // return roots;
    }


    /**
     * Rubros register
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param rubroData object to save in the DB
     * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
     */
    public rubroRegister(rubroData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        rubroData.UnidadEjecutora = '1'; // Tomar la unidad ejecutora del token cuando este definido.
        console.table(rubroData);
        return this.rqManager.post('arbol_rubro', rubroData).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No Se Pudo Registrar El rubro, Compruebe que no exista un rubro con el mismo Código.');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }


    /**
     * Rubros delete
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param id the id of the object to remove in the DB.
     * @returns  <Observable> object with api response. undefined if the proccess has errors
     */
    public rubroDelete(id: string) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.delete('arbol_rubro', id).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No Se Pudo Eliminar El rubro, Compruebe que no exista un rubro con el mismo Código.');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }


    /**
     * Rubros update
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param rubroData fields to update
     * @returns  <Obserbable> object updated information. undefined if the proccess has errors.
     */
    public rubroUpdate(rubroData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.put('arbol_rubro/', rubroData, rubroData.Codigo).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No Se Pudo Actualizar El rubro, Compruebe que no exista un rubro con el mismo Código.');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }
}
