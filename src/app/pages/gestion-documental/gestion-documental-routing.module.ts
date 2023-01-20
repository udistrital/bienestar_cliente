import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { GestionDocumentalComponent } from './gestion-documental.component';

const routes: Routes = [
  {
    path: '',
    component: GestionDocumentalComponent
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
