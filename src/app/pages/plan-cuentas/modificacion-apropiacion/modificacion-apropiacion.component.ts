import { Component, OnInit, ViewChild } from '@angular/core';
import { DETALLE_MODIFICACION_FORM } from './detalle_modificacion_form';
import { FormManager } from '../../../@core/managers/formManager';
import { TranslateService } from '@ngx-translate/core';
import { DocumentHelper } from '../../../@core/helpers/documentHelper';
import { MatStepper } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'ngx-modificacion-apropiacion',
    templateUrl: './modificacion-apropiacion.component.html',
    styleUrls: ['./modificacion-apropiacion.component.scss'],
})
export class ModificacionApropiacionComponent implements OnInit {
    @ViewChild('stepper', { static: true }) stepper: MatStepper;

    formDetalle: object;
    detalleMovimiento: any;

    linearMode: boolean;
    formDetalleValidFlag: boolean;

    detalleValidationForm: FormGroup;
    previusStepIndex: number;
    ngOnInit() {
        this.detalleValidationForm = new FormGroup({
            valid: new FormControl(null, Validators.required),
        });
        this.linearMode = true;
        this.formDetalleValidFlag = false;
        this.previusStepIndex = 0;
    }



    constructor(
        private translate: TranslateService,
        private docHelper: DocumentHelper,
    ) {
        this.formDetalle = FormManager.ConstruirForm(DETALLE_MODIFICACION_FORM, this.translate, this.translate.instant('MODIF.detalle_modificacion'));
        const tipoDocumentoIndex = FormManager.getIndexForm(this.formDetalle, 'tipoDocumento');
        this.formDetalle['campos'][tipoDocumentoIndex]['opciones'] = this.docHelper.getDocumentType();
    }

    public detalleValidator($event) {
        if ($event.valid && $event.valid === true) {
            this.detalleValidationForm.patchValue({
                valid: true
            });
            this.stepper.next();
        } else {
            this.stepper.selectedIndex = this.previusStepIndex;
        }
    }

    public onStepChange($event) {
        setTimeout(() => {
            this.previusStepIndex = <number>$event['previouslySelectedIndex'];
            switch (this.previusStepIndex) {
                case 0:
                    this.formDetalleValidFlag = !this.formDetalleValidFlag;
                    break;
                default:
                    break;
            }
        });
    }


}
