import { NgModule } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule, 
    NbStepperModule, 
    NbInputModule, 
    NbRadioModule, 
    NbLayoutModule, 
    NbAccordionModule,
    NbBadgeModule
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ThemeModule } from '../../@theme/theme.module';
import {CulturaRoutingModule} from './cultura-routing.module'
import { CulturaComponent } from './cultura.component';
import { ActividadCulturalComponent } from './actividad-cultural/actividad-cultural.component';
import { GrupoCulturalComponent } from './grupo-cultural/grupo-cultural.component';




@NgModule({
    imports: [
    ThemeModule,
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule, 
    NbStepperModule, 
    NbInputModule, 
    NbRadioModule, 
    NbLayoutModule, 
    NbAccordionModule,
    NbBadgeModule,
    NgxEchartsModule,
    NgxChartsModule, 
    LeafletModule, 
    CulturaRoutingModule

    
        
    ],
    declarations: [
        CulturaComponent,
        ActividadCulturalComponent,
        GrupoCulturalComponent,
        
        
        
    ],
    providers: [

    ],
})

export class CulturaModule {  }
