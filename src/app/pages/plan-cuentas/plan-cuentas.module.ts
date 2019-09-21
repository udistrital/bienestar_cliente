import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { PlanCuentasRoutingModule, routedComponents } from './plan-cuentas-routing.module';
import { SharedModule } from '../../shared/shared.module';
import {
  NbTreeGridModule,
  NbSelectModule,
  NbAlertModule,
  NbTabsetModule,
  NbStepperModule,
  NbCardModule,
  NbCheckboxModule } from '@nebular/theme';

import { ProductosRubroComponent } from './rubros/productos-rubro/productos-rubro.component';
import { ComprobacionApropiacionInicialComponent } from './comprobacion-apropiacion-inicial/comprobacion-apropiacion-inicial.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ApropiacionesComponent } from './apropiaciones/apropiaciones.component';
import { ConsultaVigenciaComponent } from './consulta-vigencia/consulta-vigencia.component';
import { ListFuenteComponent } from './fuentes/list-fuente/list-fuente.component';
import { ListProductoComponent } from './productos/list-producto.component';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { ConfiguracionService } from '../../@core/data/configuracion.service';
import { DependenciasComponent } from './dependencias/dependencias.component';



@NgModule({
  declarations: [
    ...routedComponents,
    ProductosRubroComponent,
    ComprobacionApropiacionInicialComponent,
    ApropiacionesComponent,
    ConsultaVigenciaComponent,
    ListFuenteComponent,
    ListProductoComponent,
    DependenciasComponent,
  ],
  providers: [
    ConfiguracionService,
    ToasterService,
  ],
  imports: [
    ThemeModule,
    SharedModule,
    CommonModule,
    PlanCuentasRoutingModule,
    NbTreeGridModule,
    NbSelectModule,
    NbAlertModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbStepperModule,
    NbCardModule,
    Ng2SmartTableModule,
    ToasterModule,
  ],
  exports: [
  ],
  entryComponents: [ListFuenteComponent],
})
export class PlanCuentasModule { }
