import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasRoutingModule } from './citas-routing.module';
import { ListarCitaComponent } from './cita/listar-cita/listar-cita.component';
import { CrearCitaComponent } from './cita/crear-cita/crear-cita.component';
import { HorariosComponent } from './especialista/horarios/horarios.component';
import { ListarPacienteComponent } from './paciente/listar-paciente/listar-paciente.component';
import { HomeComponent } from './home/home.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbProgressBarModule, NbRadioModule, NbSelectModule, NbStepperModule, NbTabsetModule, NbUserModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { RadioSelectGenericoModule } from '../../shared/components/radio-select-generico/radio-select-generico.module';
import { ComboGenericoModule } from '../../shared/components/combo-generico/combo-generico.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { OdontogramaComponent } from './historia-clinica/odontologia/odontograma/odontograma.component';
import { DatosBasicosComponent } from './historia-clinica/datos-basicos/datos-basicos.component';
import { MedicinaComponent } from './historia-clinica/medicina/medicina.component';
import { FisioterapiaComponent } from './historia-clinica/fisioterapia/fisioterapia.component';
import { OdontologiaComponent } from './historia-clinica/odontologia/odontologia.component';
import { PsicologiaComponent } from './historia-clinica/psicologia/psicologia.component';
import { PacienteCitaComponent } from './paciente/paciente-cita/paciente-cita.component';
import { OdontogramaVInfantilComponent } from './historia-clinica/odontologia/odontograma-v-infantil/odontograma-v-infantil.component';
import { OdontogramaLingualesComponent } from './historia-clinica/odontologia/odontograma-linguales/odontograma-linguales.component';
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
]);
@NgModule({
  declarations: [
    ListarCitaComponent,
    CrearCitaComponent,
    HorariosComponent,
    ListarPacienteComponent,
    HomeComponent,
    HistoriaClinicaComponent,
    OdontogramaComponent,
    DatosBasicosComponent,
    MedicinaComponent,
    FisioterapiaComponent,
    OdontologiaComponent,
    PsicologiaComponent,
    PacienteCitaComponent,
    OdontogramaVInfantilComponent,
    OdontogramaLingualesComponent,
  ],
  imports: [
    CommonModule,
    CitasRoutingModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    NbProgressBarModule,
    NgxEchartsModule,
    NgxChartsModule,
    NgxMaterialTimepickerModule,
    LeafletModule,
    NbStepperModule,
    NbInputModule,
    NbRadioModule,
    NbLayoutModule,
    NbAccordionModule,
    ComboGenericoModule,
    RadioSelectGenericoModule,
    FullCalendarModule,
  ]
})
export class CitasModule { }
