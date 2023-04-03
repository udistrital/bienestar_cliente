import { Component, OnInit } from "@angular/core";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { SolicitudService } from "../../../@core/data/solicitud.service";
import { AtencionesService } from "../services/atenciones.service";
import { TipoSolicitud } from "../../../@core/data/models/solicitud/tipo_solicitud";
import { Estado } from "../../../@core/data/models/solicitud/estado";
import { EstudiantesService } from "../../../shared/services/estudiantes.service";
import { ListService } from "../../../@core/store/list.service";
import { InfoCompletaEstudiante } from "../../../@core/data/models/info-completa-estudiante/info-completa-estudiante";
import { Observacion } from "../../../@core/data/models/solicitud/observacion";
import { EstadoTipoSolicitud } from "../../../@core/data/models/solicitud/estado-tipo-solicitud";
import { Tipo } from "../../../@core/data/models/parametro/tipo";
import { formatDate } from "@angular/common";

@Component({
  selector: "ngx-crear-atencion",
  templateUrl: "./crear-atencion.component.html",
  styleUrls: ["./crear-atencion.component.scss"],
})
export class CrearAtencionComponent implements OnInit {
  constructor(
    private estudiantesService: EstudiantesService,
    private atencionesService: AtencionesService,
    private listService: ListService,
    private solicitudService: SolicitudService
  ) {}

  tiposServicio: string[] = [
    "Orientacion virtual (Formulario)",
    "Orientacion telefónica",
    "Línea amiga",
    "Consulta (Presencial)",
    "Consulta (Virtual)",
    "Seguimiento (Presencial)",
    "Seguimiento (Virtual)",
  ];

  value: string = "";
  atenciones: Solicitud[] = [];
  tiposAtenciones: TipoSolicitud[] = [];

  tipo: TipoSolicitud;
  estado: Estado;

  estadosAtenciones: Estado[] = [];
  estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante();
  codigo: string = "";
  observaciones: Observacion[] = [];

  atencion: Solicitud = new Solicitud();

  ngOnInit() {
    this.findAtenciones();
    this.getTiposAtenciones();
    this.getEstadosAtenciones();
    // this.crearRompimiento()
  }

  getEstudiante() {
    this.atencionesService.getEstudiante(this.codigo).subscribe((res) => {
      console.log(res[0]);
      this.estudiante.Carnet = res[0].Numero;
      this.estudiante.Nombre = res[0].TerceroId.NombreCompleto;
      this.estudiante.FechaNacimiento = res[0].TerceroId.FechaNacimiento;
    });
  }

  getTiposAtenciones() {
    this.atencionesService.getTiposAtenciones().subscribe((response) => {
      this.tiposAtenciones = response.Data.filter((tipoAtencion) =>
        tipoAtencion.Nombre.includes("Atención Bienestar")
      );
    });
  }

  getEstadosAtenciones() {
    this.atencionesService.getEstadosAtenciones().subscribe((response) => {
      this.estadosAtenciones = response.Data.filter((estado) =>
        estado.Nombre.includes("Atención Bienestar")
      );
    });
  }

  findAtenciones() {
    this.atencionesService.findAtenciones().subscribe((response) => {
      this.atenciones = response;
    });
  }

  addObservacion() {
    console.log(this.observaciones);
    this.observaciones.push(new Observacion());
  }

  deleteObservacion(index: number) {
    this.observaciones.splice(index, 1);
  }

  saveAtencion() {
    this.atencionesService
      .getTipoEstado(this.tipo.Id, this.estado.Id)
      .subscribe((res) => {
        let tipoEstado: EstadoTipoSolicitud = res.Data[0];
        this.atencion.EstadoTipoSolicitudId = tipoEstado;

        this.solicitudService
          .post("solicitud", this.atencion)
          .subscribe((res) => console.log(res));
      });
  }

  // crearRompimiento() {
  //   this.tiposAtenciones.forEach((tipo) => {
  //     this.estadosAtenciones.forEach((estado) => {
  //       let estadoTipo: EstadoTipoSolicitud = new EstadoTipoSolicitud();
  //       estadoTipo.Activo = true;
  //       estadoTipo.DependenciaId = 0;
  //       estadoTipo.FechaCreacion = formatDate(
  //         new Date(),
  //         "yyyy-MM-dd HH:mm:ss",
  //         "en"
  //       );
  //       estadoTipo.FechaModificacion = formatDate(
  //         new Date(),
  //         "yyyy-MM-dd HH:mm:ss",
  //         "en"
  //       );
  //       estadoTipo.Id = 0;
  //       estadoTipo.NumeroDias = 1;

  //       estadoTipo.TipoSolicitud = tipo;
  //       estadoTipo.EstadoId = estado;

  //       this.atencionesService.crearEstadoTipo(estadoTipo).subscribe((res) => {
  //         console.log(res);
  //       });
  //       console.log(this.atencion);
  //     });
  //   });
  // }
}
