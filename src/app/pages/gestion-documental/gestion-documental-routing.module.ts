import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { GestionDocumentalComponent } from './gestion-documental.component';
import { CargarComponent } from './cargar/cargar.component';

const routes: Routes = [
  {
    path: '', 
    component: GestionDocumentalComponent, 
  },
  {
    path: 'cargar', 
    component: CargarComponent
    },
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
