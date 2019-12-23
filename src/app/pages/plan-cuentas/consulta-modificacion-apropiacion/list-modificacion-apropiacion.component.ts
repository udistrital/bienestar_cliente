import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import 'style-loader!angular2-toaster/toaster.css';
import { FORM_PRODUCTO } from './form-producto';
import { Observable } from 'rxjs';
import { ModApropiacionHelper } from '../../../@core/helpers/modApropiacionHelper';
import { CommonHelper } from '../../../@core/helpers/commonHelper';
import { ApropiacionHelper } from '../../../@core/helpers/apropiaciones/apropiacionHelper';

@Component({
  selector: 'ngx-list-modificacion-apropiacion',
  templateUrl: './list-modificacion-apropiacion.component.html',
  styleUrls: ['./list-modificacion-apropiacion.component.scss'],
})

export class ListModificacionApropiacionComponent implements OnInit {

  paramsFieldsName: { vigencia: string, cg: string, tipomod: string };
  uuidReadFieldName: string;
  uuidDeleteFieldName: string;

  vigenciaSel: any;
  tipoModSel: any;
  vigencias: any[];
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
  isOnlyCrud: boolean;
  loadFormDataFunction: (...params) => Observable<any>;
  updateEntityFunction: (...params) => Observable<any>;
  createEntityFunction: (...params) => Observable<any>;
  listColumns: object;
  listSettings: object;
  auxcambiotab: boolean = false;
  disabledVigencia: boolean = false;
  externalCreate: boolean = true;
  createTab: boolean = false;
  localtabActived: boolean = false;
  viewTab: boolean = false;
  modificationDataSelected: object;
  tipoModificaciones: { value: string; label: any; }[];
  areas = { '1': 'Rector', '2': 'Convenios' };
  constructor(
    private translate: TranslateService,
    private modificacionAprHelper: ModApropiacionHelper,
    private commonHelper: CommonHelper,
    private apHelper: ApropiacionHelper,
  ) { }

  ngOnInit() {
    this.apHelper.getVigenciasList().subscribe(res => {
      if (res) {
        this.vigencias = res;
      }
    });
    this.tipoModificaciones = [
      { value: 'modificacion_presupuestal', label: this.translate.instant('GLOBAL.mod_presupuestal') },
      { value: 'modificacion_fuente', label: this.translate.instant('GLOBAL.mod_fuente') }];
    this.uuidReadFieldName = '_id';
    this.uuidDeleteFieldName = '_id';
    this.isOnlyCrud = true;
    this.deleteConfirmMessage = 'PRODUCTO.confirmacion_eliminar';
    this.deleteMessage = 'PRODUCTO.mensaje_eliminar';
    this.loadDataFunction = this.modificacionAprHelper.getAllModificacionesApr;
    this.formEntity = FORM_PRODUCTO;
    this.commonHelper.geCurrentVigencia().subscribe(res => {
      if (res) {
        this.vigenciaSel = res + '';
        this.tipoModSel = this.tipoModificaciones[0];
      }
      this.paramsFieldsName = { vigencia: this.vigenciaSel, cg: '1', tipomod: this.tipoModSel.value };
      this.loadFormDataFunction = this.modificacionAprHelper.getAllModificacionesApr;
    });

    this.listColumns = {

      TipoDocumento: {
        title: this.translate.instant('GLOBAL.tipo_documento'),
        valuePrepareFunction: (value) => value
      },

      CentroGestor: {
        title: this.translate.instant('GLOBAL.area_funcional'),
        // type: 'string;',
        valuePrepareFunction: (value) => this.areas[value],
        filter: {
          type: 'list',
          config: {
            selectText: 'Todas',
            list: [
              { value: '1', title: 'Rector' },
              { value: '2', title: 'Convenios' },
            ]
          },
        },
      },

      NumeroDocumento: {
        title: this.translate.instant('GLOBAL.numero_documento'),
        // type: 'string;',
        valuePrepareFunction: (value) => value
      },
      FechaDocumento: {
        title: this.translate.instant('GLOBAL.fecha_documento'),
        // type: 'string;',
        valuePrepareFunction: (value) => {
          const date = new Date(value);
          return `${('0' + date.getDate()).slice(-2)}-${date.getMonth() + 1}-${date.getFullYear()}`;
        }
      },
      FechaRegistro: {
        title: this.translate.instant('GLOBAL.fecha_registro'),
        // type: 'string;',
        valuePrepareFunction: (value) => {
          const date = new Date(value);
          return `${('0' + date.getDate()).slice(-2)}-${date.getMonth() + 1}-${date.getFullYear()}`;
        }
      },
      
    };

    this.listSettings = {
      actions: {
        add: true,
        edit: false,
        delete: false,
        custom: [{ name: 'other', title: '<i title="Ver" class="ion ion-eye"></i>' }],
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
  onChange(event) {

  }

  loadOptionsVigencia(): void {
    const aplicacion = this.vigencias;
    this.formEntity.campos[this.getIndexForm('Vigencia')].opciones = aplicacion;
  }
  getIndexForm(nombre: String): number {
    for (let index = 0; index < this.formEntity.campos.length; index++) {
      const element = this.formEntity.campos[index];
      if (element.nombre === nombre) {
        return index;
      }
    }
    return 0;
  }

  onSelect(selectedItem: any) {
    this.vigenciaSel = selectedItem;
    this.paramsFieldsName = { vigencia: this.vigenciaSel, cg: '1', tipomod: this.tipoModSel.value };
    // this.eventChange.emit(true);
  }

  onSelectTipoMod(selectedItem: any) {
    console.info(selectedItem);
    this.tipoModSel = selectedItem;
    this.paramsFieldsName = { vigencia: this.vigenciaSel, cg: '1', tipomod: this.tipoModSel.value };
    // this.eventChange.emit(true);
  }

  onChangeTab(estado) {
    this.disabledVigencia = estado;
    this.auxcambiotab = estado;
  }

  onExternalTabActivator($event: string) {
    if ($event === 'external-create') {
      this.disabledVigencia = true;
      this.auxcambiotab = true;
      this.createTab = true;
      this.localtabActived = true;
    } else if ($event === 'other') {
      this.viewTab = true;
      this.localtabActived = true;
    }
  }

  receiveMessage($event) {
    this.modificationDataSelected = $event;
  }

  returnToList() {
    this.disabledVigencia = false;
    this.auxcambiotab = false;
    this.localtabActived = false;
    this.createTab = false;
    this.viewTab = false;
  }

  onSaved($event) {
    this.returnToList();
  }

}
