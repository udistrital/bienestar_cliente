import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApropiacionHelper } from '../../../../@core/helpers/apropiaciones/apropiacionHelper';
import { ProductoHelper } from '../../../../@core/helpers/productos/productoHelper';
import { Producto } from '../../../../@core/data/models/producto';
import { PopUpManager } from '../../../../@core/managers/popUpManager';


@Component({
  selector: 'ngx-productos-rubro',
  templateUrl: './productos-rubro.component.html',
  styleUrls: ['./productos-rubro.component.scss'],
})
export class ProductosRubroComponent implements OnInit {

  rubro: any;
  productos: any = [];
  productoSeleccionado: any = [];
  listaProductosAsignados: any = {};
  vigenciaSel: any;
  entrarEditar: boolean;
  editando: boolean;
  isValidFormSubmitted = null;

  // comunicacion:

  @Input() set productosAsignados(productosAsignados: any[]) {
    this.listaProductosAsignados = productosAsignados;
  }

  @Input() set rubroInfo(rubro: any[]) {
    this.rubro = rubro;
  }
  @Output() cambioListaProductosAsignados = new EventEmitter<any[]>();

  minNum = 0.01;
  maxNum = 100;

  productForm = this.formBuilder.group({
    porcentaje: ['', [Validators.required, Validators.min(this.minNum), Validators.max(this.maxNum)]]
  });

  producto = new Producto();

  constructor(private formBuilder: FormBuilder, private apHelper: ApropiacionHelper, private prodHelper: ProductoHelper, private popUpManager: PopUpManager) {
    this.editando = false;
    this.vigenciaSel = '2020';
    this.entrarEditar = false;
    this.cargarProductos();
    this.productoSeleccionado = {
      producto: this.productos[0],
      porcentaje: 0,
    };
  }


  ngOnInit() {

  }

  getProductByRubro() {

  }

  cargarProductos() {
    this.prodHelper.getProductos('').subscribe(res => {
      if (res !== null) {
        this.productos = <Array<any>>res;
      } else {
        this.productos = undefined;
      }
    });
  }

  agregarProducto() {
    this.rubro.Vigencia = typeof this.vigenciaSel === 'undefined' ? undefined : parseInt(this.vigenciaSel, 0);
    if (this.listaProductosAsignados === undefined) {
      this.listaProductosAsignados = {};
    }
    if (!this.listaProductosAsignados.hasOwnProperty(this.productoSeleccionado.key._id)) {
      this.rubro.Productos = this.listaProductosAsignados;
      this.construirObjProductos(this.productoSeleccionado.key, this.productForm.get('porcentaje').value);
      this.rubro.Productos = this.listaProductosAsignados;
      this.apHelper.apropiacionProductoUpdate(this.rubro).subscribe((res) => {
        if (res) {
          this.popUpManager.showSuccessAlert('Se actualizarón los productos correctamente!');
        } else {
          this.deleteObjProductos(this.productoSeleccionado.key);
        }
      });
      this.cambioListaProductosAsignados.emit(this.listaProductosAsignados);
    } else this.popUpManager.showErrorAlert('el producto ya esta asignado');
  }

  construirObjProductos(producto, porcentaje) {
    const newProp = {
      [producto._id]: {
        nombre: producto.Nombre, porcentaje: porcentaje
      }
    };
    const newObj = { ...this.listaProductosAsignados, ...newProp };
    this.listaProductosAsignados = newObj;
  }
  deleteObjProductos(producto) {
    const { [producto._id]: _, ...newObj } = this.listaProductosAsignados;
    this.listaProductosAsignados = newObj;
  }
  updateObjProductos(id, porcentaje) {
    this.listaProductosAsignados[id] = { ...this.listaProductosAsignados[id], porcentaje: porcentaje };
  }
  eliminarProducto($event, producto: any) {
    this.rubro.Vigencia = typeof this.vigenciaSel === 'undefined' ? undefined : parseInt(this.vigenciaSel, 0);
    producto._id = producto.key;
    this.deleteObjProductos(producto);
    this.rubro.Productos = this.listaProductosAsignados;
    this.apHelper.apropiacionProductoUpdate(this.rubro).subscribe((res) => {
      if (res) {
        this.popUpManager.showSuccessAlert('Se retiró el producto de la distribución correctamente!');
      }
    });
    this.cambioListaProductosAsignados.emit(this.listaProductosAsignados);
  }

  editarProducto() {
    this.rubro.Vigencia = typeof this.vigenciaSel === 'undefined' ? undefined : parseInt(this.vigenciaSel, 0);
    this.editando = true;
    this.updateObjProductos(this.productoSeleccionado.key, this.productForm.get('porcentaje').value);
    this.editando = false;
    this.entrarEditar = false;
    this.rubro.Productos = this.listaProductosAsignados;
    this.apHelper.apropiacionProductoUpdate(this.rubro).subscribe((res) => {
      if (res) {
        this.popUpManager.showSuccessAlert('Se actualizarón los productos correctamente!');
      } else {
        this.deleteObjProductos(this.productoSeleccionado);
      }
    });
    this.cambioListaProductosAsignados.emit(this.listaProductosAsignados);
    this.productoSeleccionado = {
      producto: this.productos[0],
      porcentaje: 0,
    };
  }
  getPorcentajeAsignado(): number {
    let val: number = 0;
    if (this.listaProductosAsignados !== undefined) {
      Object.keys(this.listaProductosAsignados).forEach((key) => {
        val += this.listaProductosAsignados[key].porcentaje;
      });
    }
    return val;
  }
  entrandoEditar(producto: any) {
    this.productoSeleccionado = producto;
    this.entrarEditar = true;
  }

  get porcentaje() {
    return this.productForm.get('porcentaje');
  }


  onFormSubmit() {
    this.isValidFormSubmitted = false;
    if (this.productForm.invalid) {
      return;
    }
    this.isValidFormSubmitted = true;
    this.producto = this.productForm.value;
    this.producto = new Producto();
    this.productForm.reset();
  }
}
