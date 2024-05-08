import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    NbBadgeModule
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

import { ConsultarComponent } from './registro/consultar/consultar.component';
import { PeriodosComponent } from './administracion/periodos/periodos.component';
import { SolicitudTerceroComponent } from './inscripciones/solicitud-tercero/solicitud-tercero.component';
import { SolicitudesComponent } from './inscripciones/solicitudes/solicitudes.component';
import { EvaluarSolicitudComponent } from './inscripciones/evaluar-solicitud/evaluar-solicitud.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { BuscarSolicitudComponent } from './inscripciones/buscar-solicitud/buscar-solicitud.component';
import { FechaFormatPipe } from './pipes/fecha-format.pipe';
import { CargarDocPbComponent } from './inscripciones/cargar-doc-pb/cargar-doc-pb.component';
import { ArchivosGenericoModule } from '../../shared/components/archivos-generico/archivos-generico.module';
import { SafePipe } from './pipes/safe.pipe';
import { CrearSolicitudComponent } from './inscripciones/crear-solicitud/crear-solicitud.component';
import { EvaluacionMasivaComponent } from './inscripciones/evaluacion-masiva/evaluacion-masiva.component';
import { ReportesComponent } from './reportes/reportes.component';
import { FallasJustificadasComponent } from './registro/fallas-justificadas/fallas-justificadas.component';

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
        NbCheckboxModule,
        NgxEchartsModule,
        NgxChartsModule,
        NgxPaginationModule,
        LeafletModule,
        NbStepperModule,
        NbInputModule,
        NbRadioModule,
        NbLayoutModule,
        NbAccordionModule,
        ComboGenericoModule,
        RadioSelectGenericoModule,
        NbBadgeModule,
        ArchivosGenericoModule
    ],
  declarations: [ 
    ApoyoAlimentarioComponent,
    InscritosComponent,
    ConsultarComponent,
    PeriodosComponent,
    SolicitudTerceroComponent,
    SolicitudesComponent,
    EvaluarSolicitudComponent,
    BuscarSolicitudComponent,
    FechaFormatPipe,
    CargarDocPbComponent,
    SafePipe,
    CrearSolicitudComponent,
    EvaluacionMasivaComponent,
    ReportesComponent,
    FallasJustificadasComponent
   ],
  providers: [

  ],
})

export class ApoyoAlimentarioModule { }
