import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApropiacionHelper } from '../../../../@core/helpers/apropiaciones/apropiacionHelper';
import { ProductoHelper } from '../../../../@core/helpers/productos/productoHelper'
import { Producto } from '../../../../@core/data/models/producto';
import { NgForm } from '@angular/forms';
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
  listaProductosAsignados: any[];
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

  minNum = 0;
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
    console.info(this.rubro);
    console.info(this.productForm.get('porcentaje').value);
    this.rubro.Vigencia = typeof this.vigenciaSel === 'undefined' ? undefined : parseInt(this.vigenciaSel, 0);
    if (this.listaProductosAsignados === undefined) {
      this.listaProductosAsignados = [];
    }
    if (this.listaProductosAsignados.filter(
      (prod) => {
        return (JSON.stringify(prod.producto) === JSON.stringify(this.productoSeleccionado.producto));
      }).length === 0) {
      this.listaProductosAsignados.push({
        producto: this.productoSeleccionado.producto,
        porcentaje: this.productForm.get('porcentaje').value,
      });
      this.rubro.Productos = this.listaProductosAsignados;
      this.apHelper.apropiacionProductoUpdate(this.rubro).subscribe((res) => {
        if (res) {
          this.popUpManager.showSuccessAlert('Se actualizarón los productos correctamente!');
        }
      });         
      this.cambioListaProductosAsignados.emit(this.listaProductosAsignados);
    } else this.popUpManager.showErrorAlert('el producto ya esta asignado');
  }

  eliminarProducto($event, producto: any) {
    this.listaProductosAsignados = this.listaProductosAsignados.filter((p) => {
      return JSON.stringify(p) !== JSON.stringify(producto);
    });
    this.cambioListaProductosAsignados.emit(this.listaProductosAsignados);
  }

  editarProducto() {
    this.editando = true;
    this.listaProductosAsignados.map(
      (prod) => {
        if (prod === this.productoSeleccionado) {
          prod.producto = this.productoSeleccionado.producto;
          prod.porcentaje = this.productForm.get('porcentaje').value;
        }
      },
    );
    this.editando = false;
    this.entrarEditar = false;
    this.cambioListaProductosAsignados.emit(this.listaProductosAsignados);
    this.productoSeleccionado = {
      producto: this.productos[0],
      porcentaje: 0,
    };
  }

  entrandoEditar(producto: any) {
    this.productoSeleccionado = producto;
    this.entrarEditar = true;
  }

  getPorcentajeAsignado(): number {
    let val: number = 0;
    this.listaProductosAsignados.map((p) => {
      val += p.porcentaje;
    });
    return val;
  }

  verificar100(producto?: any): boolean {
    if (producto) {
      return (this.getPorcentajeAsignado() + producto.porcentaje <= 100);
    } else {
      return (this.getPorcentajeAsignado() <= 100);
    }

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
    // this.apHelper.apropiacionProductoUpdate(this.producto);
    this.producto = new Producto();
    this.productForm.reset();
  }
}
