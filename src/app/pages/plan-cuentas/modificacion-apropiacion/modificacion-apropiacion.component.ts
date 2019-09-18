import { Component, OnInit } from '@angular/core';
import { DETALLE_MODIFICACION_FORM } from './detalle_modificacion_form';

@Component({
    selector: 'ngx-modificacion-apropiacion',
    templateUrl: './modificacion-apropiacion.component.html',
    styleUrls: ['./modificacion-apropiacion.component.scss'],
})
export class ModificacionApropiacionComponent implements OnInit {
    ngOnInit() { }
    formDetalle: object;
    constructor(
    ) {
        this.formDetalle = DETALLE_MODIFICACION_FORM;
    }


}
