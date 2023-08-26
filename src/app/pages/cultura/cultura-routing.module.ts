import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CulturaComponent } from '../cultura/cultura.component';
import { AuthGuard } from '../../@core/_guards/auth.guard';
import { RolesConstanst } from '../../shared/constants/roles.constants';
import { ActividadCulturalComponent }from './actividad-cultural/actividad-cultural.component';
import { GrupoCulturalComponent }from './grupo-cultural/grupo-cultural.component';


const routes: Routes = [
    {
        path: '',
        component: CulturaComponent,
        children: [
            {
                path: 'actividad-cultural',
                canActivate: [AuthGuard],
                data: {
                    roles: [RolesConstanst.ROLES_SISTEMA.ADMIN_BIENESTAR, RolesConstanst.ROLES_SISTEMA.ADMIN_CULTURA]
                },
                component: ActividadCulturalComponent
            },
            
            {
                path: 'grupo-cultural',
                canActivate: [AuthGuard],
                data: {
                    roles: [RolesConstanst.ROLES_SISTEMA.ADMIN_BIENESTAR, RolesConstanst.ROLES_SISTEMA.ADMIN_CULTURA]
                },
                component: GrupoCulturalComponent
            },
        ],
    
    },  

    {
        path: '**',
        redirectTo: "" 
    }
]   

@NgModule({
    imports: [
      RouterModule.forChild(routes),
      //RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule],
  })
export class CulturaRoutingModule{
}