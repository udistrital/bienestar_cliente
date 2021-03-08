import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitaComponent } from './cita/cita.component';
import { EspecialistaComponent } from './especialista/especialista.component';
import { PacienteComponent } from './paciente/paciente.component';


const routes: Routes = [
  {
    path: '', children:[
    {
      path:'cita', component: CitaComponent
    },
    {
      path:'especialista', component: EspecialistaComponent
    },
    {
      path:'paciente', component: PacienteComponent
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
