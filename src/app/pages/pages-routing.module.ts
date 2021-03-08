import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {InscripcionEstComponent} from './inscripcion-estudiante/inscripcion-est.component';
import {RevisionInscComponent} from './revision-insc/revision-insc.component';
import {NotFoundComponent} from './miscellaneous/not-found/not-found.component';
import { CitaComponent } from './citas/cita/cita.component';
import { EspecialistaComponent } from './citas/especialista/especialista.component';
import { PacienteComponent } from './citas/paciente/paciente.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        
        {
            path: 'inscripcion',
            component: InscripcionEstComponent,
        },
        {
            path: 'revision',
            component: RevisionInscComponent,
        },
        {
            path: '',
            redirectTo: 'inscripcion',
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
