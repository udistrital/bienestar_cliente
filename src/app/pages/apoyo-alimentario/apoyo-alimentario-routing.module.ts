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
import { BuscarSolicitudComponent } from './inscripciones/buscar-solicitud/buscar-solicitud.component';
import { EvaluacionMasivaComponent } from './inscripciones/evaluacion-masiva/evaluacion-masiva.component';
import { AuthGuard } from '../../@core/_guards/auth.guard';
import { RolesConstanst } from '../../shared/constants/roles.constants';
import { ReportesComponent } from './reportes/reportes.component';
import { FallasJustificadasComponent } from './registro/fallas-justificadas/fallas-justificadas.component';

const routes: Routes = [
  {
    path: '',
    component: ApoyoAlimentarioComponent
  },
  {
    path: 'registro',
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.COORDINADOR_APOYO]
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
        path: 'fallas-justificadas',
        component: FallasJustificadasComponent
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
    children: [
      {
        path: 'evaluacion-masiva', component: EvaluacionMasivaComponent,
        canActivate: [AuthGuard],
        data: {
          roles: [RolesConstanst.ROLES_SISTEMA.ADMINISTRADOR_APOYO]
        }
      },
      {
        path: 'buscarSolicitud', component: BuscarSolicitudComponent,
        canActivate: [AuthGuard],
        data: {
          roles: [RolesConstanst.ROLES_SISTEMA.COORDINADOR_APOYO]
        }
      },
      {
        path: ':solicitudes', component: SolicitudesComponent,
        canActivate: [AuthGuard],
        data: {
          roles: [RolesConstanst.ROLES_SISTEMA.COORDINADOR_APOYO]
        }
      },
      {
        path: ':solicitudes/:idSolicitud', component: EvaluarSolicitudComponent,
        canActivate: [AuthGuard],
        data: {
          roles: [RolesConstanst.ROLES_SISTEMA.COORDINADOR_APOYO]
        }
      },
      {
        path: '**', component: NotFoundComponent
      },

    ],
  },
  {
    path: 'reportes',
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.COORDINADOR_APOYO]
    },
    component: ReportesComponent
  },
  {
    path: 'administracion',
    canActivate: [AuthGuard],
    data: {
      roles: [RolesConstanst.ROLES_SISTEMA.ADMINISTRADOR_APOYO]
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
