import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FuenteHelper } from '../../../../@core/helpers/fuentes/fuenteHelper';
import { DependenciaHelper } from '../../../../@core/helpers/oikos/dependenciaHelper';
import { ApropiacionHelper } from '../../../../@core/helpers/apropiaciones/apropiacionHelper';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData, CurrencyPipe } from '@angular/common';
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
  settings: object;
  listColumns: object;
  source: Array<any>;

  constructor(private translate: TranslateService,
    private fuenteHelper: FuenteHelper,
    private dependenciaHelper: DependenciaHelper, private apHelper: ApropiacionHelper) { }

  ngOnInit() {
    this.loadInfoFuente();
    this.loadMovimientos();
  }

  loadMovimientos() {
    if (this.infoinput.Movimientos !== undefined) {
      
      const data: Array<any> = [];
      for (let [key, value] of Object.entries(this.infoinput.Movimientos)) {
          let movFormated: any;
          movFormated = {
            Movimiento: key,
            Valor: value
          }
          data.push(movFormated);
      }

      this.source = data;
      this.listColumns = {
        
        
        Movimiento: {
          title: this.translate.instant('GLOBAL.movimiento'),
          valuePrepareFunction: (value) => this.translate.instant('GLOBAL.' + value),
        },
        Valor: {
          title: this.translate.instant('GLOBAL.valor'),
          type: 'html',
          valuePrepareFunction: function (value) {
            return `<div class="customformat"> ` + new CurrencyPipe('co').transform(value, 'COP', 'symbol', '4.2-2', 'co') + `</div>`;
          },
        }
      };
      
      this.settings = {
        actions: {
          add: false,
          edit: false,
          delete: false,
          position: 'right'
        },
        add: {
          addButtonContent: '<i title="Nueva Modificación" class="nb-plus"></i>',
          createButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>'
        },
        mode: 'external',
        columns: this.listColumns,
      };
    }
  }
  loadInfoFuente() {

    if (this.infoinput.Vigencia > 0) {

      this.fuenteHelper.getPlanAdquisicionByFuente('2019', this.infoinput.Codigo).subscribe((res) => {
        if (res) {
          this.planAdquisicionesFuente = res.fuente_financiamiento;
          this.planAdquisicionesFuente.totalPlanAdquisiciones = res.fuente_financiamiento.total_saldo_fuente;
          this.planAdquisicionesFuente.totalSaldoFuente = this.infoinput.ValorActual - this.planAdquisicionesFuente.totalPlanAdquisiciones;
          this.planAdquisicionesFuente.rubros.map((item) => {
            this.dependenciaHelper.get(item.dependencia).subscribe((res) => {
              if (res.Body !== null) {
                item.dependencia = res.Nombre;
              }
            });
            this.apHelper.getFullArbolByNode(item.rubro, this.infoinput.Vigencia).subscribe((res) => {
              if (res) {
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
