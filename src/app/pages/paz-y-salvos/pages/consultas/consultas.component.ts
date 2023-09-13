import { Component, OnInit } from "@angular/core";
import { AtencionesService } from "../../services/atenciones.service";

@Component({
  selector: "ngx-consultas",
  templateUrl: "./consultas.component.html",
  styleUrls: ["./consultas.component.scss"],
})
export class ConsultasComponent implements OnInit {
  //para solicitud
  solicitudesExt: any[] = [];
  //paginacion
  pagActual: number = 1;
  contPag: number = 0;
  itemsPag: number[] = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500];
  paginacion: number = 10;
  itemTipoSol = "null";
  //desplegables

  estados = this.AtencionesService.estado;
  estadoTipo: number = null;
  estadosTipoSolicitud = this.AtencionesService.estadosTipoSolicitu;
  estadoNum: number = null;

  NtotalRegistros = 0;
  facultades: string[] = [
    "FACULTAD DE INGENIERIA",
    "FACULTAD DE CIENCIAS Y EDUCACION",
    "FACULTAD DE MEDIO AMBIENTE",
    "FACULTAD TECNOLOGICA",
    "FACULTAD DE CIENCIAS MATEMATICAS Y NATURALES",
    "FACULTAD DE ARTES -  ASAB",
  ];
  facultad = null;

  constructor(private AtencionesService: AtencionesService) {}

  ngOnInit() {}

  buscarSolicitudes() {
    // this.cargarSol();
 
      this.AtencionesService.setFiltros(
      this.facultad,
      this.itemTipoSol,
      this.estadoTipo
    ).then(() => {
      this.AtencionesService.actualizarFiltros();
      this.solicitudesExt = this.AtencionesService.Solicitudes;
    });
  }

  exportarCsv() {
    console.log("PAGINACION", this.paginacion);

    //   const headers = {
    //     id: "id",
    //     tipo: "tipo_solicitud",
    //     activo: "activo",
    //     estado: "estado_soolicitud",
    //     fechaCreacion: "fecha_creacion",
    //     periodo: "periodo",
    //     puntaje: "puntaje",
    //     solicitudFinalizada: "Finalizada"
    //   };
    //   const data = [];
    //   for (const s of this.solicitudesExt) {
    //     data.push({
    //       id: s.Solicitud.Id,
    //       tipo: s.Solicitud.EstadoTipoSolicitudId.TipoSolicitud.Nombre,
    //       activo: s.Solicitud.Activo ? 'SI' : 'NO',
    //       estado: s.Solicitud.EstadoTipoSolicitudId.EstadoId.Nombre,
    //       fechaCreacion: s.Solicitud.FechaCreacion,
    //       periodo: s.Periodo,
    //       puntaje: s.Puntaje,
    //       solicitudFinalizada: s.Solicitud.SolicitudFinalizada ? 'SI' : 'NO'
    //     });
    //   }
    //   let nombre = "solicitudes " +
    //     (this.estadoNum != null ? this.estadosTipoSolicitud[this.estadoNum].EstadoId.Nombre + " " : "") +
    //     (this.periodos[this.periodo] != null ? this.periodos[this.periodo].Nombre : "historico") +
    //     " "+(new Date()).toISOString();
    //   this.utilService.exportCSVFile(headers, data, nombre);
  }
}
