import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DocumentHelper {
    constructor() { }

    public getDocumentType() {
        return [
            {
                Id: 1,
                Nombre: 'Acta'
            }
        ];
    }
}
