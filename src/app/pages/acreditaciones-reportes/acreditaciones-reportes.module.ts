import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AcreditacionesReportesComponent } from "./pages/home/acreditaciones-reportes.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { AcreditacionesReportesRoutingModule } from "./acreditaciones-reportes-routing-module.routing";
import { ThemeModule } from "../../@theme/theme.module";

import { NgxEchartsModule } from "ngx-echarts";

import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { CustomPaginatorModule } from "../../shared/components/custom-paginator/custom-paginator.module";
import { ComboGenericoModule } from "../../shared/components/combo-generico/combo-generico.module";
import { InputGenericoModule } from "../../shared/components/input-generico/input-generico.module";
import { ParametriaPeriodoModule } from "../../shared/components/parametria-periodo/parametria-periodo.module";

//prueba para pipes
import { FechaFormatPipe } from "./pipes/fecha-format.pipe";
import { SafePipe } from "./pipes/safe.pipe";

import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
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
} from "@nebular/theme";
import { AtencionComponent } from "./pages/graficas/atencion/atencion/atencion.component";
import { VerticalBarComponent } from "./pages/graficas/verticalBar/verticalBar.component";
import { PieComponent } from "./pages/graficas/pie/pie.component";
import { HorizontalBarComponent } from "./pages/graficas/horizontalBar/horizontalBar.component";
import { DataTableComponent } from "./pages/graficas/DataTable/DataTable.component";

@NgModule({
  imports: [
    AcreditacionesReportesRoutingModule,
    CommonModule,
    //componentes

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
  ],
  declarations: [
    AcreditacionesReportesComponent,
    FechaFormatPipe,
    SafePipe,
    AtencionComponent,
    PieComponent,
    VerticalBarComponent,
    HorizontalBarComponent,
    DataTableComponent,
  ],
})
export class AcreditacionesReportesModule {}