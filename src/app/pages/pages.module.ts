import { NgModule } from "@angular/core";
import { NbMenuModule, NbSpinnerModule, NbIconModule } from "@nebular/theme";
import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { InscripcionEstModule } from "./inscripcion-estudiante/inscripcion-est.module";
import { RevisionInscModule } from "./revision-insc/revision-insc.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { ConfiguracionService } from "../@core/data/configuracion.service";
import { MenuService } from "../@core/data/menu.service";
import { SharedModule } from "../shared/shared.module";
import { HomeModule } from "./home/home.module";
import { ApoyoAlimentarioComponent } from "./apoyo-alimentario/apoyo-alimentario.component";
import { ApoyoAlimentarioModule } from "./apoyo-alimentario/apoyo-alimentario.module";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { AtencionesModule } from "./atenciones/atenciones.module";
import { FormsModule } from "@angular/forms";
import { GestionDocumentalModule } from './gestion-documental/gestion-documental.module';
import { CulturaModule } from './cultura/cultura.module';


@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbIconModule,
    DashboardModule,
    SharedModule,
    InscripcionEstModule,
    ApoyoAlimentarioModule,
    HomeModule,
    RevisionInscModule,
    MiscellaneousModule,
    NbSpinnerModule,
    AtencionesModule,
    GestionDocumentalModule,
    CulturaModule,

  ],
  declarations: [PagesComponent],
  providers: [ConfiguracionService, MenuService],
})
export class PagesModule {}
