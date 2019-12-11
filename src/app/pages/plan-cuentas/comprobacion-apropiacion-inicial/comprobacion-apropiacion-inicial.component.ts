import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ApropiacionHelper } from '../../../@core/helpers/apropiaciones/apropiacionHelper';
import { Observable } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import locales from '@angular/common/locales/es-CO';
registerLocaleData(locales, 'co');

@Component({
  selector: 'ngx-comprobacion-apropiacion-inicial',
  templateUrl: './comprobacion-apropiacion-inicial.component.html',
  styleUrls: ['./comprobacion-apropiacion-inicial.component.scss'],
})
export class ComprobacionApropiacionInicialComponent implements OnChanges {

  ingresos: number;
  egresos: number;
  balanceado: boolean;
  approved: boolean;
  diferencia: number;
  // entradas y salidas
  @Output() comprobacion = new EventEmitter();
  @Input() vigencia: string;
  @Input() updateSignal: Observable<string[]>;
  @Input() afectationData: Array<any>;

  constructor(
    private apHelper: ApropiacionHelper
  ) {
  }

  actualizar() {
    const afectationObject = {
      Afectation: this.afectationData,
    };
    this.apHelper.getRootsBalance(parseInt(this.vigencia, 0), afectationObject).subscribe(comprobacion => {
      if (comprobacion) {
        this.ingresos = comprobacion['totalIngresos'];
        this.egresos = comprobacion['totalGastos'];
        this.balanceado = comprobacion['balanceado'];
        this.diferencia = Math.abs(this.ingresos - this.egresos);
        this.approved = comprobacion['approved'];
        this.comprobacion.emit({
          balanceado: this.balanceado,
          approved: this.approved,
          clean: true,
        });
      } else {
        if (this.afectationData && this.afectationData.length > 0) {
          this.afectationData.pop();
        }
        this.comprobacion.emit({
          balanceado: this.balanceado,
          approved: this.approved,
          clean: false,
        });
      }
    });
  }

  ngOnChanges(changes) {
    console.info('changeeeee', changes);

    if (changes['updateSignal'] && this.updateSignal) {
      this.updateSignal.subscribe(() => {
        this.actualizar();
      });
    }
    if (changes['afectationData']) {
      this.afectationData = changes['afectationData'].currentValue;
      this.actualizar();
    }
    if (changes.vigencia !== undefined) {
      if (changes.vigencia.currentValue !== undefined) {
        this.vigencia = changes.vigencia.currentValue;
        this.actualizar();
      }
    }
  }



}
