import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
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

import { ReliquidacionRoutingModule } from './reliquidacion-routing.module';
import { ListaEstudiantesReliquidacionComponent } from './lista-estudiantes-reliquidacion/lista-estudiantes-reliquidacion.component';

import { ConfiguracionService } from '../../@core/data/configuracion.service';

@NgModule({
  declarations: [
    // ...routedComponents,
    ListaEstudiantesReliquidacionComponent,
  ],
  providers: [
      ConfiguracionService,
    ],
  imports: [
    ThemeModule,
    CommonModule,
    ReliquidacionRoutingModule,
    NbTreeGridModule,
    NbSelectModule,
    NbAlertModule,
    NbTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbTooltipModule,
    NbRadioModule,
    NbSpinnerModule,
    NbCheckboxModule,
  ]
})
export class ReliquidacionModule { }
