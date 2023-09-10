import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { PazYSalvosRoutingModule } from './paz-y-salvos-routing.module';
import { GenerarPazysalvoComponent } from './pages/generar-pazysalvo/generar-pazysalvo.component';
import { TablaPazysalvosComponent } from './components/tabla-pazysalvos/tabla-pazysalvos.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxPaginationModule} from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
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

import {MatPaginatorModule} from '@angular/material/paginator'; 


import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CustomPaginatorModule } from '../../shared/components/custom-paginator/custom-paginator.module';
import { ComboGenericoModule } from '../../shared/components/combo-generico/combo-generico.module';
import { InputGenericoModule } from '../../shared/components/input-generico/input-generico.module';
import { ParametriaPeriodoModule } from '../../shared/components/parametria-periodo/parametria-periodo.module';


//prueba para pipes
import { FechaFormatPipe } from './pipes/fecha-format.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';
import { PdfMakerComponent } from './components/pdfmaker/pdfMaker/pdfMaker.component';
import { Base64imagesComponent } from './components/base64/base64images/base64images.component';

@NgModule({
  declarations: [
  HomeComponent,
  GenerarPazysalvoComponent,
  TablaPazysalvosComponent,
  ConsultasComponent,
  PdfMakerComponent,
  Base64imagesComponent,

  //declaracion de prueba para pipes de apoyo
  FechaFormatPipe,
  SafePipe,
  SolicitudComponent,
],
  imports: [FormsModule ,
    CommonModule,
    NgxPaginationModule,
    //import para routing
    PazYSalvosRoutingModule,

    //IMPORTES DE PREUBA PARA PAGINADOSR
    MatPaginatorModule,

    //imports de pruebs
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
    LeafletModule,
    NbStepperModule,
    NbInputModule,
    NbRadioModule,
    NbLayoutModule,
    NbAccordionModule,
    CustomPaginatorModule,
    ComboGenericoModule,
    InputGenericoModule,
    ParametriaPeriodoModule,

    //imports del material
    ThemeModule
  ]
  
})
export class PazYSalvosModule { }
