import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArbolComponent, FsIconAComponent} from './arbol/arbol.component';
import { GestionPlanCuentasComponent } from './gestion-plan-cuentas/gestion-plan-cuentas.component';
import { RubrosComponent } from './rubros/rubros.component';
import { GestionApropiacionesComponent } from './gestion-apropiaciones/gestion-apropiaciones.component';
import { ListProductoComponent } from './productos/list-producto.component';
import { ListFuenteComponent } from './fuentes/list-fuente/list-fuente.component';
import { ListSolicitudCdpComponent } from './cdp/list-solicitud-cdp/list-solicitud-cdp.component';
import { ListCdpComponent } from './cdp/list-cdp/list-cdp.component';
import { ModificacionApropiacionComponent } from './modificacion-apropiacion/modificacion-apropiacion.component';
import { SetModificacionApropiacionComponent } from './modificacion-apropiacion/set-modificacion-apropiacion/set-modificacion-apropiacion.component';
import { ShowModificationAfectationComponent } from './modificacion-apropiacion/show-modification-afectation/show-modification-afectation.component';
import { ShowModificationResumeComponent } from './modificacion-apropiacion/show-modification-resume/show-modification-resume.component';
import { SolicitudCrpComponent } from './crp/solicitud-crp/solicitud-crp.component';
import { ListSolicitudCrpComponent } from './crp/list-solicitud-crp/list-solicitud-crp.component';
import { ListCrpComponent } from './crp/list-crp/list-crp.component';
import { ListModificacionApropiacionComponent } from './consulta-modificacion-apropiacion/list-modificacion-apropiacion.component';
import { ShowModificationApropiacionDataComponent } from './consulta-modificacion-apropiacion/show-modificacion-apropiacion/show-modificacion-apropiacion.component';
import { ListarVigenciaComponent } from './vigencia/listar-vigencia/listar-vigencia.component';
import { CierreVigenciaComponent } from './gestion-vigencias/cierre-vigencia/cierre-vigencia.component';

const routes: Routes = [{
  path: 'arbol',
  component: ArbolComponent,
},
{
  path: 'gestion-plan-cuentas',
  component: GestionPlanCuentasComponent,
},
{
  path: 'rubros',
  component: RubrosComponent,
},
{
  path: 'apropiaciones',
  component: GestionApropiacionesComponent,
},
{
  path: 'apropiaciones/:vista',
  component: GestionApropiacionesComponent,
},
{
  path: 'productos',
  component: ListProductoComponent,
},
{
  path: 'fuentes',
  component: ListFuenteComponent,
},
{
  path: 'solicitudcdp',
  component: ListSolicitudCdpComponent,
},
 {
  path: 'modificacion-apropiacion',
  component: ListModificacionApropiacionComponent,
},
{
  path: 'cdp',
  component: ListCdpComponent,
},
{
  path: 'crp',
  component: ListCrpComponent,
},
{
  path: '',
  redirectTo: 'rubros',
  pathMatch: 'full',
},
{
  path: 'form-solicitudcrp',
  component: SolicitudCrpComponent,
},
{
  path: 'solicitudcrp',
  component: ListSolicitudCrpComponent,
},
{
  path: 'list-modificacion-apropiacion',
  component: ListModificacionApropiacionComponent,
},
{
  path: 'listar-vigencias',
  component: ListarVigenciaComponent,
},
{
  path: 'cierre-vigencia/:vigencia/:areaf',
  component: CierreVigenciaComponent,
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanCuentasRoutingModule { }

export const routedComponents = [
  ArbolComponent,
  GestionPlanCuentasComponent,
  RubrosComponent,
  GestionApropiacionesComponent,
  ModificacionApropiacionComponent,
  FsIconAComponent,
  SetModificacionApropiacionComponent,
  ShowModificationAfectationComponent,
  ShowModificationResumeComponent,
  ShowModificationApropiacionDataComponent,
  ListModificacionApropiacionComponent,
  CierreVigenciaComponent,
];
