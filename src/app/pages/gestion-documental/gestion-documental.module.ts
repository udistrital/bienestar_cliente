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
  NbDatepickerModule,

} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ThemeModule } from '../../@theme/theme.module';

import { GestionDocumentalComponent } from './gestion-documental.component';
import { GestionDocumentalRoutingModule } from './gestion-documental-routing.module';
import { CargarComponent } from './cargar/cargar.component';
import { ConsultarComponent } from './consultar/consultar.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GestionService } from './gestion-documental.service';
import { ApiRestService } from './api-rest.service';
import { ResultadosComponent } from './resultados/resultados.component';
import { MatSortModule } from '@angular/material/sort';
// const routes: Routes = [
//   { path: '', component: GestionDocumentalComponent }
// ]

@NgModule({
  declarations: [
    GestionDocumentalComponent,
    CargarComponent,
    ConsultarComponent,
    ResultadosComponent
  ],
  providers: [ApiRestService, GestionService],
  imports: [
    HttpClientModule,
    CommonModule,
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
    NgxEchartsModule,
    NgxChartsModule,
    GestionDocumentalRoutingModule,
    FormsModule,
    NbDatepickerModule.forRoot(),
    MatSortModule
  ]
})
export class GestionDocumentalModule { }
