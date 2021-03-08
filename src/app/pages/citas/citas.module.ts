import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitasRoutingModule } from './citas-routing.module';
import { CitaComponent } from './cita/cita.component';
import { PacienteComponent } from './paciente/paciente.component';
import { EspecialistaComponent } from './especialista/especialista.component';


@NgModule({
  declarations: [CitaComponent, PacienteComponent, EspecialistaComponent],
  imports: [
    CommonModule,
    CitasRoutingModule
  ]
})
export class CitasModule { }
