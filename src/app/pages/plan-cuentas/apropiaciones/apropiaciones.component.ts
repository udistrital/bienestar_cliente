import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Rubro } from '../../../@core/data/models/rubro';
import { ApropiacionHelper } from '../../../@core/helpers/apropiaciones/apropiacionHelper';
import { PopUpManager } from '../../../@core/managers/popUpManager';
import { ArbolApropiacion } from '../../../@core/data/models/arbol_apropiacion';

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
  vigencias: any[] = [
    { vigencia: 2020 },
    { vigencia: 2019 },
    { vigencia: 2018 },
    { vigencia: 2017 },
    { vigencia: 2016 },
  ];
  balanceado: boolean;

  constructor(
    private apHelper: ApropiacionHelper,
    private popManager: PopUpManager,
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
      ApropiacionInicial: 0,
      ApropiacionAnterior: 0,
      Estado: '',
      Rubro: <Rubro>{},
      Codigo: '',
      Nombre: '',
      Descripcion: '',
      UnidadEjecutora: '',
      Padre: '',
      Hijos: [],
    };

  }


  ngOnInit() {

  }

  receiveMessage($event) {
    if ($event.Hijos.length === 0) {
      this.isLeaf = true;
      this.rubroSeleccionado = <Rubro>$event;
      // console.info(this.rubroSeleccionado);
      this.rubroSeleccionado.Id = parseInt(this.rubroSeleccionado.Id, 0);
      this.rubroSeleccionado.Nombre = this.rubroSeleccionado.Nombre;
      this.rubroSeleccionado.UnidadEjecutora = parseInt(
        this.rubroSeleccionado.UnidadEjecutora,
        0,
      );
      this.rubroSeleccionado.ApropiacionInicial = parseInt(this.rubroSeleccionado.ApropiacionInicial, 0);
    } else {
      this.isLeaf = false;
    }
  }


  aprobarApropiacion() {
    this.popManager.showAlert('warning', 'Aprobar Apropiación', 'esta seguro?')
      .then((result) => {
        if (result.value) {
          this.apHelper.apropiacionApprove({ UnidadEjecutora: '1', Vigencia: this.vigenciaSel }).subscribe((res) => {
            if (res) {
              this.popManager.showSuccessAlert('Aprobación exitosa para la apropiación ' + this.vigenciaSel);
              this.cleanForm();
              this.eventChange.emit(true);
            }
          });
        }
      },
      );
    this.apropiacionAprobada = true;
  }


  cleanForm() {
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

  }

  preAsignarApropiacion() {
    this.apropiacionData.Vigencia = typeof this.vigenciaSel === 'undefined' ? undefined : parseInt(this.vigenciaSel, 0);
    this.apropiacionData.Codigo = typeof this.rubroSeleccionado.Codigo === 'undefined' ? undefined : this.rubroSeleccionado.Codigo;
    this.apropiacionData.Nombre = typeof this.rubroSeleccionado.Nombre === 'undefined' ? undefined : this.rubroSeleccionado.Nombre;
    this.apropiacionData.Descripcion = typeof this.rubroSeleccionado.Descripcion === 'undefined' ? undefined : this.rubroSeleccionado.Descripcion;
    this.apropiacionData.UnidadEjecutora = typeof this.rubroSeleccionado.UnidadEjecutora === 'undefined' ? undefined : this.rubroSeleccionado.UnidadEjecutora;
    this.apropiacionData.Padre = typeof this.rubroSeleccionado.Padre === 'undefined' ? undefined : this.rubroSeleccionado.Padre;
    this.apropiacionData.Hijos = typeof this.rubroSeleccionado.Hijos === 'undefined' ? undefined : this.rubroSeleccionado.Hijos;
    this.apropiacionData.ApropiacionInicial = typeof this.valorApropiacion === 'undefined' ? undefined : this.valorApropiacion;
    this.apropiacionData.ApropiacionAnterior = typeof this.rubroSeleccionado.ApropiacionInicial === 'undefined' ? undefined : this.rubroSeleccionado.ApropiacionInicial;
    this.apropiacionData.Estado = 'registrada'; // Estado preasignado

    console.table(this.apropiacionData);
    if (this.vigenciaSel !== undefined) {
      this.apHelper.apropiacionRegister(this.apropiacionData).subscribe((res) => {
        if (res) {
          this.popManager.showSuccessAlert('Se registro la preasignación de apropiación correctamente!');
          this.cleanForm();
          this.eventChange.emit(true);
        }
      });
    } else {
      this.popManager.showErrorAlert('Seleccione una vigencia.');
    }


  }

  onSelect(selectedItem: any) {
    this.vigenciaSel = selectedItem;
    // this.eventChange.emit(true);
    console.info(this.vigenciaSel);
  }

  checkComprobacion(event: boolean) {
    this.balanceado = event;
  }

}
