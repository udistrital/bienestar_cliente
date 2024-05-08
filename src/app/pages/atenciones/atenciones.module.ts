import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListaAtencionesComponent } from "./lista-atenciones/lista-atenciones.component";
import { AtencionesRoutingModule } from "./atenciones-routing.module";
import { CrearAtencionComponent } from "./crear-atencion/crear-atencion.component";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [ListaAtencionesComponent, CrearAtencionComponent],
  imports: [
    CommonModule,
    AtencionesRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    MatStepperModule,
    ReactiveFormsModule,
  ],
})
export class AtencionesModule {}
