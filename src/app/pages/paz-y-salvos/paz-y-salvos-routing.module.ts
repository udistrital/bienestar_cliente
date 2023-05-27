import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { GenerarPazysalvoComponent } from './pages/generar-pazysalvo/generar-pazysalvo.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';


const routes: Routes = [
  {
    path: "", 
   // component:HomeComponent,
    children: [
      
      { path: "generar/:idSolicitud",
       component: GenerarPazysalvoComponent },
      { path: "consultas",
       component: ConsultasComponent },
      { path: "solicitar", component: SolicitudComponent },
      { path: "", 
      component: HomeComponent },
      { path: "**", redirectTo: "" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), 

  ],
  exports: [RouterModule],
})




export class PazYSalvosRoutingModule { }
