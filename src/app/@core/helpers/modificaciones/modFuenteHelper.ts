import { RequestManager } from '../../managers/requestManager';
import { TypeGeneral } from '../../interfaces/TypeGeneralInterface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PopUpManager } from '../../managers/popUpManager';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class ModFuenteHelper {
    constructor(private rqManager: RequestManager,
        private pUpManager: PopUpManager,
        private translate: TranslateService) {
        this.rqManager.setPath('MOVIMIENTOS_CRUD_SERVICE');
    }

    public getModTypes(): Observable<Array<TypeGeneral>> {
        this.rqManager.setPath('MOVIMIENTOS_CRUD_SERVICE');
        return this.rqManager.get(`tipo_movimiento/?limit=-1`);
    }

    public modRegister(modificationData: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
        modificationData.detail.CentroGestor = '1'; // Tomer del TOKEN.
        console.table(modificationData);
        console.info(JSON.stringify(modificationData));
        return this.rqManager.post('fuente_financiamiento_apropiacion/modificacion', modificationData).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert(this.translate.instant('mod_fuente_error'));
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

    public getAllModificacionesApr(id?: any, params?: {vigencia: string, cg: string}) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get(`documento_presupuestal/${params.vigencia}/${params.cg}/modificacion`).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert(this.translate.instant('mod_fuente_error'));
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

    public getModificacionesAfectation(docPresUUID?: any, params?: {vigencia: string, cg: string}) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get(`movimiento/${params.vigencia}/${params.cg}/${docPresUUID}`).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert(this.translate.instant('mod_fuente_error'));
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }
}
