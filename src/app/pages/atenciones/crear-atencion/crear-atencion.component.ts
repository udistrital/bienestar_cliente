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

  atenciones: Solicitud[] = [];
  tiposAtenciones: TipoSolicitud[] = [];
  estadosAtenciones: Estado[] = [];

  tipo_servicio: string = "";
  tipo: TipoSolicitud = new TipoSolicitud();
  estado: Estado = new Estado();

  estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante();
  codigo_estudiante: string = "";
  observaciones: Observacion[] = [];

  atencion: Solicitud = new Solicitud();
  tipoObservacion: TipoObservacion = new TipoObservacion();
  terceroId: number = 0;
  codigo_atencion: string = "47821";
  fecha_apertura: string = "";
  fecha_finalizacion: string = "";
  dateObj: Date = new Date();
  nuevaAtencion: boolean = false;

  ngOnInit() {
    this.atencionesService.getTipoObservacionComentario().subscribe((res) => {
      this.tipoObservacion = res["Data"][0];
    });

    this.getTiposAtenciones();
    this.getEstadosAtenciones();
    this.getAtencion();
  }

  updateAtencion() {
    // console.log("nuevo tipo", this.tipo);
    // console.log("nuevo estado", this.estado);
    this.atencionesService
      .getTipoEstado(this.tipo.Id, this.estado.Id)
      .subscribe((res) => {
        let estadosTipos: EstadoTipoSolicitud = res.Data[0];
        this.atencion.EstadoTipoSolicitudId = estadosTipos;

        let referencia = {};
        referencia["tipo_servicio"] = this.tipo_servicio;
        let json = JSON.stringify(referencia);

        this.atencion.Referencia = json;

        console.log(this.atencion);
        this.solicitudService
          .put("solicitud", this.atencion, this.atencion.Id)
          .subscribe((res) => {
            console.log("actualización", res);
          });
      });
  }

  handleClickSave() {
    if (this.nuevaAtencion) {
      this.saveAtencion();
    } else {
      this.updateAtencion();
    }
  }

  limpiarFormulario() {
    this.atenciones = [];
    this.tiposAtenciones = [];

    this.tipo_servicio = "";
    // TODO Cuando se limpia formulario, no se puede volver a ver una vez se busca una nueva atención.
    this.tipo = new TipoSolicitud();
    this.estado = new Estado();

    this.estadosAtenciones = [];
    this.estudiante = new InfoCompletaEstudiante();
    this.codigo_estudiante = "";
    this.observaciones = [];

    this.atencion = new Solicitud();
    this.tipoObservacion = new TipoObservacion();
    this.terceroId = 0;
    this.codigo_atencion = "";
    this.fecha_apertura = "";
    this.fecha_finalizacion = "";
    this.dateObj = new Date();
  }

  getEstudiante() {
    this.atencionesService
      .getEstudianteByCode(this.codigo_estudiante)
      .subscribe((res) => {
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
    let observacion: Observacion = this.observaciones[index];
    this.atencionesService
      .deleteObservacion(observacion.Id)
      .subscribe((res) => {
        console.log("respuesta", res);
        this.observaciones.splice(index, 1);
      });
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
                // TODO Corregir que cuando se muestran las fechas cuando se hace la búsqueda, no se muesta las fechas adecuadas
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
                  .subscribe((resSolicitante) => {});
              });

            //Registrar observaciones
            this.observaciones.forEach((observacion) => {
              observacion.SolicitudId = solicitud;
              // TODO Mostrar las atenciones en el orden que se agregaron
              // TODO No permitir guardar nada si no se tiene al estudiante identificado

              // TODO Avisar al usuario  cuando se guarde una solicitud
              // TODO Limpiar el formulario cuando se guarda una solicitud
              // TODO Validar cuando el componente de crear solicitud corresponde a una nueva solicitud o a la edición de una existente

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

  objectEmpty(obj: any[]) {
    if (obj.length > 0) {
      return Object.entries(obj[0]).length === 0;
    } else {
      return true;
    }
  }
}
// TODO Poner alertas con Sweet alerts cuando:
/**
 * 1. cuando se agregan, editan y/o eliminan atenciones
 * 2. cuando se agregan, editan y/o eliminan observaciones 
 */
