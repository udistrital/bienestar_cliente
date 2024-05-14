import { NgModule } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule, NbStepperModule, NbInputModule, NbRadioModule, NbLayoutModule, NbAccordionModule, NbToastrService,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { InscripcionEstComponent } from './inscripcion-est.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ComboGenericoModule } from '../../shared/components/combo-generico/combo-generico.module';
import { RadioSelectGenericoModule } from '../../shared/components/radio-select-generico/radio-select-generico.module';
import { ArchivosGenericoModule } from '../../shared/components/archivos-generico/archivos-generico.module';
import { InputGenericoModule } from '../../shared/components/input-generico/input-generico.module';
import { DateCustomPipePipe } from '../../shared/pipes/date-custom-pipe.pipe';
import { DateCustomPipeModule } from '../../shared/pipes/date-custom-pipe.module';

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
        ArchivosGenericoModule,
        InputGenericoModule,
        DateCustomPipeModule
    ],
  declarations: [
    InscripcionEstComponent,
  ],
  providers: [
    DateCustomPipePipe,
  ],
})
export class InscripcionEstModule { }
