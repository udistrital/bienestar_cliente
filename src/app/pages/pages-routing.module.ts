import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

import { AgendamientoCitasGuard } from '../@core/_guards/agendamiento-citas.guard';

import { EstudiantesComponent} from './apoyo-alimentario/estudiantes/estudiantes.component';
import { ApoyoAlimentarioComponent } from './apoyo-alimentario/apoyo-alimentario.component';
import { EstudianteGuardGuard } from '../@core/_guards/estudiante.guard';
import { DocumentosComponent } from './reliquidacion/documentos/documentos.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {

      path: 'agendamiento-citas',
      loadChildren: () => import('./agendamiento-citas/agendamiento-citas.module')
      .then(m => m.AgendamientoCitasModule),
      canActivate: [AgendamientoCitasGuard]

      path: 'apoyo-alimentario',
      component: ApoyoAlimentarioComponent, canActivate: [EstudianteGuardGuard]

    },
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'documentos',
      component: DocumentosComponent,
    },
    {
      path: 'plan-cuentas',
      loadChildren: () => import('./plan-cuentas/plan-cuentas.module')
      .then(m => m.PlanCuentasModule),
    },
    {
      path: 'reliquidacion',
      loadChildren: () => import('./reliquidacion/reliquidacion.module')
      .then(m => m.ReliquidacionModule),
    },
    {
      path: '',
      redirectTo: 'reliquidacion',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
