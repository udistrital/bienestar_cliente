import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductoComponent } from './producto.component';
import { ListProductoComponent } from './list-producto/list-producto.component';
import { CrudProductoComponent } from './crud-producto/crud-producto.component';



const routes: Routes = [{
  path: '',
  component: ProductoComponent,
  children: [{
    path: 'list-producto',
    component: ListProductoComponent,
  }, {
    path: 'crud-producto',
    component: CrudProductoComponent,
  }],
}];

@NgModule({
  imports: [
      RouterModule.forChild(routes),
  ],
  exports: [
      RouterModule,
  ],
})

export class ProductoRoutingModule { }

export const routedComponents = [
  ProductoComponent,
  ListProductoComponent,
  CrudProductoComponent,
];
