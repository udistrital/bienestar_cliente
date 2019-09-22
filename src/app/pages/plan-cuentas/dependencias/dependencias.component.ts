import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Rubro } from '../../../@core/data/models/rubro';
import { FuenteFinanciamiento } from '../../../@core/data/models/fuente_financiamiento';
import { DependenciaHelper } from '../../../@core/helpers/oikos/dependenciaHelper';

import { PopUpManager } from '../../../@core/managers/popUpManager';
@Component({
  selector: 'ngx-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.scss']
})
export class DependenciasComponent implements OnInit {

  @Output() auxcambiotab = new EventEmitter<boolean>();
  formInfoFuente: any;
  rubroSeleccionado: any;
  optionView: string;
  info_fuente: FuenteFinanciamiento;
  clean = false;
  rubrosAsignados: any = [];
  dependencias: any = [];
  dependenciasAsociadas: any = {};
  dependenciasAsignadas: any;
  dependenciaSeleccionada: any = [];
  entrarEditar: boolean;
  totalPermitido: boolean;
  entrarAddProductos: boolean;
  showProduct: boolean;
  rubrosAsociados: any = {};
  productosExample: any = [];
  constructor(
    private dependenciaHelper: DependenciaHelper,
    private popManager: PopUpManager, ) {
    this.entrarEditar = false;
    this.totalPermitido = true;
    this.entrarAddProductos = false;
    this.showProduct = false;
    this.optionView = 'Apropiaciones';
    this.dependenciaHelper.get().subscribe((res: any) => {
      console.info(res);
      this.dependencias = res;
    });
    this.dependenciaSeleccionada[0] = {
      Id: 0,
      ValorDependencia: 0,
    };
  }

  ngOnInit() {
  }

  receiveMessage($event) {
    if (
      this.rubrosAsignados.filter(data => data.Codigo === $event.Codigo)
        .length === 0 && $event.Hijos.length === 0
    ) {
      $event['Dependencias'] = [{ Id: 0, ValorDependencia: 0 }];
      // $event['Productos'] = this.productosExample;
      // console.info($event);
      this.rubrosAsignados = [...this.rubrosAsignados, $event];
      this.rubrosAsociados[$event.Codigo] = {
        Dependencias: [],
        Productos: [],
      };
    }
  }

  asignarDependencia($event: any, rubro: Rubro, dependencias: any, index: number) {
    this.rubrosAsignados.filter(data => {
      data === rubro;
      data['Dependencias'].push({ Id: 0, ValorDependencia: 0 });
    });
    console.info(dependencias);
    this.rubrosAsociados[rubro.Codigo].Dependencias[index] = dependencias;
    this.entrarEditar = true;
    this.validarLimiteApropiacion(rubro);
    this.entrarAddProductos = true;
    console.info(this.rubrosAsociados);
  }
  editarDependencia($event: any, rubro: Rubro, dependencias: any, index: number) {
    console.info(dependencias);
    this.rubrosAsociados[rubro.Codigo].Dependencias[index] = dependencias;
    this.entrarEditar = false;
    this.validarLimiteApropiacion(rubro);
    console.info(this.rubrosAsociados);
  }
  validarLimiteApropiacion(rubro: Rubro) {
    const totalDep = this.rubrosAsociados[rubro.Codigo].Dependencias.reduce(
      (total, dep) => total + (dep.ValorDependencia || 0), 0);
    this.totalPermitido = totalDep <= rubro.ApropiacionInicial;
    console.info(totalDep);
    if (!this.totalPermitido) {
      this.popManager.showErrorAlert('Valor Excedido Apropiación' + ' para el Rubro ' + rubro.Nombre);
    }
  }
  validarEdicionDependencias(rubro: Rubro, dependencias: any, index: number) {
    if (this.rubrosAsociados[rubro.Codigo].Dependencias[index] === undefined) {
      return false;
    }
    return !this.entrarEditar && this.rubrosAsociados[rubro.Codigo].Dependencias[index].Id > 0;
  }
  entrandoEditar(dep) {
    this.dependenciaSeleccionada = dep;
    this.entrarEditar = true;
  }
  quitarRubro(rubro: Rubro) {
    this.rubrosAsignados = this.rubrosAsignados.filter(p => {
      return JSON.stringify(p) !== JSON.stringify(rubro);
    });

    const prop = rubro.Codigo;
    // console.info(prop);
    delete this.rubrosAsociados[prop];
    // console.info(this.rubrosAsociados);
  }

  activetab(tab): void {
    if (tab === 'other') {
      this.auxcambiotab.emit(false);
    }
  }
}
