import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import 'style-loader!angular2-toaster/toaster.css';
import { ProductoHelper } from '../../../@core/helpers/productos/productoHelper';
import { FORM_PRODUCTO } from './form-producto';
import { Observable } from 'rxjs';
@Component({
  selector: 'ngx-list-producto',
  templateUrl: './list-producto.component.html',
  styleUrls: ['./list-producto.component.scss'],
})
export class ListProductoComponent implements OnInit {


  uuidReadFieldName: string;
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
  isOnlyCrud: boolean;
  loadFormDataFunction: (...params) => Observable<any>;
  updateEntityFunction: (...params) => Observable<any>;
  createEntityFunction: (...params) => Observable<any>;
  listColumns: object;

  constructor(
    private translate: TranslateService,
    private productoHelper: ProductoHelper,
  ) {  }

  ngOnInit() {
    this.uuidReadFieldName = '_id';
    this.uuidDeleteFieldName = '_id';
    this.isOnlyCrud = true;
    this.deleteConfirmMessage = 'PRODUCTO.confirmacion_eliminar';
    this.deleteMessage = 'PRODUCTO.mensaje_eliminar';
    this.loadDataFunction = this.productoHelper.getProductos;
    this.deleteDataFunction = this.productoHelper.productoDelete;
    this.formEntity = FORM_PRODUCTO;
    this.formTittle = 'RUBRO.add-producto';
    this.updateMessage = 'PRODUCTO.mensaje_actualizar';
    this.createMessage = 'PRODUCTO.mensaje_registrar';
    this.updateConfirmMessage = 'PRODUCTO.confirmacion_actualizacion';
    this.createConfirmMessage = 'PRODUCTO.confirmacion_creacion';
    this.loadFormDataFunction = this.productoHelper.getProductos;
    this.updateEntityFunction = this.productoHelper.productoUpdate;
    this.createEntityFunction = this.productoHelper.productoRegister;
    this.listColumns = {
      Codigo: {
        title: this.translate.instant('GLOBAL.codigo'),
        // type: 'string;',
        valuePrepareFunction: (value) => {
          return value;
        },
      },
      Nombre: {
        title: this.translate.instant('GLOBAL.nombre'),
        // type: 'string;',
        valuePrepareFunction: (value) => {
          return value;
        },
      },
      Descripcion: {
        title: this.translate.instant('GLOBAL.descripcion'),
        // type: 'string;',
        valuePrepareFunction: (value) => {
          return value;
        },

      },
    };
  }
  onChange(event) {

  }

}
