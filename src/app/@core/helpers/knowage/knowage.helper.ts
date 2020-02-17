import { Injectable } from '@angular/core';
import { Sbi } from 'knowagesdk';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class KnowageHelper {

    private url;

    private buildSbi(): any {
        return new Sbi(environment.KNOWAGE.PROTOCOL, environment.KNOWAGE.HOST, '', environment.KNOWAGE.CONTEXTPATH, 'servlet/AdapterHTTP');
    }

    getReporte(label: string, scope: any) {
        const config = {
            documentLabel: label
            , executionRole: '/knowage/admin'
            //, parameters: { warehouse_id: 19 }
            , displayToolbar: true
            , displaySliders: true
            , iframe: {
                height: '500px'
                , width: '100%'
                , style: 'border: 0px;'
            }
        }

        const sbi = this.buildSbi()
        console.log(sbi);

        const authConf = {
            params: {
                  user: environment.KNOWAGE.USER,
                  password: environment.KNOWAGE.USER
            },
            callback: {
                fn: () => {
                    this.url = sbi.getDocumentHtml(config);
                },
                scope: scope
            }
      };

        // sbi.authenticate(environment.KNOWAGE.USER, environment.KNOWAGE.PASSWORD, () => {
        //     this.url = sbi.getDocumentHtml(config);
        //     console.log(this.url);
        // });

        sbi.authenticate(authConf);
        return this.url;
    }



}


