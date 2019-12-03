import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class ProductoHelper {

    constructor(private rqManager: RequestManager,
        private pUpManager: PopUpManager,
      ) { }



    public getProductos(id?: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('producto/' + id).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar los productos');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }



    /**
     * Productos register
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param productoData object to save in the DB
     * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
     */
    public productoRegister(productoData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');

        return this.rqManager.post('producto', productoData).pipe(
            map(
                (res) => {
                    return res;
                },
            ),
        );

    }


    /**
     * Productos delete
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param id the id of the object to remove in the DB.
     * @returns  <Observable> object with api response. undefined if the proccess has errors
     */
    public productoDelete(id: number) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.delete('producto', id).pipe(
            map(
                (res) => {
                    return res;
                },
            ),
        );

    }


    /**
     * Productos update
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param productoData fields to update
     * @returns  <Obserbable> object updated information. undefined if the proccess has errors.
     */
    public productoUpdate(productoData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        productoData.Id = productoData.Id;
        return this.rqManager.put('producto/', productoData, productoData._id).pipe(
            map(
                (res) => {
                    return res;
                },
            ),
        );

    }
}
