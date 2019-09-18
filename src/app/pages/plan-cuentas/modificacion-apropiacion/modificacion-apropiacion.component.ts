import { Component, OnInit } from '@angular/core';
import { DETALLE_MODIFICACION_FORM } from './detalle_modificacion_form';
import { FormManager } from '../../../@core/managers/formManager';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ngx-modificacion-apropiacion',
    templateUrl: './modificacion-apropiacion.component.html',
    styleUrls: ['./modificacion-apropiacion.component.scss'],
})
export class ModificacionApropiacionComponent implements OnInit {
    ngOnInit() { }
    formDetalle: object;
    constructor(
        private translate: TranslateService
    ) {
        this.formDetalle = FormManager.ConstruirForm(DETALLE_MODIFICACION_FORM, this.translate, this.translate.instant('MODIF.detalle_modificacion'));
        const tipoDocumentoIndex = FormManager.getIndexForm(this.formDetalle, 'tipoDocumento');
        this.formDetalle['campos'][tipoDocumentoIndex]['opciones'] = [
            {
               Id: 1,
               Nombre: 'Acta'
            }
        ];
    }


}
