import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import 'style-loader!angular2-toaster/toaster.css';
import { FuenteHelper } from '../../../../@core/helpers/fuentes/fuenteHelper';
import { ApropiacionHelper } from '../../../../@core/helpers/apropiaciones/apropiacionHelper';
import { CommonHelper } from '../../../../@core/helpers/commonHelper';
import { FORM_FUENTE } from '../form-fuente';

@Component({
  selector: 'ngx-list-fuente',
  templateUrl: './list-fuente.component.html',
  styleUrls: ['./list-fuente.component.scss']
})
export class ListFuenteComponent implements OnInit {
  @Output() fuenteSeleccionada = new EventEmitter();
  @Input() viewItemSelected: boolean;
  uuidReadFieldName: string;
  paramsFieldsName: object;
  uuidDeleteFieldName: string;
  deleteConfirmMessage: string;
  deleteMessage: string;
  loadDataFunction: (...params) => Observable<any>;
  deleteDataFunction: (...params) => Observable<any>;
  formEntity: any;
  formTittle: string;
  updateMessage: string;
  createMessage: string;
  updateConfirmMessage: string;
  createConfirmMessage: string;
  vigenciaSel: any;
  vigencias: any[];
  loadFormDataFunction: (...params) => Observable<any>;
  updateEntityFunction: (...params) => Observable<any>;
  createEntityFunction: (...params) => Observable<any>;
  isOnlyCrud: boolean;
  listSettings: object;
  auxcambiotab: boolean = false;
  createTab: boolean = false;
  localtabActived: boolean = false;
  viewTab: boolean = false;

  listColumns: object;
  fuenteInfo: any;
  disabledVigencia: boolean = false;

  constructor(
    private translate: TranslateService,
    private fuenteHelper: FuenteHelper,
    private apHelper: ApropiacionHelper,
    private commonHelper: CommonHelper,
  ) {

  }

  ngOnInit() {
    this.apHelper.getVigenciasList().subscribe(res => {
      if (res) {
        this.vigencias = res;
      }
    });
    this.commonHelper.geCurrentVigencia().subscribe(res => {
      if (res) {
        this.vigenciaSel = res + '';
      }
      this.paramsFieldsName = { Vigencia: this.vigenciaSel, UnidadEjecutora: 1 };
      this.loadFormDataFunction = this.fuenteHelper.getFuentes;
    });
    this.isOnlyCrud = false;
    this.uuidReadFieldName = 'Codigo';
    this.uuidDeleteFieldName = 'Codigo';
    this.deleteConfirmMessage = 'FUENTE_FINANCIAMIENTO.confirmacion_actualizacion';
    this.deleteMessage = 'FUENTE_FINANCIAMIENTO.mensaje_eliminar';
    this.deleteDataFunction = this.fuenteHelper.fuenteDelete;
    this.loadDataFunction = this.fuenteHelper.getFuentes;
    this.formEntity = FORM_FUENTE;
    this.formTittle = 'FUENTE_FINANCIAMIENTO.guardar_fuente';
    this.updateMessage = 'FUENTE_FINANCIAMIENTO.mensaje_actualizar';
    this.createMessage = 'FUENTE_FINANCIAMIENTO.mensaje_registrar';
    this.updateConfirmMessage = 'FUENTE_FINANCIAMIENTO.confirmacion_actualizacion';
    this.createConfirmMessage = 'FUENTE_FINANCIAMIENTO.confirmacion_creacion';
    this.updateEntityFunction = this.fuenteHelper.fuenteUpdate;
    this.createEntityFunction = this.fuenteHelper.fuenteRegister;
    this.listColumns = {
      Nombre: {
        title: this.translate.instant('GLOBAL.nombre'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      Codigo: {
        title: this.translate.instant('GLOBAL.codigo'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      Vigencia: {
        title: this.translate.instant('GLOBAL.vigencia'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      }
    };
    if (this.viewItemSelected) {
      this.listSettings = {
        actions: {
          add: false,
          edit: false,
          delete: false,
          position: 'right'
        },
        mode: 'external',
        columns: this.listColumns,
      };
    } else {

      this.listSettings = {
        actions: {
          add: true,
          edit: false,
          delete: false,
          custom: [
            { name: 'edit', title: '<i title="editar" class="nb-edit"></i>' },
            { name: 'delete', title: '<i title="eliminar" class="nb-trash"></i>' },
            { name: 'other', title: '<i title="Agregar Vigencia" class="nb-tables"></i>' },
            { name: 'rubros-fuente', title: '<i title="Ver distribución" class="ion ion-eye" ></i>' }],
          position: 'right'
        },
        add: {
          addButtonContent: '<i title="Nueva Fuente" class="nb-plus"></i>',
          createButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>'
        },
        mode: 'external',
        columns: this.listColumns,
      };
    }
    this.loadOptionsVigencia();
  }
  onChange(event) {

  }
  loadOptionsVigencia(): void {
    let aplicacion = this.vigencias;
    this.formEntity.campos[this.getIndexForm('Vigencia')].opciones = aplicacion;
  }
  getIndexForm(nombre: String): number {
    for (let index = 0; index < this.formEntity.campos.length; index++) {
      const element = this.formEntity.campos[index];
      if (element.nombre === nombre) {
        return index
      }
    }
    return 0;
  }
  onChangeTab(estado) {
    this.disabledVigencia = estado;
    this.auxcambiotab = estado;
  }
  onFirstTab(estado) {
    this.disabledVigencia = estado;
  }
  receiveMessage(event) {
    this.fuenteInfo = event;
    if (this.viewItemSelected) {
      this.fuenteSeleccionada.emit(this.fuenteInfo);
    }
  }

  onSelect(selectedItem: any) {
    this.vigenciaSel = selectedItem;
    if(this)
    this.paramsFieldsName = { Vigencia: this.vigenciaSel, UnidadEjecutora: 1 };
    // this.eventChange.emit(true);
  }
  onExternalTabActivator($event: string) {
    if ($event === 'external-create') {
      this.auxcambiotab = true;
      this.createTab = true;
      this.localtabActived = true;
    } else if ($event === 'other') {
      this.viewTab = false;
      this.localtabActived = true;
    } else {
      this.disabledVigencia = true;
      this.localtabActived = true;
      this.viewTab = true;
    }

  }
  returnToList() {
    this.disabledVigencia = false;
    this.auxcambiotab = false;
    this.localtabActived = false;
    this.createTab = false;
    this.viewTab = false
  }

}
