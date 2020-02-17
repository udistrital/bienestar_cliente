import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';

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

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    NbCardModule
  ]
})
export class ReportesModule { }
