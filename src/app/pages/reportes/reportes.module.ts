import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './components/reportes/reportes.component';


import {
  NbCardModule } from '@nebular/theme';

@NgModule({
  declarations: [ReportesComponent,],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    NbCardModule,
  ]
})
export class ReportesModule { }
