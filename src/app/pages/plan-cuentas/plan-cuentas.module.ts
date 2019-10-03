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
import { MatStepperModule } from '@angular/material';
import { DependenciasComponent } from './dependencias/dependencias.component';
import { ListSolicitudCdpComponent } from './cdp/list-solicitud-cdp/list-solicitud-cdp.component';
import { VerSolicitudCdpComponent } from './cdp/ver-solicitud-cdp/ver-solicitud-cdp.component';
import { SolicitudCrpComponent } from './solicitud-crp/solicitud-crp.component';
import { ConsultaCrpComponent } from './consulta-crp/consulta-crp.component';
import { GestionCrpComponent } from './gestion-crp/gestion-crp.component';
import { ListCdpComponent } from './cdp/list-cdp/list-cdp.component';
import { VerSolicitudCrpComponent } from '../ver-solicitud-crp/ver-solicitud-crp.component';



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

    ListSolicitudCdpComponent,
    VerSolicitudCdpComponent,
    SolicitudCrpComponent,
    ConsultaCrpComponent,
    GestionCrpComponent,
    ListCdpComponent,
    VerSolicitudCrpComponent,
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
    MatStepperModule,
  ],
  exports: [
  ],
  entryComponents: [ListFuenteComponent],
})
export class PlanCuentasModule { }
