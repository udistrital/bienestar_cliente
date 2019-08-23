import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApropiacionHelper } from '../../../helpers/apropiaciones/apropiacionHelper';

@Component({
  selector: 'ngx-comprobacion-apropiacion-inicial',
  templateUrl: './comprobacion-apropiacion-inicial.component.html',
  styleUrls: ['./comprobacion-apropiacion-inicial.component.scss'],
})
export class ComprobacionApropiacionInicialComponent implements OnInit {

  ingresos: number;
  egresos: number;
  balanceado: boolean;
  // entradas y salidas
  @Output() comprobacion = new EventEmitter();

  constructor(
    private apHelper: ApropiacionHelper,
  ) {
  }
  ngOnInit() {
    const {totalIncomes, totalExpenses } = this.apHelper.getRootsBalance();
    this.ingresos = totalIncomes;
    this.egresos = totalExpenses;
    this.balanceado = (this.ingresos === this.egresos);
    this.comprobacion.emit(this.balanceado);
  }



}
