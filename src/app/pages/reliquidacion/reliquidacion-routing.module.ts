import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
  redirectTo: 'descuento-electoral',
  pathMatch: 'full',
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReliquidacionRoutingModule { }

