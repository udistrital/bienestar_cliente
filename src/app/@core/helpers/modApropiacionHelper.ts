import { RequestManager } from '../managers/requestManager';
import { TypeGeneral } from '../interfaces/TypeGeneralInterface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ModApropiacionHelper {
    constructor(private rqManager: RequestManager) {
        this.rqManager.setPath('MOVIMIENTOS_CRUD_SERVICE');
    }

    public getModTypes(): Observable<Array<TypeGeneral>> {
        return this.rqManager.get(`tipo_movimiento`);
    }
}
