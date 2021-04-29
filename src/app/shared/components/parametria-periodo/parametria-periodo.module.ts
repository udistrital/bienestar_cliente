import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametriaPeriodoComponent } from './parametria-periodo.component';
import { NbButtonModule, NbCalendarModule, NbCardModule } from '@nebular/theme';



@NgModule({
  declarations: [ParametriaPeriodoComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbCalendarModule,
    NbButtonModule,
  ],
  exports:[ParametriaPeriodoComponent],
})
export class ParametriaPeriodoModule { }
