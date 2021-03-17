import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule, NbStepperModule, NbInputModule, NbRadioModule, NbLayoutModule, NbAccordionModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ThemeModule } from '../../@theme/theme.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ComboGenericoModule } from '../../shared/components/combo-generico/combo-generico.module';
import { RadioSelectGenericoModule } from '../../shared/components/radio-select-generico/radio-select-generico.module';
import { ApoyoAlimentarioRoutingModule } from './apoyo-alimentario-routing.module';
import { ApoyoAlimentarioComponent } from './apoyo-alimentario.component';
import { InscritosComponent } from './registro/inscritos/inscritos.component';
import { MiscellaneousModule } from '../miscellaneous/miscellaneous.module';
import { NoInscritosComponent } from './registro/no-inscritos/no-inscritos.component';
import { ConsultarComponent } from './registro/consultar/consultar.component';
import { FechasComponent } from './administracion/fechas/fechas.component';
import { PeriodosComponent } from './administracion/periodos/periodos.component';
import { ConsultarCodigoComponent } from './administracion/consultar-codigo/consultar-codigo.component';
import { InformacionEstudianteComponent } from './administracion/informacion-estudiante/informacion-estudiante.component';
import { FechaCrudComponent } from './administracion/fecha-crud/fecha-crud.component';
import { SolicitudTerceroComponent } from './inscripciones/solicitud-tercero/solicitud-tercero.component';
import { SolicitudesComponent } from './inscripciones/solicitudes/solicitudes.component';

@NgModule({
    imports: [
        ApoyoAlimentarioRoutingModule,
        MiscellaneousModule,
        ThemeModule,
        CommonModule,
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
        LeafletModule,
        NbStepperModule,
        NbInputModule,
        NbRadioModule,
        NbLayoutModule,
        NbAccordionModule,
        ComboGenericoModule,
        RadioSelectGenericoModule,
    ],
  declarations: [ 
    ApoyoAlimentarioComponent,
    InscritosComponent,
    NoInscritosComponent,
    ConsultarComponent,
    FechasComponent,
    PeriodosComponent,
    ConsultarCodigoComponent,
    InformacionEstudianteComponent,
    FechaCrudComponent,
    SolicitudTerceroComponent,
    SolicitudesComponent,
   ],
  providers: [

  ],
})

export class ApoyoAlimentarioModule { }
