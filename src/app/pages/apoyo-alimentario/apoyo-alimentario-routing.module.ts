import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from '../pages.component';
import {NotFoundComponent} from '../miscellaneous/not-found/not-found.component';
import { ApoyoAlimentarioComponent } from '../apoyo-alimentario/apoyo-alimentario.component';
import { HomeComponent } from '../home/home.component';
import { ApoyoAlimentarioModule } from './apoyo-alimentario.module';
import { InscritosComponent } from './registro/inscritos/inscritos.component'
import { ConsultarComponent } from './registro/consultar/consultar.component'
import { FechasComponent } from './administracion/fechas/fechas.component'
import { PeriodosComponent } from './administracion/periodos/periodos.component'
import { ConsultarCodigoComponent } from './administracion/consultar-codigo/consultar-codigo.component'
import { InformacionEstudianteComponent } from './administracion/informacion-estudiante/informacion-estudiante.component'
import { SolicitudTerceroComponent } from './inscripciones/solicitud-tercero/solicitud-tercero.component';
import { SolicitudesComponent  } from './inscripciones/solicitudes/solicitudes.component';
import { EvaluarSolicitudComponent } from './inscripciones/evaluar-solicitud/evaluar-solicitud.component';
import { PeriodoComponent } from './informes/periodo/periodo.component';
import { DiarioComponent } from './informes/diario/diario.component';
import { InformePeriodoComponent } from './informes/informe-periodo/informe-periodo.component';
import { InformeDiarioComponent } from './informes/informe-diario/informe-diario.component';
import { BuscarSolicitudComponent } from './inscripciones/buscar-solicitud/buscar-solicitud.component';

const routes: Routes = [
  { 
    path: '',
    component :ApoyoAlimentarioComponent
  },
  {
    path: 'registro', children:[
    {
      path:'consultar', component: ConsultarComponent
    },
    {
      path:'consultar/:id', component: ConsultarComponent
    },
    {
      path:'diario', component: InscritosComponent
    },
    {
      path:'**', component: NotFoundComponent
    },
    
     ],
  },
  {
    path: 'inscripciones', children:[
    {
      path:'solicitud', component: SolicitudTerceroComponent
    },
    {
      path:'buscarSolicitud', component: BuscarSolicitudComponent
    },
    {
      path:':solicitudes', component: SolicitudesComponent
    },
    {
      path:':solicitudes/:idSolicitud', component: EvaluarSolicitudComponent
    },
    {
      path:'**', component: NotFoundComponent
    },
    
     ],
  },
  {
    path: 'informes', children:[
    {
      path:'periodo', component: PeriodoComponent
    },
    {
      path:'periodo/:idPeriodo', component: InformePeriodoComponent
    },
    {
      path:'diario', component: DiarioComponent
    },
    {
      path:'diario/:fecha', component: InformeDiarioComponent
    },
    {
      path:'**', component: NotFoundComponent
    },
    
     ],
  },
  {
    path: 'administracion', children:[
    {
      path:'periodos', component: PeriodosComponent
    },
    {
      path:'fechas', component: FechasComponent
    },
    {
      path:'carga-inscripciones', component: ConsultarComponent
    },
    {
      path:'consulta-codigo',component: ConsultarCodigoComponent
    },
    {
      path:'consulta-codigo/:cod',component: InformacionEstudianteComponent
    },
    {
      path:'**', component: NotFoundComponent
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
  