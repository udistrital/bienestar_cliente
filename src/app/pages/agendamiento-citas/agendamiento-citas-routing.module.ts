import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetalleCitaComponent } from './detalle-cita/detalle-cita.component';


const routes: Routes = [{
  path: 'cita',
  component: DetalleCitaComponent,
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendamientoCitasRoutingModule { }
