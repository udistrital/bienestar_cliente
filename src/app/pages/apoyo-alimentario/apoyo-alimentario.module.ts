import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule, NbStepperModule, NbInputModule, NbRadioModule, NbLayoutModule, NbAccordionModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ComboGenericoModule } from '../../shared/components/combo-generico/combo-generico.module';
import { RadioSelectGenericoModule } from '../../shared/components/radio-select-generico/radio-select-generico.module';
import { ApoyoAlimentarioRoutingModule } from './apoyo-alimentario-routing.module';
import { ApoyoAlimentarioComponent } from './apoyo-alimentario.component';
import { InscritosComponent } from './registro/inscritos/inscritos.component';
import { MiscellaneousModule } from '../miscellaneous/miscellaneous.module';
import { NoInscritosComponent } from './registro/no-inscritos/no-inscritos.component';
import { ConsultarComponent } from './registro/consultar/consultar.component';

@NgModule({
    imports: [
        ApoyoAlimentarioRoutingModule,
        MiscellaneousModule,
        ThemeModule,
        CommonModule,
        NbCardModule,
        NbUserModule,
        NbButtonModule,
        NbIconModule,
        NbTabsetModule,
        NbSelectModule,
        NbListModule,
        NbProgressBarModule,
        NgxEchartsModule,
        NgxChartsModule,
        LeafletModule,
        NbStepperModule,
        NbInputModule,
        NbRadioModule,
        NbLayoutModule,
        NbAccordionModule,
        ComboGenericoModule,
        RadioSelectGenericoModule,
    ],
  declarations: [ 
    ApoyoAlimentarioComponent,
    InscritosComponent,
    NoInscritosComponent,
    ConsultarComponent,
   ],
  providers: [

  ],
})

export class ApoyoAlimentarioModule { }
