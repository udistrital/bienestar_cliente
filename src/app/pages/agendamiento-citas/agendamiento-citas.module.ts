import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { AgendamientoCitasRoutingModule } from './agendamiento-citas-routing.module';
import { DetalleCitaComponent } from './detalle-cita/detalle-cita.component';
import {
  NbTreeGridModule,
  NbSelectModule,
  NbAlertModule,
  NbTabsetModule,
  NbStepperModule,
  NbCardModule,
  NbTooltipModule,
  NbRadioModule,
  NbSpinnerModule,
  NbCheckboxModule } from '@nebular/theme';


@NgModule({
  declarations: [DetalleCitaComponent],
  imports: [
    ThemeModule,
    CommonModule,
    AgendamientoCitasRoutingModule,
    NbTreeGridModule,
    NbTooltipModule,
    NbSelectModule,
    NbRadioModule,
    NbAlertModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbSpinnerModule,
  ]
})
export class AgendamientoCitasModule { }
