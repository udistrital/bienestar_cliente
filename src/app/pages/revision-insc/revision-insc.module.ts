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
import { RevisionInscComponent } from './revision-insc.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CustomPaginatorModule } from '../../shared/components/custom-paginator/custom-paginator.module';
import { ComboGenericoModule } from '../../shared/components/combo-generico/combo-generico.module';
import { InputGenericoModule } from '../../shared/components/input-generico/input-generico.module';

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
        CustomPaginatorModule,
        ComboGenericoModule,
        InputGenericoModule,
    ],
  declarations: [
    RevisionInscComponent,
  ],
  providers: [
  ],
})
export class RevisionInscModule { }
