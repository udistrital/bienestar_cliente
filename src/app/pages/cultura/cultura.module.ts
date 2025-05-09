import { NgModule } from '@angular/core';
import {
    
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule, 
    NbStepperModule, 
    NbInputModule, 
    NbRadioModule, 
    NbLayoutModule, 
    NbAccordionModule,
    NbBadgeModule,
    
   
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ThemeModule } from '../../@theme/theme.module';
import {CulturaRoutingModule} from './cultura-routing.module'
import { CulturaComponent } from './cultura.component';
import { ActividadCulturalComponent } from './actividad-cultural/actividad-cultural.component';
import { GrupoCulturalComponent } from './grupo-cultural/grupo-cultural.component';
import { FormActCultComponent} from './actividad-cultural/form_act_cult/form_act_cult.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarioActividadComponent } from './actividad-cultural/calendario-actividad/calendario-actividad.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CargarEvidenciasComponent } from './actividad-cultural/cargar-evidencias/cargar-evidencias.component';
import { FormGrupCultComponent } from './grupo-cultural/form-grup-cult/form-grup-cult.component';
import { PrevActividadCulturalComponent } from './actividad-cultural/prev-actividad/prev-actividad-cult.component';
import { DialogoGruposCulturalesComponent } from './grupo-cultural/dialogo-grupos-culturales/dialogo-grupos-culturales.component';
import { DialogoEliminacionReunionesComponent } from './grupo-cultural/form-grup-cult/dialogo-eliminacion-reuniones/dialogo-eliminacion-reuniones.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogoEliminacionGruposCulturalesComponent } from './actividad-cultural/form_act_cult/dialogo-eliminacion-grupos-culturales/dialogo-eliminacion-grupos-culturales.component';
import { DialogoActividadesCulturalesComponent } from './actividad-cultural/dialogo-actividades-culturales/dialogo-actividades-culturales.component';
import { VerGruposCulturalesComponent } from './grupo-cultural/ver-grupos-culturales/ver-grupos-culturales.component';
import { SubirEvidenciasActividadesComponent } from './actividad-cultural/subir-evidencias-actividades/subir-evidencias-actividades.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
]);

@NgModule({
    imports: [
    ThemeModule,
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule, 
    NbStepperModule, 
    NbInputModule, 
    NbRadioModule, 
    NbLayoutModule, 
    NbAccordionModule,
    NbBadgeModule,
    NgxEchartsModule,
    NgxChartsModule, 
    LeafletModule, 
    CulturaRoutingModule,
    FullCalendarModule,
    NgxMaterialTimepickerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
   
    
    
    
        
    ],
    declarations: [
        CulturaComponent,
        ActividadCulturalComponent,
        GrupoCulturalComponent,
        FormActCultComponent,
        CalendarioActividadComponent,
        CargarEvidenciasComponent,
        FormGrupCultComponent,
        CargarEvidenciasComponent,
        PrevActividadCulturalComponent,
        DialogoGruposCulturalesComponent,
        DialogoEliminacionReunionesComponent,
        DialogoEliminacionGruposCulturalesComponent,
        DialogoActividadesCulturalesComponent,
        VerGruposCulturalesComponent,
        SubirEvidenciasActividadesComponent
        
        
    ],
    providers: [

    ],
    entryComponents: [
        DialogoActividadesCulturalesComponent,
        DialogoGruposCulturalesComponent,
        DialogoEliminacionReunionesComponent,
        DialogoEliminacionGruposCulturalesComponent
    ]
})

export class CulturaModule {  }
