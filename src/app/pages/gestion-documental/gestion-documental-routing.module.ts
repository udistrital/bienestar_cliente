import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { GestionDocumentalComponent } from './gestion-documental.component';
import { CargarComponent } from './cargar/cargar.component';
import { ConsultarComponent } from './consultar/consultar.component';

const routes: Routes = [
  {
    path: '', 
    component: GestionDocumentalComponent, 
  },
  {
    path: 'cargar', 
    component: CargarComponent
  },
  {
    path: 'consultar',
    component: ConsultarComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class GestionDocumentalRoutingModule {
}
