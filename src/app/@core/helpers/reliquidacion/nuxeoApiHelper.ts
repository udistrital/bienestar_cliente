import {RequestManager} from '../../managers/requestManager';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {PopUpManager} from '../../managers/popUpManager';
import { HttpHeaders } from '@angular/common/http';

const infoComplementaria = 'info_complementaria';
const baseInfoComplementaria = 'info_complementaria?query=GrupoInfoComplementariaId%3A';

@Injectable({
    providedIn: 'root',
})
export class NuxeoApiHelper {

    constructor(private rqManager: RequestManager,
                private pUpManager: PopUpManager) {
    }

    guardarBatch(documento: FormData, file: any){
        this.rqManager.setPath('NUXEO_2020');
        this.rqManager.post('upload',{}).subscribe((res)=>{
            const httpOptions = {
                headers: new HttpHeaders({
                  'Content-Type': 'multipart/form-data',
                  'X-File-Type': file.type,
                  'X-File-Name': file.name,
                }),
            };
            documento.append('type','formData');
            this.rqManager.post(`upload/${res.batchId}/0`,documento,httpOptions).subscribe((res)=>{
                console.log(res);
            })
        });
    }

}
