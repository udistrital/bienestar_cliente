import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CulturaComponent } from '../cultura/cultura.component';
import { AuthGuard } from '../../@core/_guards/auth.guard';
import { RolesConstanst } from '../../shared/constants/roles.constants';
import { ActividadCulturalComponent }from './actividad-cultural/actividad-cultural.component';
import { GrupoCulturalComponent }from './grupo-cultural/grupo-cultural.component';
import {FormActCultComponent}from './actividad-cultural/form_act_cult/form_act_cult.component'
import { CalendarioActividadComponent } from './actividad-cultural/calendario-actividad/calendario-actividad.component';
import { CargarEvidenciasComponent } from './actividad-cultural/cargar-evidencias/cargar-evidencias.component';

const routes: Routes = [{
        path: '',        
        children: [
            {path: 'actividad-cultural',component: ActividadCulturalComponent },
            {path: 'actividad-cultural/calendario-actividad',component: CalendarioActividadComponent },
            {path: 'actividad-cultural/form_act_cult',component: FormActCultComponent },
            {path: 'actividad-cultural/cargar-evidencias',component: CargarEvidenciasComponent },
            {path: 'grupo-cultural',component: GrupoCulturalComponent},
            
            { path: '**', redirectTo: '' },
        ],    
    },]   

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
    })
export class CulturaRoutingModule{
}