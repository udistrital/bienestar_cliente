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
import { TipoObservacion } from "../../../@core/data/models/solicitud/tipo-observacion";

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
  tipoObservacion: TipoObservacion = new TipoObservacion();

  ngOnInit() {
    this.atencionesService.getTipoObservacionComentario().subscribe((res) => {
      this.tipoObservacion = res["Data"][0];
    });

    this.findAtenciones();
    this.getTiposAtenciones();
    this.getEstadosAtenciones();
    // this.crearRompimiento()

    // let tipoObservacion: TipoObservacion = new TipoObservacion();
    // this.atencionesService.getTipoObservacionComentario().subscribe((res) => {
    //   tipoObservacion = res["Data"][0];
    //   console.log(typeof tipoObservacion);
    // });
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
    this.observaciones.push(new Observacion());
    console.log(this.observaciones);
  }

  deleteObservacion(index: number) {
    this.observaciones.splice(index, 1);
  }

  saveAtencion() {
    let solicitud: Solicitud = new Solicitud();
    this.atencionesService
      .getTipoEstado(this.tipo.Id, this.estado.Id)
      .subscribe((res) => {
        let tipoEstado: EstadoTipoSolicitud = res.Data[0];
        this.atencion.EstadoTipoSolicitudId = tipoEstado;

        this.solicitudService
          .post("solicitud", this.atencion)
          .subscribe((res) => {
            solicitud = res.Data;
            console.log("Atención guardada", solicitud);
            this.observaciones.forEach((observacion) => {
              observacion.SolicitudId = solicitud;
              // TODO Definir el IdTercero que corresponde
              // TODO No permitir guardar nada si no se tiene al estudiante identificado
              observacion.TerceroId = 9759;
              observacion.Titulo =
                "Observación de atención realizada por bienestar";
              observacion.TipoObservacionId = this.tipoObservacion;
              this.saveObservacion(observacion);
            });
          });
      });
  }

  saveObservacion(observacion: Observacion) {
    this.listService
      .crearObservacion(observacion)
      .then((res) => console.log("Observación guardad", observacion.Valor));
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
