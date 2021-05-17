import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { NotFoundComponent } from '../miscellaneous/not-found/not-found.component';
import { ApoyoAlimentarioComponent } from '../apoyo-alimentario/apoyo-alimentario.component';
import { InscritosComponent } from './registro/inscritos/inscritos.component'
import { ConsultarComponent } from './registro/consultar/consultar.component'
import { PeriodosComponent } from './administracion/periodos/periodos.component'
import { SolicitudTerceroComponent } from './inscripciones/solicitud-tercero/solicitud-tercero.component';
import { SolicitudesComponent } from './inscripciones/solicitudes/solicitudes.component';
import { EvaluarSolicitudComponent } from './inscripciones/evaluar-solicitud/evaluar-solicitud.component';
import { PeriodoComponent } from './informes/periodo/periodo.component';
import { DiarioComponent } from './informes/diario/diario.component';
import { InformePeriodoComponent } from './informes/informe-periodo/informe-periodo.component';
import { InformeDiarioComponent } from './informes/informe-diario/informe-diario.component';
import { BuscarSolicitudComponent } from './inscripciones/buscar-solicitud/buscar-solicitud.component';
import { EvaluacionMasivaComponent } from './inscripciones/evaluacion-masiva/evaluacion-masiva.component';
import { EstudiantePeriodoComponent } from './informes/estudiante-periodo/estudiante-periodo.component';
import { AuthGuard } from '../../@core/_guards/auth.guard';
import { RolesConstanst } from '../../shared/constants/roles.constants';

const routes: Routes = [
  {
    path: '',
    component: ApoyoAlimentarioComponent
  },
  {
    path: 'registro',
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.ADMIN_NECESITADES]
    },
    children: [
      {
        path: 'consultar', component: ConsultarComponent
      },
      {
        path: 'consultar/:id', component: ConsultarComponent
      },
      {
        path: 'diario',
        component: InscritosComponent
      },
      {
        path: '**', component: NotFoundComponent
      },

    ],
  },
  {
    path: 'solicitud',
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.ESTUDIANTE]
    },
    component: SolicitudTerceroComponent
  },
  {
    path: 'inscripciones',
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.ADMIN_NECESITADES]
    },
    children: [
      {
        path: 'evaluacion-masiva', component: EvaluacionMasivaComponent
      },
      {
        path: 'buscarSolicitud', component: BuscarSolicitudComponent
      },
      {
        path: ':solicitudes', component: SolicitudesComponent
      },
      {
        path: ':solicitudes/:idSolicitud', component: EvaluarSolicitudComponent
      },
      {
        path: '**', component: NotFoundComponent
      },

    ],
  },
  {
    path: 'informes',
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.ADMIN_NECESITADES]
    },
    children: [
      {
        path: 'periodo', component: PeriodoComponent
      },
      {
        path: 'periodo/:idPeriodo', component: InformePeriodoComponent
      },
      {
        path: 'diario', component: DiarioComponent
      },
      {
        path: 'diario/:fecha', component: InformeDiarioComponent
      },
      {
        path: 'estudiante-periodo', component: EstudiantePeriodoComponent
      },
      {
        path: '**', component: NotFoundComponent
      },

    ],
  },
  {
    path: 'administracion',
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.ADMIN_NECESITADES]
    },
    children: [
      {
        path: 'periodos', component: PeriodosComponent
      },
      {
        path: '**', component: NotFoundComponent
      },

    ],
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    //RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule,
  ],
})
export class ApoyoAlimentarioRoutingModule {
}
