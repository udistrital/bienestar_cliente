import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Rubro } from '../../../@core/data/models/rubro';
import { ApropiacionHelper } from '../../../@core/helpers/apropiaciones/apropiacionHelper';
import { FuenteHelper } from '../../../@core/helpers/fuentes/fuenteHelper';
import { PopUpManager } from '../../../@core/managers/popUpManager';
import { ArbolApropiacion } from '../../../@core/data/models/arbol_apropiacion';
import { CommonHelper } from '../../../@core/helpers/commonHelper';
import { PlanAdquisicionHelper } from '../../../@core/helpers/plan_adquisicion/planAdquisicionHelper';
import { DependenciaHelper } from '../../../@core/helpers/oikos/dependenciaHelper';
import { registerLocaleData } from '@angular/common';
import locales from '@angular/common/locales/es-CO';
registerLocaleData(locales, 'co');

@Component({
  selector: 'ngx-apropiaciones',
  templateUrl: './apropiaciones.component.html',
  styleUrls: ['./apropiaciones.component.scss'],
})
export class ApropiacionesComponent implements OnInit {

  @Input() vigenciaSeleccionada;
  @Output() eventChange = new EventEmitter();
  vigenciaChange: string;
  rubroSeleccionado: any;
  apropiacionData: ArbolApropiacion;
  apropiacionAprobada: boolean;
  isLeaf: boolean;
  valorApropiacion: number;
  vigenciaSel: any;
  clean = false;
  opcion: string;
  VigenciaActual = '2020';
  optionView: string;
  productos: boolean = false;
  listaProductosAsignados = [];
  vigencias: any[] = [
    { vigencia: 2020 },
    { vigencia: 2019 },
    { vigencia: 2018 },
    { vigencia: 2017 },
    { vigencia: 2016 },
  ];
  balanceado: boolean;
  allApproved: boolean;
  AreaFuncional: string;
  CentroGestor: string;
  planAdquisicionesRubro: any;
  paramsFieldsName: object;
  totalValorActividades: number;
  diferenciaActividadApropiacion: number;
  totalValorFuentes: number;
  diferenciaFuentesApropiacion: number;

  constructor(
    private apHelper: ApropiacionHelper,
    private fuenteHelper: FuenteHelper,
    private commonHelper: CommonHelper,
    private planAdHelper: PlanAdquisicionHelper,
    private popManager: PopUpManager,
    private dependenciaHelper: DependenciaHelper,
  ) {
    this.vigenciaSel = '2020';
    this.optionView = 'Apropiaciones';

    this.rubroSeleccionado = {
      Id: 0,
      Codigo: '',
      Nombre: '',
      Descripcion: '',
      Hijos: '',
      Padre: '',
      ApropiacionInicial: 0,
      UnidadEjecutora: null,
      _id: '',
    };

    this.apropiacionData = {
      Vigencia: 0,
      ValorInicial: 0,
      ApropiacionAnterior: 0,
      Estado: '',
      Rubro: <Rubro>{},
      Codigo: '',
      Nombre: '',
      Descripcion: '',
      UnidadEjecutora: '',
      Padre: '',
      Hijos: [],
      Productos: []
    };

  }


  ngOnInit() {
    this.commonHelper.geCurrentVigencia(1).subscribe(res => {
      if (res) {
        this.vigenciaSel = res + '';
      }
    });
    this.paramsFieldsName = { Vigencia: this.vigenciaSel, UnidadEjecutora: 1 };
  }

  receiveMessage($event) {
    if ($event.Hijos.length === 0) {
      this.isLeaf = true;
      this.rubroSeleccionado = <ArbolApropiacion>$event;
      this.rubroSeleccionado.Id = parseInt(this.rubroSeleccionado.Id, 0);
      this.rubroSeleccionado.Nombre = this.rubroSeleccionado.Nombre;
      this.CentroGestor = '230';
      this.AreaFuncional = '0' + this.rubroSeleccionado.UnidadEjecutora + '-Rector';
      this.rubroSeleccionado.UnidadEjecutora = parseInt(
        this.rubroSeleccionado.UnidadEjecutora,
        0,
      );
      this.rubroSeleccionado.ValorInicial = this.rubroSeleccionado.ValorInicial ? parseInt(this.rubroSeleccionado.ValorInicial, 0) : 0;

      this.valorApropiacion = this.rubroSeleccionado.ValorInicial;
      if (this.rubroSeleccionado.Estado === 'registrada') {
        this.productos = true;
      }
      this.listaProductosAsignados = this.rubroSeleccionado.Productos;
      this.showPlanAdquisicion('2019', this.rubroSeleccionado.Codigo);
    } else {
      this.isLeaf = false;
      this.productos = false;
    }
  }

