import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from '../pages.component';
import {NotFoundComponent} from '../miscellaneous/not-found/not-found.component';
import { ApoyoAlimentarioComponent } from '../apoyo-alimentario/apoyo-alimentario.component';
import { HomeComponent } from '../home/home.component';
import { ApoyoAlimentarioModule } from './apoyo-alimentario.module';

const routes: Routes = [
    {
      path: '',
      component: ApoyoAlimentarioComponent,
      children: [
        {
            path: 'registro',
            component: ApoyoAlimentarioComponent,
        },
        {
            path: 'volver',
            redirectTo: 'home',
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
    },
  ];
  
  @NgModule({
    imports: [
      RouterModule.forChild(routes),
    ],
    exports: [
      RouterModule,
    ],
  })
  export class ApoyoAlimentarioRoutingModule {
  }
  