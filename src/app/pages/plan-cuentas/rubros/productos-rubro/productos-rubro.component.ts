import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


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

  entrarEditar: boolean;
  editando: boolean;

  // comunicacion:

  @Input() set productosAsignados(productosAsignados: any[]) {
    this.listaProductosAsignados = productosAsignados;
  }

  @Input() set rubroInfo(rubro: any[]) {
    this.rubro = rubro;
  }
  @Output() cambioListaProductosAsignados = new EventEmitter<any[]>();



  constructor() {
    this.editando = false;
    this.entrarEditar = false;
    this.productos = [{ id: 1, Nombre: 'p1' }, { id: 2, Nombre: 'p2' }, { id: 2, Nombre: 'p3' }, { id: 2, Nombre: 'p4' }];
    this.productoSeleccionado = {
      producto: this.productos[0],
      porcentaje: 0,
    };
  }


  ngOnInit() {
  }

  getProductByRubro() {

  }


  agregarProducto() {
    if (this.listaProductosAsignados.filter(
      (prod) => {
        return (JSON.stringify(prod.producto) === JSON.stringify(this.productoSeleccionado.producto));
      }).length === 0) {
      this.listaProductosAsignados.push({
        producto: this.productoSeleccionado.producto,
        porcentaje: this.productoSeleccionado.porcentaje,
      });
      this.cambioListaProductosAsignados.emit(this.listaProductosAsignados);
    } else alert('el producto ya esta asignado');
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
          prod.porcentaje = this.productoSeleccionado.porcentaje;
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

}
