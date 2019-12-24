import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DocumentoPresupuestalHelper } from '../../../../@core/helpers/documentoPresupuestal/documentoPresupuestalHelper';

@Component({
    selector: 'ngx-detalle-crp',
    templateUrl: './detalle-crp.component.html',
    styleUrls: ['./detalle-crp.component.scss']
  })
export class DetalleCrpComponent implements OnInit {
    @Input() movimientosRp: any[];
    @Input() vigencia: string;
    @Input() areaFuncional: string;

    docPresupuestal: any[];
    constructor(
        private docPresupuestalHelper: DocumentoPresupuestalHelper
    ) {
        this.docPresupuestal = [];
    }

    ngOnInit() {
        this.getInfoDocPresupuestal();
    }

    private getInfoDocPresupuestal() {
        let docPresupuestalMap = {};
        let documentosRequest = [];
        this.movimientosRp.forEach(element => {
            documentosRequest.push(this.docPresupuestalHelper.getById(this.vigencia, this.areaFuncional, element.DocumentoPresupuestalUUID));
        });
        forkJoin(documentosRequest).subscribe(res => {
            res.forEach(element => {
                docPresupuestalMap[element['_id']] = element;                
            });
            this.docPresupuestal = Object.values(docPresupuestalMap);
        });
    }
}