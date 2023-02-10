import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeportesRoutingModule } from './deportes-routing.module';
import { DeportesComponent } from './deportes.component';
import { EventosComponent } from './eventos/eventos.component';




@NgModule({
  declarations: [EventosComponent],
  imports: [
    CommonModule,
    DeportesRoutingModule
  ]
})
export class DeportesModule { }
