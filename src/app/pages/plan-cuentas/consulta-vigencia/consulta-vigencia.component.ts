import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Rubro } from '../../../@core/data/models/rubro';
import { ApropiacionHelper } from '../../../@core/helpers/apropiaciones/apropiacionHelper';
import { CommonHelper } from '../../../@core/helpers/commonHelper';
import { ArbolApropiacion } from '../../../@core/data/models/arbol_apropiacion';
import { PopUpManager } from '../../../@core/managers/popUpManager';

@Component({
  selector: 'ngx-consulta-vigencia',
  templateUrl: './consulta-vigencia.component.html',
  styleUrls: ['./consulta-vigencia.component.scss'],
})
export class ConsultaVigenciaComponent implements OnInit {

  @Input() vigenciaSeleccionada;
  @Output() eventChange = new EventEmitter();

  vigenciaChange: string;
  rubroSeleccionado: any;
  apropiacionData: ArbolApropiacion;
  valorApropiacion: number;
  vigenciaSel: any;
  clean = false;
  opcion: string;
  VigenciaActual = '';
  strVigenciaActual = '';
  optionView: string;
  balanceado: boolean;
  vigencias: any[];
  CentroGestor: string;
  AreaFuncional: string;
  viewOption: string;
  tabPlanAdquisicionesRubro : boolean;

  constructor(
    private apHelper: ApropiacionHelper,
    private commonHelper: CommonHelper,
    private popManager: PopUpManager,
  ) {
    this.optionView = 'ApropiacionesEstado';

    this.cleanAprData();
  }

  cleanAprData() {
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
      ValorInicial: 0,
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
    this.apHelper.getVigenciasList().subscribe(res => {
      if (res) {
        this.vigencias = res;
      }
    });
    this.commonHelper.geCurrentVigencia().subscribe(res => {
      if (res) {
        this.vigenciaSel       = res + '';
        this.strVigenciaActual = this.vigenciaSel;
      }
    });
    this.tabPlanAdquisicionesRubro = false;
  }

  onSelect(selectedItem: any) {
    this.vigenciaSel = selectedItem;
  }

  changeView(viewOptionValue: string) {
    this.optionView = viewOptionValue;
    this.cleanAprData();
  }

  receiveMessage($event) {
    this.rubroSeleccionado = <Rubro>$event;
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
    this.tabPlanAdquisicionesRubro = true;
  }
  receiveMessagePlan($event) {
    this.tabPlanAdquisicionesRubro = $event;
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
    this.apropiacionData.Estado = 'registrada'; /*TODO: Agregar a traducciones -- estado preasignado*/

    if (this.vigenciaSel !== undefined) {
      this.apHelper.apropiacionRegister(this.apropiacionData).subscribe((res) => {
        if (res) {
          this.popManager.showSuccessAlert('Se registro la apropiación correctamente!'); /*TODO: Agregar a traducciones */
          // this.cleanForm();
          this.eventChange.emit(true);
          this.cleanAprData();
        }
      });
    } else {
      this.popManager.showErrorAlert('Seleccione una vigencia.'); /*TODO: Agregar a traducciones */
    }
  }
}
