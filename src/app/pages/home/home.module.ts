import { NgModule } from '@angular/core';
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
import { HomeComponent } from './home.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ComboGenericoModule } from '../../shared/components/combo-generico/combo-generico.module';
import { RadioSelectGenericoModule } from '../../shared/components/radio-select-generico/radio-select-generico.module';

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
        NbAccordionModule,
        ComboGenericoModule,
        RadioSelectGenericoModule,
    ],
  declarations: [
    HomeComponent,
  ],
  providers: [
  ],
})
export class HomeModule { }
