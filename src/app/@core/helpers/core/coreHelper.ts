import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class CoreHelper {

    constructor(private rqManager: RequestManager,
        private pUpManager: PopUpManager,
      ) { }

    // getJefeDependencia obtiene el jefe de dependencia por su id
    public getJefeDependencia(id_jefe_dependencia: string) {
        this.rqManager.setPath('CORE_AMAZON_SERVICE');
        return this.rqManager.get('jefe_dependencia/' + id_jefe_dependencia).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar el jefe de dependencia');
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

        // getJefeDependenciaByDependencia obtiene el jefe de dependencia por el id de la dependencia
        public getJefeDependenciaByDependencia(id_dependencia: string) {
            this.rqManager.setPath('CORE_AMAZON_SERVICE');
            return this.rqManager.get('jefe_dependencia?query=DependenciaId:' + id_dependencia).pipe(
                map(
                    (res) => {
                        if (res === 'error') {
                            this.pUpManager.showErrorAlert('No se pudo consultar el jefe de dependencia');
                            return undefined;
                        }
                        return res;
                    },
                ),
            );
        }
}
