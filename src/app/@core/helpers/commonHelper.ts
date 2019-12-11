import { RequestManager } from '../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class CommonHelper {

    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager,
    ) { }

    public geCurrentVigencia(offset?: number) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        const params = {
            offset,
        };
        let query = '';
        if (offset) {
            query = `?offset=${offset}`;
        }
        return this.rqManager.get(`vigencia/vigencia_actual${query}`, params).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager
                            .showErrorAlert('No se puede obtener la información de la vigencia actual  ');
                        return undefined;
                    }
                    return res;
                }
            )
        );
    }

    public static Ng2CustomFilterFunction(contact?: any, search?: string, filterFiled?: string): boolean {

            let match = true;

            Object.keys(contact).map(u => contact[filterFiled]).filter(it => {

              match = it.toLowerCase().includes(search);
            });

            if (match || search === '') {
              return true;
            } else {
              return false;
            }
    }

    public static Ng2CompareFunction (direction: any, a: any, b: any, filterFiled: string) {

            const first  = typeof a[filterFiled] === 'string' ? a[filterFiled].toLowerCase() : a[filterFiled];
            const second = typeof b[filterFiled] === 'string' ? b[filterFiled].toLowerCase() : b[filterFiled];

            if (first < second) {
              return -1 * direction;
            }
            if (first > second) {
              return direction;
            }
            return 0;
          }
}
