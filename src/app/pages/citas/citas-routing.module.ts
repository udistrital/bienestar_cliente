import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NotFoundComponent} from '../miscellaneous/not-found/not-found.component';

const routes: Routes = [
  {
    path: '', children:[
    {
      path:'cita', component: NotFoundComponent
    },
    {
      path:'especialista', component: NotFoundComponent
    },
    {
      path:'paciente', component: NotFoundComponent
    },
    {
      path:'**', redirectTo: 'paciente'
    },
    
     ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitasRoutingModule { }
