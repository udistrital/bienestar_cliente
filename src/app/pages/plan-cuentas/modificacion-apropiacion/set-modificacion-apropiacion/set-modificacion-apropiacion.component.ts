import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormManager } from '../../../../@core/managers/formManager';
import { ModApropiacionHelper } from '../../../../@core/helpers/modApropiacionHelper';
import { ModType, ModApropiationData } from '../../../../@core/interfaces/modificationInterface';
import { ArbolRubroApropiacionInterface } from '../../../../@core/interfaces/arbolRubroApropiacionInterface';

@Component({
    selector: 'ngx-set-modificacion-apropiacion',
    templateUrl: './set-modificacion-apropiacion.component.html',
    styleUrls: ['./set-modificacion-apropiacion.component.scss'],
})
export class SetModificacionApropiacionComponent implements OnInit {
    @Input() aprAfectation: Array<ModApropiationData>;
    @Output() aprAfectationChange: EventEmitter<Array<ModApropiationData>> = new EventEmitter();
    @Output() setStepValidationEvent: EventEmitter<any> = new EventEmitter();

    apropiacionFormStruct: any = {
        valid: true,
    };

    modValueFormStruct: any = {
        modType: true,
        credAccount: true,
        value: true,
    };

    modTypes: Array<any>;
    apropiacionValidator: FormGroup;
    showResumenTab: boolean;
    showAprSelection: boolean;
    modValueForm: FormGroup;
    modTypeSelected: ModType;
    accountTypeSelected: string;
    creditAccount: ArbolRubroApropiacionInterface;
    cnCreditAccount: ArbolRubroApropiacionInterface;


    constructor() {

    }
    async ngOnInit() {
        await this.cleanData();
        this.aprAfectation = [];

    }

    public accountSelection(account: string) {
        this.accountTypeSelected = account;
        this.showAprSelection = true;
    }

    public selectRubroElemntEvent($event: ArbolRubroApropiacionInterface) {
        const children = $event.Hijos;
        if (children && children.length === 0) {

            switch (this.accountTypeSelected) {
                case 'credito':
                    this.creditAccount = $event;
                    this.modValueForm.controls['credAccount'].patchValue(`${this.creditAccount.Codigo} / ${this.creditAccount.Nombre}`);
                    break;
                case 'contraCredito':
                    this.cnCreditAccount = $event;
                    this.modValueForm.controls['cnCredAccount'].patchValue(`${this.cnCreditAccount.Codigo} / ${this.cnCreditAccount.Nombre}`);
                    break;

                default:
                    break;
            }
            this.showAprSelection = false;
        }
    }

    public async addModToList() {
        const currentAprData: ModApropiationData = {
            Tipo: this.modValueForm.value['modType'],
            CuentaCredito: this.creditAccount,
            CuentaContraCredito: this.cnCreditAccount ? this.cnCreditAccount : undefined,
            Valor: this.modValueForm.value['value']
        };

        this.aprAfectation.push(currentAprData);
        await this.cleanData();
    }

    public async cleanData() {
        this.showResumenTab = false;
        this.showAprSelection = false;
        this.cnCreditAccount = undefined;
        this.creditAccount = undefined;
        this.apropiacionValidator = FormManager.BuildGroupForm(this.apropiacionFormStruct);
        this.modValueForm = FormManager.BuildGroupForm(this.modValueFormStruct);
        this.modValueForm.controls['credAccount'].disable();
        this.modTypes = await ModApropiacionHelper.getModTypes();
        this.accountTypeSelected = '';

        this.modValueForm.controls['modType'].valueChanges.subscribe((selected: ModType) => {
            this.modTypeSelected = selected;
            if (this.modTypeSelected) {
                if (selected.Params['CuentaContraCredito']) {
                    this.modValueForm = FormManager.addFormControl(this.modValueForm, {
                        cnCredAccount: true,
                    });
                    this.modValueForm.controls['cnCredAccount'].disable();

                } else {
                    this.modValueForm.removeControl('cnCredAccount');
                    this.cnCreditAccount = undefined;
                }
            }
        });

    }

    public getDataEvent() {
        this.setStepValidationEvent.emit(this.aprAfectation);
    }
}
