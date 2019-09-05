import { ProductoRoutingModule, routedComponents } from './producto-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ConfiguracionService } from '../../@core/data/configuracion.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../../shared/shared.module';
import { CrudProductoComponent } from './crud-producto/crud-producto.component';
import { ToasterService} from 'angular2-toaster';
import { NbCardModule } from '@nebular/theme';

@NgModule({
  imports: [
    ThemeModule,
    ProductoRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    NbCardModule,
    SharedModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    ConfiguracionService,
    ToasterService,
  ],
  exports: [
    CrudProductoComponent,
  ],
})
export class ProductoModule { }
