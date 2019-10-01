import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArbolComponent, FsIconAComponent} from './arbol/arbol.component';
import { GestionPlanCuentasComponent } from './gestion-plan-cuentas/gestion-plan-cuentas.component';
import { RubrosComponent } from './rubros/rubros.component';
import { GestionApropiacionesComponent } from './gestion-apropiaciones/gestion-apropiaciones.component';
import { ListProductoComponent } from './productos/list-producto.component';
import { ListFuenteComponent } from './fuentes/list-fuente/list-fuente.component';
import { ListSolicitudCdpComponent } from './cdp/list-solicitud-cdp/list-solicitud-cdp.component';
import { GestionCrpComponent } from './gestion-crp/gestion-crp.component';
import { ListCdpComponent } from './cdp/list-cdp/list-cdp.component';
import { ModificacionApropiacionComponent } from './modificacion-apropiacion/modificacion-apropiacion.component';
import { SetModificacionApropiacionComponent } from './modificacion-apropiacion/set-modificacion-apropiacion/set-modificacion-apropiacion.component';
import { ShowModificationAfectationComponent } from './modificacion-apropiacion/show-modification-afectation/show-modification-afectation.component';
import { ShowModificationResumeComponent } from './modificacion-apropiacion/show-modification-resume/show-modification-resume.component';





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
  component: ModificacionApropiacionComponent,
},
{
  path: 'cdp',
  component: ListCdpComponent,
},
{
  path: '',
  redirectTo: 'rubros',
  pathMatch: 'full',
},
{
  path: 'crp',
  component: GestionCrpComponent,
}

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
  GestionCrpComponent,
  SetModificacionApropiacionComponent,
  ShowModificationAfectationComponent,
  ShowModificationResumeComponent,
];
