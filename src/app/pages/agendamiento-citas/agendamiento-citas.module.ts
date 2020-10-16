import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { AgendamientoCitasRoutingModule } from './agendamiento-citas-routing.module';
import { DetalleCitaComponent } from './detalle-cita/detalle-cita.component';
import { SharedModule } from '../../shared/shared.module';
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
import { MatStepperModule } from '@angular/material';
import { ConfiguracionService } from '../../@core/data/configuracion.service';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DetallePacienteComponent } from './detalle-paciente/detalle-paciente.component';
import { DetalleHorarioComponent } from './detalle-horario/detalle-horario.component';
/*
import { ReportesComponent } from '../reportes/components/reportes/reportes.component';
import { LinkSmartTableComponent } from '../ui-features/link-smart-table/link-smart-table.component';
*/

@NgModule({
  declarations: [
    DetalleCitaComponent,
    DetallePacienteComponent,
    DetalleHorarioComponent,
    /*
    ReportesComponent,
    LinkSmartTableComponent,
*/],
  providers: [
    ConfiguracionService,
    ToasterService,
  ],
  imports: [
    ThemeModule,
    SharedModule,
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
    MatStepperModule,
    ToasterModule,
    Ng2SmartTableModule,
    CurrencyMaskModule,
  ]
})
export class AgendamientoCitasModule { }
