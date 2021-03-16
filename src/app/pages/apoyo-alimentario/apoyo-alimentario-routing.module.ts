import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from '../pages.component';
import {NotFoundComponent} from '../miscellaneous/not-found/not-found.component';
import { ApoyoAlimentarioComponent } from '../apoyo-alimentario/apoyo-alimentario.component';
import { HomeComponent } from '../home/home.component';
import { ApoyoAlimentarioModule } from './apoyo-alimentario.module';
import { InscritosComponent } from './registro/inscritos/inscritos.component'
import { NoInscritosComponent } from './registro/no-inscritos/no-inscritos.component'
import { ConsultarComponent } from './registro/consultar/consultar.component'
import { FechasComponent } from './administracion/fechas/fechas.component'
import { PeriodosComponent } from './administracion/periodos/periodos.component'
import { ConsultarCodigoComponent } from './administracion/consultar-codigo/consultar-codigo.component'
import { InformacionEstudianteComponent } from './administracion/informacion-estudiante/informacion-estudiante.component'
import { FechaCrudComponent } from './administracion/fecha-crud/fecha-crud.component'

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
      path:':tipo', component: InscritosComponent
    },
    {
      path:'**', component: NotFoundComponent
    },
    
     ],
  }, {
    path: 'administracion', children:[
    {
      path:'periodos', component: PeriodosComponent
    },
    {
      path:'fechas', component: FechasComponent
    },
    {
      path:'fechas/:id',component: FechaCrudComponent
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
  