import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
<<<<<<< HEAD
import { HomeEstudianteComponent } from './home-estudiante/home-estudiante.component';
import { ReliquidacionMatriculaComponent } from './reliquidacion-matricula/reliquidacion-matricula.component';
import { DescuentoElectoralComponent } from './descuento-electoral/descuento-electoral.component';


const routes: Routes = [
{
  path: 'home-estudiante',
  component: HomeEstudianteComponent,
},
{
  path: 'reliquidacion-matricula',
  component: ReliquidacionMatriculaComponent,
},
{
  path: 'descuento-electoral',
  component: DescuentoElectoralComponent,
},
{
  path: '',
  redirectTo: 'home-estudiante',
  pathMatch: 'full',
=======

import { ListaEstudiantesReliquidacionComponent } from './lista-estudiantes-reliquidacion/lista-estudiantes-reliquidacion.component'

const routes: Routes = [{

  path: 'lista-estudiantes-reliquidacion',
  component: ListaEstudiantesReliquidacionComponent,
>>>>>>> develop
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
<<<<<<< HEAD
  exports: [RouterModule],
})
export class ReliquidacionRoutingModule { }

=======
  exports: [RouterModule]
})
export class ReliquidacionRoutingModule { }


export const routedComponents = [
  ListaEstudiantesReliquidacionComponent,
];
>>>>>>> develop
