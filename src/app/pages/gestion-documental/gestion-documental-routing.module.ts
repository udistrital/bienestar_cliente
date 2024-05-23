import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { GestionDocumentalComponent } from './gestion-documental.component';
import { CargarComponent } from './cargar/cargar.component';
import { ConsultarComponent } from './consultar/consultar.component';
import { GestorDocumentosComponent } from './gestor-documentos/gestor-documentos.component';
import { AuthGuard } from '../../@core/_guards/auth.guard';
import { RolesConstanst } from '../../shared/constants/roles.constants';

const routes: Routes = [
  {
    path: '', 
    component: GestionDocumentalComponent, 
  },
  {
    path: 'cargar', 
    component: CargarComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.SUPERADMIN_DOCUMENTAL, 
        RolesConstanst.ROLES_SISTEMA.ADMINISTRADOR_DOCUMENTAL]
    }
  },
  {
    path: 'consultar',
    component: ConsultarComponent
  },
  {
    path: 'gestor',
    component: GestorDocumentosComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.SUPERADMIN_DOCUMENTAL, 
        RolesConstanst.ROLES_SISTEMA.FUNCIONARIO_DOCUMENTAL]
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class GestionDocumentalRoutingModule {
}
