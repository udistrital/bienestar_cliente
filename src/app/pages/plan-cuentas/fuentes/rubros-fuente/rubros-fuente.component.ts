import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FuenteHelper } from '../../../../@core/helpers/fuentes/fuenteHelper';
import { DependenciaHelper } from '../../../../@core/helpers/oikos/dependenciaHelper';
import { ApropiacionHelper } from '../../../../@core/helpers/apropiaciones/apropiacionHelper';
import { ArbolRubroApropiacionInterface } from '../../../../@core/interfaces/arbolRubroApropiacionInterface';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
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
  openViewAddIncome: boolean;
  paramsFieldsName: object;
  incomeRubroAdd: ArbolRubroApropiacionInterface;
  rbIncome: ArbolRubroApropiacionInterface;

  constructor(private translate: TranslateService,
    private fuenteHelper: FuenteHelper,
    private dependenciaHelper: DependenciaHelper,
    private apHelper: ApropiacionHelper,
    private pUpManager: PopUpManager) { }

  ngOnInit() {
    this.openViewAddIncome = false;
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
      this.loadInfoIncome();
      this.fuenteHelper.getPlanAdquisicionByFuente(this.infoinput.Vigencia, this.infoinput.Codigo).subscribe((res) => {
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

  }

  loadInfoIncome(Codigo?: string) {
    if (this.infoinput.Rubros && !Codigo) {
      for (const key in this.infoinput.Rubros) {
        const element = this.infoinput.Rubros[key];
        if (element.Tipo === 'INGRESO') {
          this.apHelper.getFullArbolByNode(key, this.infoinput.Vigencia).subscribe((response) => {
            if (response) {
              this.rbIncome = response[0].data;
              console.info(this.rbIncome);
            }
          })
        }
      }
    }
    else {
      this.apHelper.getFullArbolByNode(Codigo, this.infoinput.Vigencia).subscribe((response) => {
        if (response) {
          this.rbIncome = response[0].data;
        }
      })
    }
  }

  openAddIncome() {
    this.paramsFieldsName = { Codigo: '2' };
    this.openViewAddIncome = true;
  }
  selectRubroElemntEvent($event) {
    const children = $event.Hijos;
    if (children && children.length === 0) {
      this.incomeRubroAdd = $event;
      if (this.infoinput.Rubros) {
        for (const key in this.infoinput.Rubros) {
          const element = this.infoinput.Rubros[key];
          if (element.Tipo === 'INGRESO') {
            delete this.infoinput.Rubros[key];
          }
        }
      }
      this.infoinput.Rubros[this.incomeRubroAdd.Codigo] = { Tipo: 'INGRESO' };
      this.fuenteHelper.fuenteUpdate(this.infoinput).subscribe((res) => {
        if (res) {
          this.pUpManager.showSuccessAlert("se asigno el ingreso correctamente");
          this.loadInfoIncome(this.incomeRubroAdd.Codigo);
        }
      })
      this.openViewAddIncome = false;
    }
  }

}
