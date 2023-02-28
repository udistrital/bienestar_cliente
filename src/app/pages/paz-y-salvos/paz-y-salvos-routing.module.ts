import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { GenerarPazysalvoComponent } from './pages/generar-pazysalvo/generar-pazysalvo.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';


const routes: Routes = [
  {
    path: "", 
   // component:HomeComponent,
    children: [
      
      { path: "generar",
       component: GenerarPazysalvoComponent },
      { path: "consultas",
       component: ConsultasComponent },

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
