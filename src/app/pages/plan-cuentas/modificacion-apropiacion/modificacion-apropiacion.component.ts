import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
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
    setModValidationForm: FormGroup;
    previusStepIndex: number;
    modifiactionFinalData: object;
    checkAfectationFinalData: object;
    clean: boolean = false;
    options = [
        { value: 'apropiacion', label: 'Apropiación' },
        { value: 'fuente', label: 'Fuente de Financiamiento' }
      ];
      option = { value:'', label: ''};
    @Output() saved: EventEmitter<boolean> = new EventEmitter();

    ngOnInit() {
        this.detalleValidationForm = new FormGroup({
            valid: new FormControl(null, Validators.required),
        });
        this.setModValidationForm = new FormGroup({
            valid: new FormControl(null, Validators.required),
        });
        this.linearMode = true;
        this.formDetalleValidFlag = false;
        this.previusStepIndex = 0;
        this.modifiactionFinalData = {};
    }

    ngOnDestroy() {
        this.detalleValidationForm = new FormGroup({
            valid: new FormControl(null, Validators.required),
        });
        this.setModValidationForm = new FormGroup({
            valid: new FormControl(null, Validators.required),
        });
        this.linearMode = true;
        this.formDetalleValidFlag = false;
        this.previusStepIndex = 0;
        this.modifiactionFinalData = {};
        this.clean = true;
    }



    constructor(
        private translate: TranslateService,
        private docHelper: DocumentHelper,
    ) {
        this.formDetalle = FormManager.ConstruirForm(DETALLE_MODIFICACION_FORM, this.translate, this.translate.instant('MODIF.detalle_modificacion'));
        const tipoDocumentoIndex = FormManager.getIndexForm(this.formDetalle, 'TipoDocumento');
        this.formDetalle['campos'][tipoDocumentoIndex]['opciones'] = this.docHelper.getDocumentType();
    }

    public detalleValidator($event) {
        if ($event.valid && $event.valid === true) {
            this.detalleValidationForm.patchValue({
                valid: true
            });
            this.modifiactionFinalData['detail'] = $event.data['detalleModificacion'];
            this.stepper.next();
        } else {
            this.detalleValidationForm.patchValue({
                valid: null,
            });
            if (this.stepper.selectedIndex > this.previusStepIndex) {
                this.stepper.selectedIndex = this.previusStepIndex;
            }
        }
    }

    public onStepChange($event) {
        setTimeout(() => {
            this.previusStepIndex = <number>$event['previouslySelectedIndex'];
            switch (this.previusStepIndex) {
                case 0:
                    this.formDetalleValidFlag = !this.formDetalleValidFlag;
                    break;
                case 1:
                    console.info($event);
                case 2:
                    this.setSteppValidator(this.checkAfectationFinalData);
                    break;
                default:
                    break;
            }
        });
    }

    public setSteppValidator($event: object) {
        setTimeout(() => {
            if ($event) {
                this.checkAfectationFinalData = $event;
                if (this.checkAfectationFinalData['afectation']) {
                    this.modifiactionFinalData['afectation'] = this.checkAfectationFinalData['afectation'];
                    if (this.checkAfectationFinalData['afectation'].length > 0 && this.checkAfectationFinalData['balanced'] && this.checkAfectationFinalData['balanced'] === true) {
                        this.setModValidationForm.patchValue({
                            valid: true
                        });
                        if (this.checkAfectationFinalData['changeStep']) {
                            this.stepper.next();
                        }
                    } else {
                        this.setModValidationForm.patchValue({
                            valid: null
                        });

                    }
                }

            }
        });

    }

    onSaved($event) {
        this.saved.emit(true);
    }

    public nextStep() {
        this.stepper.next();
    }


}
