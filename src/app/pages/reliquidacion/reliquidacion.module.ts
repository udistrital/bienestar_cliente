import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { ReliquidacionRoutingModule } from './reliquidacion-routing.module';
import { SharedModule } from '../../shared/shared.module';
import {
  NbTreeGridModule,
  NbSelectModule,
  NbAlertModule,
  NbTabsetModule,
  NbStepperModule,
  NbCardModule,
  NbTooltipModule,
  NbRadioModule,
  NbSpinnerModule,
  NbCheckboxModule } from '@nebular/theme';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { ConfiguracionService } from '../../@core/data/configuracion.service';
import { MatStepperModule } from '@angular/material';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { HomeEstudianteComponent } from './home-estudiante/home-estudiante.component';
import { ReliquidacionMatriculaComponent } from './reliquidacion-matricula/reliquidacion-matricula.component';
import { DescuentoElectoralComponent } from './descuento-electoral/descuento-electoral.component';

@NgModule({
  declarations: [
    DescuentoElectoralComponent,
    HomeEstudianteComponent,
    ReliquidacionMatriculaComponent,
  ],
  providers: [
    ConfiguracionService,
    ToasterService,
  ],
  imports: [
    ThemeModule,
    SharedModule,
    ReliquidacionRoutingModule,
    NbTreeGridModule,
    NbTooltipModule,
    NbSelectModule,
    NbRadioModule,
    NbAlertModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbStepperModule,
    NbCardModule,
    Ng2SmartTableModule,
    ToasterModule,
    MatStepperModule,
    CurrencyMaskModule,
    NbSpinnerModule
  ],
  exports: [
  ],
  entryComponents: [
  ],
})
export class ReliquidacionModule { }
