import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApropiacionHelper } from '../../../../@core/helpers/apropiaciones/apropiacionHelper';
import { CommonHelper } from '../../../../@core/helpers/commonHelper';
import { PlanAdquisicionHelper } from '../../../../@core/helpers/plan_adquisicion/planAdquisicionHelper';
import { FuenteHelper } from '../../../../@core/helpers/fuentes/fuenteHelper';
import { DependenciaHelper } from '../../../../@core/helpers/oikos/dependenciaHelper';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'ngx-plan-adquisiciones-rubro',
  templateUrl: './plan-adquisiciones-rubro.component.html',
  styleUrls: ['./plan-adquisiciones-rubro.component.scss'],
})
export class PlanAdquisicionesRubroComponent implements OnInit {

  @Input() rubroSeleccionado : any;
  @Input() ayuda :string;
  @Input() vigenciaSel :number;
  @Output() eventChange = new EventEmitter();

  planAdquisicionesRubro: any ;
  totalValorActividades: number;
  diferenciaActividadApropiacion: number;
  totalValorFuentes: number;
  diferenciaFuentesApropiacion: number;

  constructor(
    private apHelper: ApropiacionHelper,
    private planAdHelper: PlanAdquisicionHelper,
    private commonHelper: CommonHelper,
    private popManager: PopUpManager,
    private fuenteHelper: FuenteHelper,
    private dependenciaHelper: DependenciaHelper,
  ) {

  }

  ngOnInit() {
  }
  ngOnChanges(){
    if(this.rubroSeleccionado.Codigo) this.showPlanAdquisicion(this.vigenciaSel,this.rubroSeleccionado.Codigo)
  }

  isPlanAdquisiciones(boolean){
    this.eventChange.emit(boolean);
  }

  showPlanAdquisicion(vigenciaaux, rubroaux) {
    this.planAdHelper.getPlanAdquisicionByRubro(vigenciaaux + '/' + rubroaux).subscribe((res) => {
      if (res.metas.actividades) {
        this.planAdquisicionesRubro = res.metas.actividades;
        this.isPlanAdquisiciones(true);
        this.planAdquisicionesRubro.map((item) => {
          item.valor_fuente_presupuesto = parseFloat('0');
          item.valor_actividad = parseFloat(item.valor_actividad);

          if (item.fuente_financiamiento !== null) {
            this.fuenteHelper.getFuentes(item.fuente_financiamiento, { Vigencia: 2019, UnidadEjecutora: 1 }).subscribe((response) => {
              if (response.Body !== null) {
                item.fuente_financiamiento_nombre = response.Nombre;
                item.valor_fuente_presupuesto = parseFloat(response.ValorInicial);
              }
              item.valor_dependencia = parseFloat(item.valor_fuente_financiamiento);
              this.calcularDiferenciaFuentesApropiacion(this.planAdquisicionesRubro);
            });
            if(String(item.dependencia) === "0") {
              item.dependencia = "Funcionamiento: dependencias en general"
            }else {
              this.dependenciaHelper.get(item.dependencia).subscribe((response) => {
                if (response.Body !== null) {
                  item.dependencia = response.Nombre;
                }
              });
            }
          } else {
            item.valor_dependencia = 0;
          }
        });
        this.calcularDiferenciaActividadApropiacion(this.planAdquisicionesRubro);
      } else { this.isPlanAdquisiciones(false); }
    });
  }

  calcularDiferenciaFuentesApropiacion(plan) {
    const cleanFuentes = this.eliminarDuplicados(plan, 'fuente_financiamiento');
    this.totalValorFuentes = cleanFuentes.reduce((sum, current) => sum + current.valor_fuente_presupuesto, 0);
    if (this.rubroSeleccionado.ValorInicial < this.totalValorFuentes) {
      this.diferenciaFuentesApropiacion = this.totalValorFuentes - this.rubroSeleccionado.ValorInicial;
    }
  }

  calcularDiferenciaActividadApropiacion(plan) {
    const cleanActividades = this.eliminarDuplicados(plan, 'actividad_id');
    this.totalValorActividades = cleanActividades.reduce((sum, current) => sum + current.valor_actividad, 0);
    if (this.rubroSeleccionado.ValorInicial < this.totalValorActividades) {
      this.diferenciaActividadApropiacion = this.totalValorActividades - this.rubroSeleccionado.ValorInicial;
      }
  }

  eliminarDuplicados(arr, comp) {
    const unique = arr
      .map(e => e[comp])
      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);
    return unique;
  }
}