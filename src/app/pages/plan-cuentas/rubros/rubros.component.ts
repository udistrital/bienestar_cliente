
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Rubro } from '../../../@core/data/models/rubro';
import { FORM_INFO_RUBRO } from './form_info_rubro';
import { RubroHelper } from '../../../@core/helpers/rubros/rubroHelper';
import { PopUpManager } from '../../../@core/managers/popUpManager';
import { TranslateService } from '@ngx-translate/core';
import { FormManager } from '../../../@core/managers/formManager';
import { NodoRubro } from '../../../@core/data/models/nodo_rubro';



@Component({
  selector: 'ngx-rubros',
  templateUrl: './rubros.component.html',
  styleUrls: ['./rubros.component.scss'],
})
export class RubrosComponent implements OnInit {
  rubroSeleccionado: any;
  info_rubro: Rubro;
  insertarRubro = false;
  clean = false;
  formInfoRubro: any;
  rubroData: NodoRubro;
  editandoRubro: boolean;

  vigencias: any[] = [
    { vigencia: 2019 },
    { vigencia: 2017 },
    { vigencia: 2016 },
  ];
  AreaFuncional: any;
  CentroGestor: any;
  VigenciaActual = 0;
  lastAddedNodeCode: string = '';
  optionView: string;
  @Output() eventChange = new EventEmitter();
  constructor(
    private translate: TranslateService,
    private rbHelper: RubroHelper,
    private popManager: PopUpManager,
  ) {
    this.optionView = 'Rubros';
    this.editandoRubro = false;
    this.formInfoRubro = FORM_INFO_RUBRO;
    this.construirForm();
    this.rubroSeleccionado = {
    };
    this.rubroData = {
      Nombre: '',
      Descripcion: '',
      Codigo: '',
      Hijos: null,
      Padre: '',
      UnidadEjecutora: '',
    };
  }

  ngOnInit() {
    this.info_rubro = {} as Rubro;
  }



  construirForm() {
    this.formInfoRubro.btn = this.translate.instant('GLOBAL.guardar');
    for (let i = 0; i < this.formInfoRubro.campos.length; i++) {
      this.formInfoRubro.campos[i].label = this.formInfoRubro.campos[i].label_i18n;
      this.formInfoRubro.campos[i].placeholder = this.formInfoRubro.campos[i].label_i18n;
    }
  }

  receiveMessage($event) {
    this.rubroSeleccionado = <Rubro>$event;
    this.CentroGestor = '230';
    this.AreaFuncional = '0' + this.rubroSeleccionado.UnidadEjecutora + '-Rector';
    this.rubroSeleccionado.UnidadEjecutora = parseInt(this.rubroSeleccionado.UnidadEjecutora, 0);

    const data = {
      RubroPadre: this.rubroSeleccionado.Codigo,
    };

    this.info_rubro = <Rubro>data;
    this.formInfoRubro.campos[FormManager.getIndexForm(this.formInfoRubro, 'Codigo')].prefix.value = this.rubroSeleccionado.Codigo + '-';
    // console.info(this.rubroSeleccionado);

  }

  aniadirNodo() {
    this.insertarRubro = !this.insertarRubro;
    const data = {
      RubroPadre: this.rubroSeleccionado.Codigo || '',
    };
    this.info_rubro = <Rubro>data;
  }

  cleanForm() {
    this.clean = !this.clean;
    this.rubroSeleccionado = {};
    this.info_rubro = null;
    this.formInfoRubro.campos[FormManager.getIndexForm(this.formInfoRubro, 'Codigo')].prefix.value = '';

  }



  validarForm(event) {
    if (event.valid) {
      this.rubroData.Nombre = typeof event.data.RubroHijo.Nombre === 'undefined' ? undefined : event.data.RubroHijo.Nombre;
      this.rubroData.Descripcion = typeof event.data.RubroHijo.Descripcion === 'undefined' ? undefined : event.data.RubroHijo.Descripcion;
      this.rubroData.Codigo = typeof this.rubroSeleccionado.Codigo === 'undefined' ? event.data.RubroHijo.Codigo + '' :
        String(this.rubroSeleccionado.Codigo + '-' + event.data.RubroHijo.Codigo);
      this.rubroData.Padre = typeof this.rubroSeleccionado.Codigo === 'undefined' ? '' : String(this.rubroSeleccionado.Codigo);
      this.rbHelper.rubroRegister(this.rubroData).subscribe((res) => {
        if (res) {
          this.popManager.showSuccessAlert('Se registró el rubro de manera exitosa.', 'GLOBAL.rubro_registrado');
          this.cleanForm();
          this.eventChange.emit(true);
        }
      });
    } else {
      this.popManager.showErrorAlert('Datos Incompletos!');
    }
  }
  onSelect(selectedItem: any) { }

  deleteRubro() {
    const id = <string>this.rubroSeleccionado.Codigo;
    this.popManager.showAlert('warning', 'Eliminar rubro', 'esta seguro?')
      .then((result) => {
        if (result.value) {
          this.rbHelper.rubroDelete(id).subscribe((res) => {
            if (res) {
              this.popManager.showSuccessAlert('Se eliminó el rubro de manera exitosa', 'GLOBAL.rubro_eliminado');
              this.cleanForm();
              this.eventChange.emit(true);
            }
          });
        }
      },
      );
  }

  editRubro() {

    this.rbHelper.rubroUpdate(this.construirRubroSeleccionado()).subscribe((res) => {
      if (res) {
        this.popManager.showSuccessAlert('Se Actualizó el Rubro correctamente!');
        this.cleanForm();
        this.eventChange.emit(true);
      }
    });
    this.editandoRubro = !this.editandoRubro;
  }

  construirRubroSeleccionado(): NodoRubro {

    this.rubroData.Codigo = typeof this.rubroSeleccionado.Codigo === 'undefined' ? undefined : this.rubroSeleccionado.Codigo;
    this.rubroData.Nombre = typeof this.rubroSeleccionado.Nombre === 'undefined' ? undefined : this.rubroSeleccionado.Nombre;
    this.rubroData.UnidadEjecutora = typeof this.rubroSeleccionado.UnidadEjecutora === 'undefined' ? undefined : `${this.rubroSeleccionado.UnidadEjecutora}`;
    this.rubroData.Descripcion = typeof this.rubroSeleccionado.Descripcion === 'undefined' ? undefined : this.rubroSeleccionado.Descripcion;
    this.rubroData.Hijos = typeof this.rubroSeleccionado.Hijos === 'undefined' ? undefined : this.rubroSeleccionado.Hijos;
    this.rubroData.Padre = typeof this.rubroSeleccionado.Padre === 'undefined' ? undefined : this.rubroSeleccionado.Padre;
    console.info(this.rubroData);
    return this.rubroData;

  }

}
