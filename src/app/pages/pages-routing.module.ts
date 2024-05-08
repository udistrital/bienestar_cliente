import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { InscripcionEstComponent } from "./inscripcion-estudiante/inscripcion-est.component";
import { RevisionInscComponent } from "./revision-insc/revision-insc.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";


import { GrupoCulturalComponent } from './cultura/grupo-cultural/grupo-cultural.component';
import { ActividadCulturalComponent } from './cultura/actividad-cultural/actividad-cultural.component';
import { HomeComponent } from "./home/home.component";
import { ApoyoAlimentarioComponent } from "./apoyo-alimentario/apoyo-alimentario.component";
import { InscritosComponent } from "./apoyo-alimentario/registro/inscritos/inscritos.component";

import { AuthGuard } from "../@core/_guards/auth.guard";
import { RolesConstanst } from "../shared/constants/roles.constants";
import { ParametriaGuard } from "../@core/_guards/parametria.guard";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [      
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
            /*component: CulturaComponent,
            canActivate: [AuthGuard],
            data:{
                roles:[RolesConstanst.ROLES_SISTEMA.ADMIN_BIENESTAR]
                //,RolesConstanst.ROLES_SISTEMA.ESTUDIANTE       
            }  */          
        },
        
        {
            path:'cultura/grupo-cultural',
            component: GrupoCulturalComponent,
            canActivate: [AuthGuard, ParametriaGuard],
            /*data: {
                roles:[RolesConstanst.ROLES_SISTEMA.lIDER_CULTURA, RolesConstanst.ROLES_SISTEMA.ADMIN_CULTURA]
            }
            */
        },
        {
            path:'cultura/actividad-cultural',
            component: ActividadCulturalComponent,
            canActivate: [AuthGuard, ParametriaGuard],
            data: {
                roles:[RolesConstanst.ROLES_SISTEMA.CULTURA]
            }

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
            loadChildren: ( ) =>import ('./apoyo-alimentario/apoyo-alimentario.module')
            .then (m => m.ApoyoAlimentarioModule),
        },  
        {
            path:'citas', 
            loadChildren: ( ) =>import ('./citas/citas.module')
            .then (m => m.CitasModule),
        },
        {
            path: '',
            redirectTo: 'home',
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
