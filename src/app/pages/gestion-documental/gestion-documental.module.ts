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
  NbWindowModule,
  NbTooltipModule,
  NbSpinnerModule,
  NbBadgeModule,

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
import { AlertToastService } from './alert-toast.service';
import { GestorDocumentosComponent } from './gestor-documentos/gestor-documentos.component';
import { EditorTextoComponent } from './editor-texto/editor-texto.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { DocumentoService } from '../../@core/data/documento.service';
// const routes: Routes = [
//   { path: '', component: GestionDocumentalComponent }
// ]

@NgModule({
  declarations: [
    GestionDocumentalComponent,
    CargarComponent,
    ConsultarComponent,
    ResultadosComponent,
    GestorDocumentosComponent,
    EditorTextoComponent,
  ],
  providers: [ApiRestService, GestionService,AlertToastService,DocumentoService],
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
    MatSortModule,
    NbWindowModule.forRoot(),
    NbSpinnerModule,
    NbBadgeModule,
    NbTooltipModule,
    CKEditorModule,
  ]
})
export class GestionDocumentalModule { }
