import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {InscripcionEstComponent} from './inscripcion-estudiante/inscripcion-est.component';
import {RevisionInscComponent} from './revision-insc/revision-insc.component';
import {NotFoundComponent} from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from '../@core/_guards/auth.guard';
import { RolesConstanst } from '../shared/constants/roles.constants';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        {
            path: 'inscripcion',
            component: InscripcionEstComponent,
            canActivate: [AuthGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE]
            }
        },
        {
            path: 'revision-estudiante/:id',
            component: InscripcionEstComponent,
            canActivate: [AuthGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE],
                esRevisionEstudiante: true,
            }
        },
        {
            path: 'revision-estudiante',
            component: RevisionInscComponent,
            canActivate: [AuthGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE],
                esRevisionEstudiante: true,
            }
        },
        {
            path: 'revision',
            component: RevisionInscComponent,
            canActivate: [AuthGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ADMIN_NECESITADES]
            }
        },
        {
            path: 'revision/:id',
            component: InscripcionEstComponent,
            canActivate: [AuthGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ADMIN_NECESITADES],
                esRevision: true,
            }
        },
        {
            path: '',
            redirectTo: 'revision-estudiante',
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
