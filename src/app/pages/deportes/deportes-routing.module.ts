import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeportesComponent } from './deportes.component';
import { AuthGuard } from '../../@core/_guards/auth.guard';
import { RolesConstanst } from '../../shared/constants/roles.constants';
import { EventosComponent } from './eventos/eventos.component';


const routes: Routes = [
  {
    path: '',
    component: DeportesComponent
  },
  {
    path: 'eventos',
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.ESTUDIANTE]
    },
    children: [
      {
        path: 'eventos', 
        component: EventosComponent
      },
    
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeportesRoutingModule { }

