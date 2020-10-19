import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { NbMenuModule, NbSpinnerModule, NbThemeModule } from '@nebular/theme';

import { ApoyoAlimentarioComponent } from './apoyo-alimentario.component';
import { EstudiantesComponent } from './estudiantes/estudiantes.component';
import { EstudiantesService } from '../../@core/helpers/estudiantes/estudiantes.service';

@NgModule({
  declarations: [
    ApoyoAlimentarioComponent,
    EstudiantesComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbTabsetModule,
    NbUserModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbMenuModule,
    NbSpinnerModule,
    NbThemeModule,

  ],
  providers: [EstudiantesService]
})
export class ApoyoAlimentarioModule { }