  showPlanAdquisicion(vigenciaaux, rubroaux) {
    this.planAdHelper.getPlanAdquisicionByRubro(vigenciaaux + '/' + rubroaux).subscribe((res) => {
      if (res) {
        this.planAdquisicionesRubro = res.metas.actividades;
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
            this.dependenciaHelper.get(item.dependencia).subscribe((response) => {
              if (response.Body !== null) {
                item.dependencia = response.Nombre;
              }
            });
          } else {
            item.valor_dependencia = 0;
          }
        });
        this.calcularDiferenciaActividadApropiacion(this.planAdquisicionesRubro);
      }
    });
  }

  calcularDiferenciaActividadApropiacion(plan) {
    const cleanActividades = this.eliminarDuplicados(plan, 'actividad_id');
    this.totalValorActividades = cleanActividades.reduce((sum, current) => sum + current.valor_actividad, 0);
    if (this.rubroSeleccionado.ValorInicial < this.totalValorActividades) {
      this.diferenciaActividadApropiacion = this.totalValorActividades - this.rubroSeleccionado.ValorInicial;
      }
  }

  calcularDiferenciaFuentesApropiacion(plan) {
    const cleanFuentes = this.eliminarDuplicados(plan, 'fuente_financiamiento');
    this.totalValorFuentes = cleanFuentes.reduce((sum, current) => sum + current.valor_fuente_presupuesto, 0);
    if (this.rubroSeleccionado.ValorInicial < this.totalValorFuentes) {
      this.diferenciaFuentesApropiacion = this.totalValorFuentes - this.rubroSeleccionado.ValorInicial;
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

  aprobarApropiacion() {
    this.popManager.showAlert('warning', 'Aprobar Apropiación', 'esta seguro?')
      .then((result) => {
        if (result.value) {
          this.apHelper.apropiacionApprove({ UnidadEjecutora: '1', Vigencia: this.vigenciaSel }).subscribe((res) => {
            if (res) {
              this.popManager.showSuccessAlert('Aprobación exitosa para la apropiación ' + this.vigenciaSel);
              this.cleanForm(true);
              this.eventChange.emit(true);
            }
          });
        }
      },
      );
    this.apropiacionAprobada = true;
  }


  cleanForm(full?: boolean) {
    this.clean = !this.clean;
    this.rubroSeleccionado = {
      Id: 0,
      Codigo: '',
      Nombre: '',
      Descripcion: '',
      Hijos: '',
      Padre: '',
      ApropiacionInicial: 0,
      UnidadEjecutora: null,
      _id: '',
    };
    this.apropiacionData = <ArbolApropiacion>{};
    this.valorApropiacion = 0;
    if (full) {
      this.isLeaf = false;
    }
  }

  preAsignarApropiacion() {
    this.apropiacionData.Vigencia = typeof this.vigenciaSel === 'undefined' ? undefined : parseInt(this.vigenciaSel, 0);
    this.apropiacionData.Codigo = typeof this.rubroSeleccionado.Codigo === 'undefined' ? undefined : this.rubroSeleccionado.Codigo;
    this.apropiacionData.Nombre = typeof this.rubroSeleccionado.Nombre === 'undefined' ? undefined : this.rubroSeleccionado.Nombre;
    this.apropiacionData.Descripcion = typeof this.rubroSeleccionado.Descripcion === 'undefined' ? undefined : this.rubroSeleccionado.Descripcion;
    this.apropiacionData.UnidadEjecutora = typeof this.rubroSeleccionado.UnidadEjecutora === 'undefined' ? undefined : this.rubroSeleccionado.UnidadEjecutora;
    this.apropiacionData.Padre = typeof this.rubroSeleccionado.Padre === 'undefined' ? undefined : this.rubroSeleccionado.Padre;
    this.apropiacionData.Hijos = typeof this.rubroSeleccionado.Hijos === 'undefined' ? undefined : this.rubroSeleccionado.Hijos;
    this.apropiacionData.ValorInicial = typeof this.valorApropiacion === 'undefined' ? undefined : this.valorApropiacion;
    this.apropiacionData.ApropiacionAnterior = typeof this.rubroSeleccionado.ValorInicial === 'undefined' ? 0 : this.rubroSeleccionado.ValorInicial;
    this.apropiacionData.Estado = 'registrada'; // Estado preasignado

    console.table(this.rubroSeleccionado);
    if (this.vigenciaSel !== undefined) {
      this.apHelper.apropiacionRegister(this.apropiacionData).subscribe((res) => {
        if (res) {
          this.popManager.showSuccessAlert('Se registro la preasignación de apropiación correctamente!');
          // this.cleanForm();
          this.eventChange.emit(true);
          this.showPlanAdquisicion('2019', this.rubroSeleccionado.Codigo);
        }
      });
    } else {
      this.popManager.showErrorAlert('Seleccione una vigencia.');
    }


  }

  onSelect(selectedItem: any) {
    this.vigenciaSel = selectedItem;
    // this.eventChange.emit(true);
  }

  checkComprobacion(event: { balanceado: boolean, approved: boolean }) {
    this.balanceado = event.balanceado;
    this.allApproved = event.approved;
  }
  cambioProductosAsignados(productosAsignados: any[]) {
    this.listaProductosAsignados = productosAsignados;
  }

}
