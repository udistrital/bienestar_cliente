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
  NbTooltipModule,
  NbRadioModule,
  NbSpinnerModule,
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
import { ListCdpComponent } from './cdp/list-cdp/list-cdp.component';
import { ListCrpComponent } from './crp/list-crp/list-crp.component';
import { DetalleCrpComponent } from './crp/detalle-crp/detalle-crp.component';
import { ExpedirCrpComponent } from './crp/expedir-crp/expedir-crp.component';
import { ListSolicitudCrpComponent } from './crp/list-solicitud-crp/list-solicitud-crp.component';
import { VerSolicitudCrpComponent } from './crp/ver-solicitud-crp/ver-solicitud-crp.component';
import { SolicitudCrpComponent } from './crp/solicitud-crp/solicitud-crp.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ListModificacionApropiacionComponent } from './consulta-modificacion-apropiacion/list-modificacion-apropiacion.component';
import { RubrosFuenteComponent } from './fuentes/rubros-fuente/rubros-fuente.component';
import { AnulacionDocumentoComponent } from './anulacion-documento-pres/anulacion-documento.component';
import { SetModificacionFuenteComponent } from './modificacion-apropiacion/set-modificacion-fuente/set-modificacion-fuente.component';
import { ShowModificationFuenteComponent } from './modificacion-apropiacion/show-modification-fuente/show-modification-fuente.component';
import { CierreVigenciaComponent } from './gestion-vigencias/cierre-vigencia/cierre-vigencia.component';
import { PlanAdquisicionesRubroComponent } from './rubros/plan-adquisiciones-rubro/plan-adquisiciones-rubro.component';
import { ListAnulacionDocumentoComponent } from './list-anulacion-documento-pres/list-anulacion-documento.component';
import { ListarVigenciaComponent } from './vigencia/listar-vigencia/listar-vigencia.component';
import { ShowVigenciaComponent } from './vigencia/show-vigencia/show-vigencia.component';
import { ShowModificationApropiacionDataComponent } from './consulta-modificacion-apropiacion/show-modificacion-apropiacion/show-modificacion-apropiacion.component';
import { ReportesComponent } from '../reportes/components/reportes/reportes.component';

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
    ListCrpComponent,
    ListSolicitudCdpComponent,
    ListSolicitudCrpComponent,
    VerSolicitudCdpComponent,
    SolicitudCrpComponent,
    ListCdpComponent,
    VerSolicitudCrpComponent,
    ListModificacionApropiacionComponent,
    ShowModificationApropiacionDataComponent,
    RubrosFuenteComponent,
    AnulacionDocumentoComponent,
    SetModificacionFuenteComponent,
    ShowModificationFuenteComponent,
    CierreVigenciaComponent,
    PlanAdquisicionesRubroComponent,
    ListAnulacionDocumentoComponent,
    ListarVigenciaComponent,
    ShowVigenciaComponent,
    ExpedirCrpComponent,
    DetalleCrpComponent,
    ReportesComponent
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
    NbTooltipModule,
    NbSelectModule,
    NbRadioModule,
    NbAlertModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbStepperModule,
    NbCardModule,
    Ng2SmartTableModule,
    ToasterModule,
    MatStepperModule,
    CurrencyMaskModule,
    NbSpinnerModule
  ],
  exports: [
  ],
  entryComponents: [ListFuenteComponent],
})
export class PlanCuentasModule { }
