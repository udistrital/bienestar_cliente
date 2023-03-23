import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListaAtencionesComponent } from "./lista-atenciones/lista-atenciones.component";
import { AtencionesRoutingModule } from "./atenciones-routing.module";

@NgModule({
  declarations: [ListaAtencionesComponent],
  imports: [CommonModule, AtencionesRoutingModule],
})
export class AtencionesModule {}
