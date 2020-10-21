import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { AgendamientoCitasRoutingModule } from './agendamiento-citas-routing.module';
import { DetalleCitaComponent } from './detalle-cita/detalle-cita.component';
import { SharedModule } from '../../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';


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
import { AgendaCitaEstudianteComponent } from './agenda-cita-estudiante/agenda-cita-estudiante.component';
/*
import { ReportesComponent } from '../reportes/components/reportes/reportes.component';
import { LinkSmartTableComponent } from '../ui-features/link-smart-table/link-smart-table.component';
*/
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  googleCalendarPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    DetalleCitaComponent,
    DetallePacienteComponent,
    DetalleHorarioComponent,
    AgendaCitaEstudianteComponent,
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
    BrowserModule,
    FullCalendarModule // import the FullCalendar module! will make the FullCalendar component available
  ]
})
export class AgendamientoCitasModule { }
