import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FORM_INFO_EXPEDIR_CRP } from './form-expedir_crp';
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
    @Input() docPresupuestalCdp: any = null;
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
        private movimientosHelper: MovimientosHelper
    ) {}

    ngOnInit() {
        console.info(this.rubros);
        const vigencia = String(this.docPresupuestalCdp.Vigencia);
        const centroGestor = this.docPresupuestalCdp.CentroGestor;
        const idDoc = this.docPresupuestalCdp._id;
        this.movimientosHelper.getByDocumentoPresupuestal(vigencia, centroGestor, idDoc).subscribe((res: any) => {
            res.forEach((movimiento: any) => {
                this.rubrosMap[movimiento.Padre] = movimiento;
            });
        });
    }

    agregarInfoRubros() {
        this.rubros.forEach(element => {

        });
    }

    onKey(rubro: string) {
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
        const rubrosArray = Object.values(this.rubrosMap);

        for (let i = 0; i < rubrosArray.length; i++) {
            if (rubrosArray[i]['ValorAsignado'] > rubrosArray[i]['ValorActual']) {
                this.formMessage = `El valor ingresado en el rubro ${rubro.Padre} no debe ser mayor al asignado en el CDP expedido`;
                this.formError = true;
                return true;
            }
        }

        if (valor > this.solicitudCrp.valor) {
            this.formMessage = `El valor ingresado en el rubro ${rubro.Padre} no debe ser mayor al valor de la solicitud de CRP`;
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

        Object.values(this.rubrosMap).forEach((rubro: any) => {
            this.movimiento.AfectacionMovimiento.push(
                {
                    MovimientoProcesoExternoId: {
                        TipoMovimientoId: {
                            Id: 7,
                            Acronimo: 'rp'
                        }
                    },
                    DocumentoPadre: rubro._id,
                    Valor: rubro.ValorAsignado,
                    Descripcion: 'Expedición CRP'
                },

            );
        });
    }
}
