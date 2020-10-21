import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetalleCitaComponent } from './detalle-cita/detalle-cita.component';
import { DetalleHorarioComponent } from './detalle-horario/detalle-horario.component';
import { DetallePacienteComponent } from './detalle-paciente/detalle-paciente.component';
import { AgendaCitaEstudianteComponent } from './agenda-cita-estudiante/agenda-cita-estudiante.component';

const routes: Routes = [
  {
    path: 'cita',
    component: DetalleCitaComponent,
    data: {
      rolesPermitidos: ['ESPECIALISTA']
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
  },
  {
    path: 'agendar-cita',
    component: AgendaCitaEstudianteComponent,
    data: {
      rolesPermitidos: ['ESTUDIANTE']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendamientoCitasRoutingModule { }
