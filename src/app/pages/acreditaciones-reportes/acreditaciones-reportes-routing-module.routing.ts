import { Routes, RouterModule } from "@angular/router";
import { AcreditacionesReportesComponent } from "./pages/home/acreditaciones-reportes.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: "",
    // component:HomeComponent,
    children: [
      // { path: "prueba", component: PruebaComponent },
      { path: "", component: AcreditacionesReportesComponent },
      { path: "**", redirectTo: "" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcreditacionesReportesRoutingModule {}
