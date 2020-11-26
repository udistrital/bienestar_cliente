import { NgModule } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule, NbStepperModule, NbInputModule, NbRadioModule, NbLayoutModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { InscripcionEstComponent } from './inscripcion-est.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
    imports: [
        ThemeModule,
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
    ],
  declarations: [
    InscripcionEstComponent,
  ],
  providers: [
  ],
})
export class InscripcionEstModule { }
