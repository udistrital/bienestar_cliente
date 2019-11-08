import { Component, OnInit } from '@angular/core';
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


  listColumns: object;
  fuenteInfo: any;
  disabledVigencia: boolean = false;

  constructor(
    private translate: TranslateService,
    private fuenteHelper: FuenteHelper,
    private apHelper: ApropiacionHelper,
    private commonHelper: CommonHelper,
  ) {
    this.vigenciaSel = '0';
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
    });
    this.isOnlyCrud = false;
    this.uuidReadFieldName = 'Codigo';
    this.paramsFieldsName = { Vigencia: this.vigenciaSel, UnidadEjecutora: 1};
    this.uuidDeleteFieldName = 'Codigo';
    this.deleteConfirmMessage = 'FUENTE_FINANCIAMIENTO.confirmacion_actualizacion';
    this.deleteMessage = 'FUENTE_FINANCIAMIENTO.mensaje_eliminar';
    this.loadDataFunction = this.fuenteHelper.getFuentes;
    this.deleteDataFunction = this.fuenteHelper.fuenteDelete;
    this.formEntity = FORM_FUENTE;
    this.formTittle = 'FUENTE_FINANCIAMIENTO.guardar_fuente';
    this.updateMessage = 'FUENTE_FINANCIAMIENTO.mensaje_actualizar';
    this.createMessage = 'FUENTE_FINANCIAMIENTO.mensaje_registrar';
    this.updateConfirmMessage = 'FUENTE_FINANCIAMIENTO.confirmacion_actualizacion';
    this.createConfirmMessage = 'FUENTE_FINANCIAMIENTO.confirmacion_creacion';
    this.loadFormDataFunction = this.fuenteHelper.getFuentes;
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
    this.listSettings = {
      actions: {
        add: true,
        edit: false,
        delete: false,
        custom: [{ name: 'edit', title: '<i class="nb-edit"></i>' }, { name: 'delete', title: '<i class="nb-trash"></i>' }, { name: 'other', title: '<i class="nb-shuffle"></i>' }],
        position: 'left'
      },
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>'
      },
      mode: 'external',
      columns: this.listColumns,
    };
    this.loadOptionsVigencia();
  }
  onChange(event) {
    
  }
  loadOptionsVigencia(): void {
    let aplicacion: Array<any> = [
      { Id: 1, vigencia: 2018 },
      { Id: 2, vigencia: 2019 },
      { Id: 3, vigencia: 2020 }];
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
  onFirstTab(estado){
    this.disabledVigencia = estado;
  }
  receiveMessage(event) {
    this.fuenteInfo = event;
  }
  
  onSelect(selectedItem: any) {
    this.vigenciaSel = selectedItem;
    this.paramsFieldsName = { Vigencia: this.vigenciaSel, UnidadEjecutora: 1};
    
    // this.eventChange.emit(true);
    console.info(this.vigenciaSel);
  }
  
  
}
