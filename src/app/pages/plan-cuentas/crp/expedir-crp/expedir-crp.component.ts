import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FORM_INFO_EXPEDIR_CRP } from './form-expedir_crp';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { FormManager } from '../../../../@core/managers/formManager';
import { TranslateService } from '@ngx-translate/core';
import { NumberCardModule } from '@swimlane/ngx-charts';
import { MovimientosHelper } from '../../../../@core/helpers/movimientos/movimientosHelper';

@Component({
    selector: 'ngx-expedir-crp',
    templateUrl: './expedir-crp.component.html',
    styleUrls: ['./expedir-crp.component.scss']
  })
export class ExpedirCrpComponent implements OnInit {
    @Input() rubros: any = null;
    @Input() solicitudCdp: any = null;
    @Input() solicitudCrp: any = null;
    @Output() buildMovimiento: EventEmitter<any> = new EventEmitter<any>();

    movimiento: any = null;
    form: any = FORM_INFO_EXPEDIR_CRP;
    infoForm: any;
    formGroup = new FormGroup({
        value: new FormControl
    });
    rubrosMap = {};
    valorRubro: number;
    formError = false;
    formMessage = '';

    constructor(
        private translate: TranslateService,
        private popUpManager: PopUpManager
    ) {}

    ngOnInit() {
        this.rubros.forEach((rubro: any) => this.rubrosMap[rubro.RubroId] = rubro);
    }

    onKey(event: any, rubro: string) {
        this.rubrosMap[rubro].ValorAsignado = this.formGroup.value.value;
        const error = this.validarValorIngresado(this.rubrosMap[rubro]);
        if (!error) {
            this.construirDatosMovimiento();
        } else {
            this.movimiento = null;
        }
        this.buildMovimiento.emit(this.movimiento);
    }

    private validarValorIngresado(rubro: any): boolean {
        const valor = this.formGroup.value.value;
        const valorTotal = Object.values(this.rubrosMap).reduce((acc, _rubro: any) => acc + _rubro.ValorAsignado, 0);
        if (valor > this.solicitudCrp.valor) {
            this.formMessage = `El valor ingresado en el rubro ${rubro.RubroId} no debe ser mayor al valor de la solicitud de CRP`;
            this.formError = true;
            return true;
        } else if (valorTotal > this.solicitudCrp.valor) {
            this.formMessage = `El valor total ingresado no debe ser mayor al valor de la solicitud de CRP`;
            this.formError = true;
            return true;
        } else if (valorTotal !== this.solicitudCrp.valor) {
            this.formError = false;
            return true;
        }
        console.info('todo bien')
        this.formError = false;
        return false;
    }

    private construirDatosMovimiento() {
        this.movimiento = {
          Data: { 'solicitud_crp': this.solicitudCrp['_id'] },
          Tipo: 'rp',
          Vigencia: 2019,
          CentroGestor: this.solicitudCdp['centroGestor'],
          AfectacionMovimiento: []
        };

        Object.values(this.rubrosMap).forEach((rubro: any, index) => {
            this.movimiento.AfectacionMovimiento.push(
                {
                    MovimientoProcesoExternoId: {
                        TipoMovimientoId: {
                            Id: 7,
                            Acronimo: 'rp'
                        }
                    },
                    DocumentoPadre: this.solicitudCdp['movimiento_cdp'][index],
                    Valor: rubro.ValorAsignado,
                    Descripcion: 'Expedición CRP'
                },

            );
        });
    }
}
