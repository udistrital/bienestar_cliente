import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CulturaComponent } from '../cultura/cultura.component';
import { AuthGuard } from '../../@core/_guards/auth.guard';
import { RolesConstanst } from '../../shared/constants/roles.constants';
import { ActividadCulturalComponent }from './actividad-cultural/actividad-cultural.component';
import { GrupoCulturalComponent }from './grupo-cultural/grupo-cultural.component';
import {FormActCultComponent}from './actividad-cultural/form_act_cult/form_act_cult.component';
import {FormGrupCultComponent}from './grupo-cultural/form-grup-cult/form-grup-cult.component';
import { CalendarioActividadComponent } from './actividad-cultural/calendario-actividad/calendario-actividad.component';
import { CargarEvidenciasComponent } from './actividad-cultural/cargar-evidencias/cargar-evidencias.component';
import { PrevActividadCulturalComponent } from './actividad-cultural/prev-actividad/prev-actividad-cult.component';
import { VerGruposCulturalesComponent } from './grupo-cultural/ver-grupos-culturales/ver-grupos-culturales.component';

const routes: Routes = [{
        path: '',        
        children: [
            {path: 'actividad-cultural',component: ActividadCulturalComponent },
            {path: 'actividad-cultural/calendario-actividad',component: CalendarioActividadComponent },
            {path: 'actividad-cultural/crear_act_cult',component: FormActCultComponent },
            {path: 'actividad-cultural/editar_act_cult/:id',component: FormActCultComponent },
            {path: 'actividad-cultural/cargar-evidencias',component: CargarEvidenciasComponent },
            {path: 'grupo-cultural',component: GrupoCulturalComponent},
            {path: 'grupo-cultural/crear_grup_cult',component: FormGrupCultComponent},
            {path: 'grupo-cultural/editar_grup_cult/:id',component: FormGrupCultComponent},
            {path: 'grupo-cultural/ver-grupos-culturales',component: VerGruposCulturalesComponent},
            {path: 'actividad-cultural/prev-actividad',component: PrevActividadCulturalComponent },
            { path: '**', redirectTo: '' },
        ],    
    },]   

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
    
    })
export class CulturaRoutingModule{
}