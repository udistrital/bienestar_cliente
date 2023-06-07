import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcreditacionesReportesComponent } from './pages/home/acreditaciones-reportes.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AcreditacionesReportesRoutingModule } from './acreditaciones-reportes-routing-module.routing';
import { PruebaComponent } from './pages/graficas/prueba/prueba.component';

@NgModule({
  imports: [
    //PruebaComponent,
    AcreditacionesReportesRoutingModule,
    CommonModule,
    NgxChartsModule,


    //componentes


  ],
  declarations: [AcreditacionesReportesComponent]
})
export class AcreditacionesReportesModule { }
