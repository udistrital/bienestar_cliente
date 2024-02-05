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
    NbCalendarRangeYearCellComponent,
    
   
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
    
    
    
    
        
    ],
    declarations: [
        CulturaComponent,
        ActividadCulturalComponent,
        GrupoCulturalComponent,
        FormActCultComponent,
        CalendarioActividadComponent,
        CargarEvidenciasComponent,
        
        
    ],
    providers: [

    ],
})

export class CulturaModule {  }
