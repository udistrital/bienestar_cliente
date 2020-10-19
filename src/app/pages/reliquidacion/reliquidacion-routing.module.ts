import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaEstudiantesReliquidacionComponent } from './lista-estudiantes-reliquidacion/lista-estudiantes-reliquidacion.component'

const routes: Routes = [{

  path: 'lista-estudiantes-reliquidacion',
  component: ListaEstudiantesReliquidacionComponent,
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReliquidacionRoutingModule { }


export const routedComponents = [
  ListaEstudiantesReliquidacionComponent,
];
