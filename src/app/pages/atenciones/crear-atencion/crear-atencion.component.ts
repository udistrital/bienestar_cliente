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
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
@Component({
  selector: "ngx-crear-atencion",
  templateUrl: "./crear-atencion.component.html",
  styleUrls: ["./crear-atencion.component.scss"],
})
export class CrearAtencionComponent implements OnInit {
  constructor(
    private atencionesService: AtencionesService,
    private listService: ListService,
    private solicitudService: SolicitudService,
    private datePipe: DatePipe
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
  observacionesBackUp: Observacion[] = [];

  atencion: Solicitud = new Solicitud();
  tipoObservacion: TipoObservacion = new TipoObservacion();
  terceroId: number = 0;
  codigo_atencion: string = "";
  fecha_apertura: string = "";
  fecha_finalizacion: string = "";
  dateObj: Date = new Date();
  nuevaAtencion: boolean = false;

  ngOnInit() {
    // this.getAtencion();
    this.atencionesService.getTipoObservacionComentario().subscribe((res) => {
      this.tipoObservacion = res["Data"][0];
    });

    this.getTiposAtenciones();
    this.getEstadosAtenciones();
    console.log("estudiante",this.estudiante)
  }

  fullDate(date: string) {
    const fechaFormateada = this.datePipe.transform(
      new Date(date.split(" ")[0] + " " + date.split(" ")[1]),
      "full"
    );
    return fechaFormateada;
  }

  updateAtencion() {
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
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Atención actualizada",
              showConfirmButton: true,
              timer: 5000,
            });
          });
      });

    this.observaciones.forEach((observacion) => {
      if (observacion.Id == 0) {
        console.log("es una nueva observación");
        observacion.SolicitudId = this.atencion;
        observacion.TerceroId = this.terceroId;
        observacion.Titulo = "Observación de atención realizada por bienestar";
        observacion.TipoObservacionId = this.tipoObservacion;
        this.saveObservacion(observacion);
      } else {
        if (
          !(
            observacion.Valor ==
            this.observacionesBackUp.find(
              (obBackUp) => obBackUp.Id == observacion.Id
            ).Valor
          )
        ) {
          // Significa que el valor del backup y la nueva observación son diferentes
          this.atencionesService
            .updateObservacion(observacion.Id, observacion)
            .subscribe((res) => {
              console.log("observación actualizada", res);
            });
        }
      }
    });
  }

  handleClickSave() {
    if (this.nuevaAtencion) {
      this.saveAtencion();
    } else {
      this.updateAtencion();
    }
  }

  getEstudiante() {
    this.atencionesService
      .getEstudianteByCode(this.codigo_estudiante)
      .subscribe((res) => {
        const estudianteNoEncontrado = Object.entries(res[0]).length === 0;
        if (!estudianteNoEncontrado) {
          this.estudiante.Carnet = res[0].Numero;
          this.estudiante.Nombre = res[0].TerceroId.NombreCompleto;
          this.estudiante.FechaNacimiento = res[0].TerceroId.FechaNacimiento;
          this.terceroId = res[0].TerceroId.Id;
          // TODO Mostrar solicitudes filtradas en la tabla
          this.getAtencionesxEstudiante(this.codigo_estudiante);
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Estudiante no encontrado",
            showConfirmButton: true,
            timer: 5000,
          });
          this.codigo_estudiante = "";
          this.estudiante = new InfoCompletaEstudiante();
        }
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
    console.log(this.observaciones);
  }

  deleteObservacion(index: number) {
    Swal.fire({
      text: "¿Está seguro que desea eliminar la observación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar observación",
    }).then((result) => {
      if (result.isConfirmed) {
        let observacion: Observacion = this.observaciones[index];
        this.atencionesService
          .deleteObservacion(observacion.Id)
          .subscribe((res) => {
            if (res.Message === "Delete successful") {
              this.observaciones.splice(index, 1);
              Toast.fire({
                icon: "success",
                title: "Observación Eliminada",
              });
            } else {
              Toast.fire({
                icon: "error",
                title: "No se pudo eliminar la observación.",
              });
            }
          });
      }
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
                this.fecha_apertura =
                  this.atencion.FechaCreacion.split(" ")[0] + "T00:00:00";
                this.fecha_finalizacion =
                  this.atencion.FechaModificacion.split(" ")[0] + "T00:00:00";
              });
          });
      });
    this.atencionesService
      .getObservacionesxAtencion(this.codigo_atencion)
      .subscribe((res) => {
        if (Object.entries(res[0]).length === 0) {
          res.shift();
        }
        this.observaciones = res;
        this.observacionesBackUp = JSON.parse(JSON.stringify(res)); //Se crea una copia sin referencia del original con el fin de comparar las observaciones que sí se modificaron
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
        console.log("atencion es ");
        console.log(this.atencion);
        this.solicitudService
          .post("solicitud", this.atencion)
          .subscribe((res) => {
            console.log("Nueva atención", res);
            solicitud = res.Data;
            let tercero = new Tercero();
            let solicitante = new Solicitante();
            this.atencionesService
              .getEstudianteByCode(this.codigo_estudiante)
              .subscribe((res) => {
                console.log(res);
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
              observacion.TerceroId = this.terceroId;
              observacion.Titulo =
                "Observación de atención realizada por bienestar";
              observacion.TipoObservacionId = this.tipoObservacion;
              this.saveObservacion(observacion);
            });
          });
        console.log("actualización", res);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Atención registrada",
          showConfirmButton: true,
          timer: 5000,
        });
      });
  }

  saveObservacion(observacion: Observacion) {
    this.listService
      .crearObservacion(observacion)
      .then((res) => console.log("Observación guardada", observacion.Valor));
  }

  empty(obj: any[]) {
    return obj.length == 0;
  }
}

// TODO Eliminar atenciones y poner SWAL
// TODO Cuando se agregue una atención que se refresque la info de la página (llamado desde la función)
// TODO Ajustar layout
/**
 * Una página donde se ven todas las atenciones.
 * Que en esa página haya un botón de crear atenciones donde se despligue el componente.
 * Cuando se de click en la tabla a una atención, que lo lleve a otra paágina con el componente y la atención
 */
// TODO Implementar acción para finalizar una atención. Cuando esté finalizada, bloquear todo y solo dejar opción para reabrir
// TODO Mostrar las atenciones en el orden que se agregaron
// TODO Validar campos cuando se click en el botón guardar, antes de enviar las peticiones
