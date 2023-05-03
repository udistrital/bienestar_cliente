import { Component, OnInit } from "@angular/core";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { SolicitudService } from "../../../@core/data/solicitud.service";
import { AtencionesService } from "../services/atenciones.service";
import { TipoSolicitud } from "../../../@core/data/models/solicitud/tipo_solicitud";
import { Estado } from "../../../@core/data/models/solicitud/estado";
import { ListService } from "../../../@core/store/list.service";
import { InfoCompletaEstudiante } from "../../../@core/data/models/info-completa-estudiante/info-completa-estudiante";
import { Observacion } from "../../../@core/data/models/solicitud/observacion";
import { EstadoTipoSolicitud } from "../../../@core/data/models/solicitud/estado-tipo-solicitud";
import { TipoObservacion } from "../../../@core/data/models/solicitud/tipo-observacion";
import { Solicitante } from "../../../@core/data/models/solicitud/solicitante";
import { Tercero } from "../../../@core/data/models/terceros/tercero";

@Component({
  selector: "ngx-crear-atencion",
  templateUrl: "./crear-atencion.component.html",
  styleUrls: ["./crear-atencion.component.scss"],
})
export class CrearAtencionComponent implements OnInit {
  constructor(
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

  tipo_servicio: string;
  tipo: TipoSolicitud;
  estado: Estado;

  estadosAtenciones: Estado[] = [];
  estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante();
  codigo_estudiante: string = "";
  observaciones: Observacion[] = [];

  atencion: Solicitud = new Solicitud();
  tipoObservacion: TipoObservacion = new TipoObservacion();
  terceroId: number;
  codigo_atencion: string = "";
  fecha_apertura: string = "";
  fecha_finalizacion: string = "";
  dateObj: Date = new Date();

  ngOnInit() {
    this.atencionesService.getTipoObservacionComentario().subscribe((res) => {
      this.tipoObservacion = res["Data"][0];
    });

    this.getTiposAtenciones();
    this.getEstadosAtenciones();
  }

  getEstudiante() {
    this.atencionesService
      .getEstudianteByCode(this.codigo_estudiante)
      .subscribe((res) => {
        console.log(res[0]);
        this.estudiante.Carnet = res[0].Numero;
        this.estudiante.Nombre = res[0].TerceroId.NombreCompleto;
        this.estudiante.FechaNacimiento = res[0].TerceroId.FechaNacimiento;
        this.terceroId = res[0].TerceroId.Id;
        // TODO Mostrar solicitudes filtradas en la tabla
        this.getAtencionesxEstudiante(this.codigo_estudiante);
      });
  }

  getAtencionesxEstudiante(codigo_estudiante: string) {
    this.atencionesService
      .getEstudianteByCode(codigo_estudiante)
      .subscribe((res) => {
        this.atencionesService
          .getAtencionxSolicitante(res[0].TerceroId.Id)
          .subscribe((resAtenciones) => {
            console.log("atenciones son ", resAtenciones);
            this.atenciones = resAtenciones;
          });
      });
  }

  /**
   * Retorna el valor de TerceroId del solicitante
   * @param idSolicitud
   */
  getEstudianteBySolicitud(idSolicitud: string) {
    this.atencionesService
      .getSolicitanteBySolicitudId(idSolicitud)
      .subscribe((res) => {
        this.terceroId = res[0].TerceroId;
        this.atencionesService
          .getEstudianteByTerceroId(this.terceroId)
          .subscribe((res) => {
            this.estudiante.Carnet = res[0].Numero;
            this.estudiante.Nombre = res[0].TerceroId.NombreCompleto;
            this.estudiante.FechaNacimiento = res[0].TerceroId.FechaNacimiento;
          });
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
  }

  deleteObservacion(index: number) {
    this.observaciones.splice(index, 1);
  }

  getAtencion() {
    this.atencionesService
      .getAtencion(this.codigo_atencion)
      .subscribe((res) => {
        this.atencion = res;
        this.tipo_servicio = JSON.parse(this.atencion.Referencia).tipo_servicio;

        this.getEstudianteBySolicitud(this.codigo_atencion);

        this.atencionesService
          .getEstadoTipoById(this.atencion.EstadoTipoSolicitudId.Id)
          .subscribe((res) => {
            this.atencion.EstadoTipoSolicitudId = res.Data;
            this.atencionesService
              .getTipoEstado(
                this.atencion.EstadoTipoSolicitudId.TipoSolicitud.Id,
                this.atencion.EstadoTipoSolicitudId.EstadoId.Id
              )
              .subscribe((res) => {
                this.atencion.EstadoTipoSolicitudId = res.Data[0];

                this.tipo = this.tiposAtenciones.find(
                  (atencion) =>
                    atencion.Id ==
                    this.atencion.EstadoTipoSolicitudId.TipoSolicitud.Id
                );

                this.estado = this.estadosAtenciones.find(
                  (estado) =>
                    estado.Id == this.atencion.EstadoTipoSolicitudId.EstadoId.Id
                );
                this.fecha_apertura = this.atencion.FechaCreacion.split(" ")[0];
                this.fecha_finalizacion =
                  this.atencion.FechaModificacion.split(" ")[0];
              });
          });
      });
    this.atencionesService
      .getObservacionesxAtencion(this.codigo_atencion)
      .subscribe((res) => {
        this.observaciones = res;
      });
  }

  saveAtencion() {
    let solicitud: Solicitud = new Solicitud();

    let referencia = {};
    referencia["tipo_servicio"] = this.tipo_servicio;
    let json = JSON.stringify(referencia);

    this.atencionesService
      .getTipoEstado(this.tipo.Id, this.estado.Id)
      .subscribe((res) => {
        let tipoEstado: EstadoTipoSolicitud = res.Data[0];
        this.atencion.EstadoTipoSolicitudId = tipoEstado;
        this.atencion.Referencia = json;
        this.solicitudService
          .post("solicitud", this.atencion)
          .subscribe((res) => {
            solicitud = res.Data;
            // TODO Guardar solicitante
            let tercero = new Tercero();
            let solicitante = new Solicitante();
            this.atencionesService
              .getEstudianteByCode(this.codigo_estudiante)
              .subscribe((res) => {
                tercero = res[0].TerceroId;
                solicitante.TerceroId = tercero.Id;
                solicitante.SolicitudId = solicitud;
                this.solicitudService
                  .post("solicitante", solicitante)
                  .subscribe((resSolicitante) => {
                    console.log(
                      "Solicitante de la atencion registrado ",
                      resSolicitante
                    );
                  });
              });

            //Registrar observaciones
            this.observaciones.forEach((observacion) => {
              observacion.SolicitudId = solicitud;
              // TODO No permitir guardar nada si no se tiene al estudiante identificado

              // TODO Avisar al usuario  cuando se guarde una solicitud
              // TODO Limpiar el formulario cuando se guarda una solicitud

              observacion.TerceroId = this.terceroId;
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
      .then((res) => console.log("Observación guardada", observacion.Valor));
  }
}
