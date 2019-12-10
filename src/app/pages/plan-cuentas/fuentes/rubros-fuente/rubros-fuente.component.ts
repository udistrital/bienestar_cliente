import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FuenteHelper } from '../../../../@core/helpers/fuentes/fuenteHelper';
import { DependenciaHelper } from '../../../../@core/helpers/oikos/dependenciaHelper';
import { ApropiacionHelper } from '../../../../@core/helpers/apropiaciones/apropiacionHelper';
import { registerLocaleData } from '@angular/common';
import locales from '@angular/common/locales/es-CO';
registerLocaleData(locales, 'co');

@Component({
  selector: 'ngx-rubros-fuente',
  templateUrl: './rubros-fuente.component.html',
  styleUrls: ['./rubros-fuente.component.scss']
})
export class RubrosFuenteComponent implements OnInit {
  @Output() auxcambiotab = new EventEmitter<boolean>();
  @Input('infoinput') infoinput: any;
  planAdquisicionesFuente: any;

  constructor(private fuenteHelper: FuenteHelper, private dependenciaHelper: DependenciaHelper, private apHelper: ApropiacionHelper) { }

  ngOnInit() {
    this.loadInfoFuente();
  }

  loadInfoFuente() {

    if(this.infoinput.Vigencia > 0){

      this.fuenteHelper.getPlanAdquisicionByFuente('2019', this.infoinput.Codigo).subscribe((res) => {
        if (res) {
          this.planAdquisicionesFuente = res.fuente_financiamiento;
          this.planAdquisicionesFuente.totalPlanAdquisiciones = res.fuente_financiamiento.total_saldo_fuente;
          this.planAdquisicionesFuente.totalSaldoFuente = this.planAdquisicionesFuente.totalPlanAdquisiciones - this.infoinput.ValorActual;
          this.planAdquisicionesFuente.rubros.map((item) => {
            this.dependenciaHelper.get(item.dependencia).subscribe((res) => {
              if (res.Body !== null) {
                item.dependencia = res.Nombre;
              }
            });
            this.apHelper.getFullArbolByNode(item.rubro, this.infoinput.Vigencia).subscribe((res) => {
              if(res){
                item.rubro = res[0].data;             
              }             
          });
          })
        }
      })
    }
    // retirar cuando se tenga la vigencia 2020 de la bodega del plan de adquisiciones y dejar this.infoinput.Vigencia

  }

}
