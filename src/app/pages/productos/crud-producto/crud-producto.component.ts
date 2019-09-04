
import { Producto } from './../../../@core/data/models/producto';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfiguracionService } from '../../../@core/data/configuracion.service';
import { FORM_PRODUCTO } from './form-producto';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { FormManager } from '../../../managers/formManager';

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
    private configuracionService: ConfiguracionService,
    private toasterService: ToasterService,
    ) {
    this.formProducto = FORM_PRODUCTO;
    this.formProducto = FormManager.ConstruirForm(this.formProducto, this.translate);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.formProducto = FormManager.ConstruirForm(this.formProducto, this.translate);
    });
  }



  useLanguage(language: string) {
    this.translate.use(language);
  }


  public loadProducto(): void {
    if (this.producto_id) {
      this.configuracionService.get('Producto/?query=id:' + this.producto_id)
        .subscribe(res => {
          if (res !== null) {
            this.info_producto = <Producto>res[0];
          }
        });
    } else {
      this.info_producto = undefined;
      this.clean = !this.clean;
    }
  }

  updateProducto(producto: any): void {

    const opt: any = {
      title: 'Update?',
      text: 'Update Producto!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal.fire(opt)
      .then((willDelete) => {
        if (willDelete.value) {
          this.info_producto = <Producto>producto;
          this.configuracionService.put('Producto', this.info_producto)
            .subscribe(res => {
              this.loadProducto();
              this.eventChange.emit(true);
              this.showToast('info', 'updated', 'Producto updated');
            });
        }
      });
  }

  createProducto(producto: any): void {
    const opt: any = {
      title: 'Create?',
      text: 'Create Producto!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal.fire(opt)
      .then((willDelete) => {
        if (willDelete.value) {
          this.info_producto = <Producto>producto;
          this.configuracionService.post('Producto', this.info_producto)
            .subscribe(res => {
              this.info_producto = <Producto><unknown>res;
              this.eventChange.emit(true);
              this.showToast('info', 'created', 'Producto created');
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

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center'
      positionClass: 'toast-top-center',
      timeout: 5000,  // ms
      newestOnTop: true,
      tapToDismiss: false, // hide on click
      preventDuplicates: true,
      animation: 'slideDown', // 'fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'
      limit: 5,
    });
    const toast: Toast = {
      type: type, // 'default', 'info', 'success', 'warning', 'error'
      title: title,
      body: body,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

}
