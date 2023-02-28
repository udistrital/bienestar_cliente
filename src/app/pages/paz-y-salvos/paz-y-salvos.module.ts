import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { PazYSalvosRoutingModule } from './paz-y-salvos-routing.module';
import { GenerarPazysalvoComponent } from './pages/generar-pazysalvo/generar-pazysalvo.component';
import { TablaPazysalvosComponent } from './components/tabla-pazysalvos/tabla-pazysalvos.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { ThemeModule } from '../../@theme/theme.module';




@NgModule({
  declarations: [
  HomeComponent,
  GenerarPazysalvoComponent,
  TablaPazysalvosComponent,
  ConsultasComponent
],
  imports: [
    CommonModule,
    //import para routing
    PazYSalvosRoutingModule,

    //imports del material
    ThemeModule
  ]
})
export class PazYSalvosModule { }
