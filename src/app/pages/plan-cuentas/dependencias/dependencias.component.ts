import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Rubro } from '../../../@core/data/models/rubro';
import { FuenteFinanciamiento } from '../../../@core/data/models/fuente_financiamiento';
import { FORM_VALUE_FUENTE } from '../fuentes/form-value-fuente';
import { registerLocaleData } from '@angular/common';
import locales from '@angular/common/locales/es-CO';
registerLocaleData(locales, 'co');

import { PopUpManager } from '../../../@core/managers/popUpManager';
import { FuenteHelper } from '../../../@core/helpers/fuentes/fuenteHelper';
import { debug } from 'util';
@Component({
  selector: 'ngx-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.scss']
})
export class DependenciasComponent implements OnInit {

  @Output() auxcambiotab = new EventEmitter<boolean>();
  @Output() eventChange = new EventEmitter();
  @Input('infoinput') infoinput: any;
  @Input('paramsFieldsName') paramsFieldsName: object;
  formInfoFuente: any;
  rubroSeleccionado: any;
  optionView: string;
  info_fuente: FuenteFinanciamiento;
  clean = false;
  rubrosAsignados: any = [];
  entrarEditar: boolean;
  totalPermitido: boolean;
  entrarAddProductos: boolean;
  showProduct: boolean;
  rubrosAsociados: any = {};
  productosExample: any = [];
  vigenciaSel: any;
  editValueFF: boolean;
  formValueFuente: any;
  constructor(
    private fuenteHelper: FuenteHelper,
    private popManager: PopUpManager, ) {
    this.editValueFF = false;
    this.vigenciaSel = '2020';
    this.entrarEditar = false;
    this.totalPermitido = true;
    this.entrarAddProductos = false;
    this.showProduct = false;
    this.optionView = 'Apropiaciones';

  }

  ngOnInit() {
    this.formValueFuente = FORM_VALUE_FUENTE;
    this.construirForm();
    console.info(this.infoinput);
  }
  ngOnChanges(changes) {
    if (changes['paramsFieldsName'] && changes['paramsFieldsName'].currentValue) {
      this.paramsFieldsName = changes['paramsFieldsName'].currentValue;
    }
  }
  receiveMessage($event) {
    if (
      this.rubrosAsignados.filter(data => data.Codigo === $event.Codigo)
        .length === 0 && $event.Hijos.length === 0
    ) {
      // this.fuenteHelper.getFuentes(this.infoinput.Codigo);
      this.rubroSeleccionado = <Rubro>$event;
      console.info(this.infoinput);
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

  guardarValorFuenteRubro() {
    this.infoinput.Rubros[this.rubroSeleccionado.Codigo].ValorTotal =
      typeof this.rubroSeleccionado.ValorFuenteRubro === 'undefined' ? undefined : this.rubroSeleccionado.ValorFuenteRubro;
      this.infoinput.ValorInicial = this.infoinput.ValorInicial === 'undefined' ? undefined : this.infoinput.ValorInicial - this.rubroSeleccionado.ValorFuenteRubro;
    this.fuenteHelper.fuenteUpdate(this.infoinput).subscribe((res) => {
      if (res) {
        this.popManager.showSuccessAlert('Se actualizo la Fuente correctamente!');
        this.cambiarValorFuente();
      }
    });

  }
  validarEdicion(rubro: any) {
    if (rubro.Codigo.ValorFuenteApropiacion === undefined) {
      return false;
    }
    return !this.entrarEditar && rubro.Codigo.ValorFuenteApropiacion > 0;
  }
  entrandoEditar(tipo: string) {

    switch (tipo) {
      case 'valor_fuente_rubro':
        this.entrarEditar = true;
        break;
      case 'dependencia':
        break;
    }
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
  cambiarValorFuente() {
    this.construirForm();
    this.editValueFF = !this.editValueFF;
  }
  validarForm(event) {
    console.info(event);
    console.info(this.infoinput);
    if (event.valid) {
      this.infoinput.Vigencia = event.data.FuenteFinanciamiento.Vigencia.vigencia === 'undefined' ? undefined : event.data.FuenteFinanciamiento.Vigencia.vigencia;
      this.infoinput.ValorInicial = typeof event.data.FuenteFinanciamiento.ValorInicial === 'undefined' ? undefined : event.data.FuenteFinanciamiento.ValorInicial;
      this.infoinput.ValorActual = typeof event.data.FuenteFinanciamiento.ValorInicial === 'undefined' ? undefined : event.data.FuenteFinanciamiento.ValorInicial;
      this.infoinput.UnidadEjecutora = typeof this.infoinput.UnidadEjecutora === 'undefined' ? undefined : this.infoinput.UnidadEjecutora;
      this.infoinput.NumeroDocumento = typeof event.data.FuenteFinanciamiento.NumeroDocumento === 'undefined' ? undefined : event.data.FuenteFinanciamiento.NumeroDocumento;
      this.infoinput.TipoDocumento = typeof event.data.FuenteFinanciamiento.TipoDocumento.Nombre === 'undefined' ? undefined : event.data.FuenteFinanciamiento.TipoDocumento.Nombre;
      console.info(this.infoinput);
      this.fuenteHelper.fuenteRegister(this.infoinput).subscribe((res) => {
        if (res) {
          this.popManager.showSuccessAlert('Se actualizo la Fuente correctamente!');
          this.auxcambiotab.emit(false);
          this.activetab('other');
          this.cambiarValorFuente();
        }
      });
    } else {
      this.popManager.showErrorAlert('Datos Incompletos!');
    }
  }

  activetab(tab): void {
    if (tab === 'other') {
      this.auxcambiotab.emit(false);
    }
  }

  loadOptionsVigencia(): void {
    const aplicacion: Array<any> = [
      { Id: 1, vigencia: 2018 },
      { Id: 2, vigencia: 2019 },
      { Id: 3, vigencia: 2020 }];
      this.formValueFuente.campos[this.getIndexForm('Vigencia')].opciones = aplicacion;
    }
    getIndexForm(nombre: String): number {
      for (let index = 0; index < this.formValueFuente.campos.length; index++) {
        const element = this.formValueFuente.campos[index];
        if (element.nombre === nombre) {
          return index;
      }
    }
    return 0;
  }

  construirForm() {
    this.loadOptionsVigencia();
    for (let i = 0; i < this.formValueFuente.campos.length; i++) {
      this.formValueFuente.campos[i].label = this.formValueFuente.campos[i].label_i18n;
      this.formValueFuente.campos[i].placeholder = this.formValueFuente.campos[i].label_i18n;
    }
  }
}


