import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {InscripcionEstComponent} from './inscripcion-estudiante/inscripcion-est.component';
import {RevisionInscComponent} from './revision-insc/revision-insc.component';
import {NotFoundComponent} from './miscellaneous/not-found/not-found.component';

import { HomeComponent } from './home/home.component';
import { ApoyoAlimentarioComponent } from './apoyo-alimentario/apoyo-alimentario.component';
import { InscritosComponent } from './apoyo-alimentario/registro/inscritos/inscritos.component';
import { CulturaModule} from './cultura/cultura.module';

import { AuthGuard } from '../@core/_guards/auth.guard';
import { RolesConstanst } from '../shared/constants/roles.constants';
import { ParametriaGuard } from '../@core/_guards/parametria.guard';
import { CulturaComponent } from './cultura/cultura.component';


const routes: Routes = [
    {
    path: '',
    component: PagesComponent,
    children: [
        
        /* {
            path: '',
            redirectTo: 'revision-estudiante',
            pathMatch: 'full',
        }, */
        {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
        },
        {
            path: 'home',
            component: HomeComponent,
        },
        {
            path:'cultura', 
            loadChildren: ( ) =>import ('./cultura/cultura.module')
            .then (m => m.CulturaModule),
            /**component: CulturaComponent,
            canActivate: [AuthGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ADMIN_BIENESTAR]
                //,RolesConstanst.ROLES_SISTEMA.ESTUDIANTE       
            }    **/           
        },

        {
            path: 'inscripcion',
            component: InscripcionEstComponent,
            canActivate: [AuthGuard, ParametriaGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE]
            }
        },
        {
            path: 'revision/:id',
            component: InscripcionEstComponent,
            canActivate: [AuthGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ADMIN_BIENESTAR],
                esRevision: true,
            }
        },
        {
            path: 'revision-estudiante/:id',
            component: InscripcionEstComponent,
            canActivate: [AuthGuard, ParametriaGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE],
                esRevisionEstudiante: true,
            }
        },
        {
            path: 'revision-estudiante',
            component: RevisionInscComponent,
            canActivate: [AuthGuard, ParametriaGuard],
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
                roles:[RolesConstanst.ROLES_SISTEMA.ADMIN_BIENESTAR]
            }
        },
        
        {
            path: 'apoyo-alimentario',
            component: ApoyoAlimentarioComponent,
            canActivate: [AuthGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ADMIN_BIENESTAR]
            }
        },  
        {
            path:'citas', 
            loadChildren: ( ) =>import ('./citas/citas.module')
            .then (m => m.CitasModule),
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
