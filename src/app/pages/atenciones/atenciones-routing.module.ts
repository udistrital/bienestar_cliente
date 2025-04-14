import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ListaAtencionesComponent } from "./lista-atenciones/lista-atenciones.component";
import { CrearAtencionComponent } from "./crear-atencion/crear-atencion.component";

const routes: Routes = [
  {
    path: "",
    children: [
      { path: "atenciones", component: ListaAtencionesComponent },
      { path: "crear", component: CrearAtencionComponent },
      { path: "", component: ListaAtencionesComponent },
      { path: "**", redirectTo: "" },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AtencionesRoutingModule {}
