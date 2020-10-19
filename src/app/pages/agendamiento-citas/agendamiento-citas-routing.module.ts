import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetalleCitaComponent } from './detalle-cita/detalle-cita.component';
import { DetalleHorarioComponent } from './detalle-horario/detalle-horario.component';
import { DetallePacienteComponent } from './detalle-paciente/detalle-paciente.component';


const routes: Routes = [
  {
    path: 'cita',
    component: DetalleCitaComponent,
    data: {
      rolesPermitidos: ['ESPECIALISTA','ESTUDIANTE']
    }
  },
  {
    path: 'paciente',
    component: DetallePacienteComponent,
    data: {
      rolesPermitidos: ['ESPECIALISTA']
    }
  },
  {
    path: 'horario-especialista',
    component: DetalleHorarioComponent,
    data: {
      rolesPermitidos: ['ESPECIALISTA']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendamientoCitasRoutingModule { }
