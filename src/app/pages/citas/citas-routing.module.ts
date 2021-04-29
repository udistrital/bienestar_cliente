import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListarCitaComponent } from "./cita/listar-cita/listar-cita.component";
import { CrearCitaComponent } from "./cita/crear-cita/crear-cita.component";
import { HorariosComponent } from "./especialista/horarios/horarios.component";
import { ListarPacienteComponent } from "./paciente/listar-paciente/listar-paciente.component";
import { HomeComponent } from "./home/home.component";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { HistoriaClinicaComponent } from "./historia-clinica/historia-clinica.component";
import { PacienteCitaComponent } from "./paciente/paciente-cita/paciente-cita.component";
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
]);

const routes: Routes = [
  {
    path: "",
    children: [
      { path: "listarCita", component: ListarCitaComponent },
      { path: "crearCita", component: CrearCitaComponent },
      { path: "horarios", component: HorariosComponent },
      { path: "listarPaciente", component: ListarPacienteComponent },
      { path: "historiaClinica/:codigo", component: HistoriaClinicaComponent },
      {path: "citaPaciente", component: PacienteCitaComponent},
      { path: "", component: HomeComponent },
      { path: "**", redirectTo: "" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), 
    NgxMaterialTimepickerModule,
    FullCalendarModule,
  ],
  exports: [RouterModule],
})
export class CitasRoutingModule {}
