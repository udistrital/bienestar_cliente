
import { Producto } from '../../../../@core/data/models/producto';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FORM_PRODUCTO } from './form-producto';
import { ToasterConfig } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { FormManager } from '../../../../managers/formManager';
import { ProductoHelper } from '../../../../helpers/productos/productoHelper';
import { PopUpManager } from '../../../../managers/popUpManager';

@Component({
  selector: 'ngx-crud-producto',
  templateUrl: './crud-producto.component.html',
  styleUrls: ['./crud-producto.component.scss'],
})
export class CrudProductoComponent implements OnInit {
  config: ToasterConfig;
  producto_id: string;

  @Input('producto_id')
  set name(producto_id: string) {
    this.producto_id = producto_id;
    this.loadProducto();
  }

  @Output() eventChange = new EventEmitter();

  info_producto: Producto;
  formProducto: any;
  regProducto: any;
  clean: boolean;

  constructor(
    private translate: TranslateService,
    private productoHelper: ProductoHelper,
    private popUpManager: PopUpManager,
  ) {

    this.formProducto = FORM_PRODUCTO;
    this.formProducto = FormManager.ConstruirForm(this.formProducto, this.translate, 'RUBRO.add-producto');
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.formProducto = FormManager.ConstruirForm(this.formProducto, this.translate, 'RUBRO.add-producto');
    });
  }



  useLanguage(language: string) {
    this.translate.use(language);
  }


  public loadProducto(): void {
    if (this.producto_id) {
      this.productoHelper.getProductos(this.producto_id)
        .subscribe(res => {
          if (res !== null) {
            this.info_producto = <Producto>res;
          }
        });
    } else {
      this.info_producto = undefined;
      this.clean = !this.clean;
    }
  }

  updateProducto(producto: any): void {

    const opt: any = {
      title: this.translate.instant('GLOBAL.actualizar'),
      text: this.translate.instant('PRODUCTO.mensaje_actualizar'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal.fire(opt)
      .then((willDelete) => {
        if (willDelete.value) {
          this.info_producto = <Producto>producto;
          this.productoHelper.productoUpdate(this.info_producto)
            .subscribe(res => {
              this.loadProducto();
              this.eventChange.emit(true);
              this.popUpManager.showSuccessAlert(this.translate.instant('PRODUCTO.confirmacion_actualizacion'));
            });
        }
      });
  }

  createProducto(producto: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.crear'),
      text: this.translate.instant('PRODUCTO.mensaje_registrar'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal.fire(opt)
      .then((willDelete) => {
        if (willDelete.value) {
          this.info_producto = <Producto>producto;
          this.productoHelper.productoRegister(this.info_producto).subscribe(res => {
            this.info_producto = <Producto><unknown>res;
            this.eventChange.emit(true);
            this.popUpManager.showSuccessAlert(this.translate.instant('PRODUCTO.confirmacion_creacion'));
          });
        }
      });
  }

  ngOnInit() {
    this.loadProducto();
  }

  validarForm(event) {
    if (event.valid) {
      if (this.info_producto === undefined) {
        this.createProducto(event.data.Producto);
      } else {
        this.updateProducto(event.data.Producto);
      }
    }
  }

}
