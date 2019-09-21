import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ApropiacionHelper } from '../../../@core/helpers/apropiaciones/apropiacionHelper';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-comprobacion-apropiacion-inicial',
  templateUrl: './comprobacion-apropiacion-inicial.component.html',
  styleUrls: ['./comprobacion-apropiacion-inicial.component.scss'],
})
export class ComprobacionApropiacionInicialComponent implements OnChanges {

  ingresos: number;
  egresos: number;
  balanceado: boolean;
  diferencia: number;
  // entradas y salidas
  @Output() comprobacion = new EventEmitter();
  @Input() vigencia: string;
  @Input() updateSignal: Observable<string[]>;

  constructor(
    private apHelper: ApropiacionHelper,
  ) {
  }

  actualizar() {
    this.apHelper.getRootsBalance(parseInt(this.vigencia, 0)).subscribe(comprobacion => {
      this.ingresos = comprobacion['totalIngresos'];
      this.egresos = comprobacion['totalEgresos'];
      this.balanceado = comprobacion['balanceado'];
      this.diferencia = Math.abs(this.ingresos - this.egresos);
      this.comprobacion.emit(this.balanceado);
    });
  }

  ngOnChanges(changes) {
    if (changes['updateSignal'] && this.updateSignal) {

      this.updateSignal.subscribe(() => {
        this.actualizar();
      });
    }
    if (changes.vigencia !== undefined) {
      if (changes.vigencia.currentValue !== undefined) {
        console.info(changes.vigencia.currentValue);
          this.vigencia = changes.vigencia.currentValue;
          this.actualizar();
      }
    }
  }



}
