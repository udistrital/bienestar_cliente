import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
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