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
import { Solicitante } from "../../../@core/data/models/solicitud/solicitante";
import { Tercero } from "../../../@core/data/models/terceros/tercero";

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
  dateObj:Date = new Date();

  ngOnInit() {
    this.atencionesService.getTipoObservacionComentario().subscribe((res) => {
      this.tipoObservacion = res["Data"][0];
    });

    //this.findAtenciones();
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
    this.atencionesService.getEstudiante(this.codigo_estudiante).subscribe((res) => {
      console.log(res[0]);
      this.estudiante.Carnet = res[0].Numero;
      this.estudiante.Nombre = res[0].TerceroId.NombreCompleto;
      this.estudiante.FechaNacimiento = res[0].TerceroId.FechaNacimiento;
      this.terceroId = res[0].TerceroId.Id;
      // TODO Mostrar solicitudes filtradas en la tabla
      this.getAtencionesxEstudiante(this.codigo_estudiante)
    });
  }

  getAtencionesxEstudiante(codigo_estudiante: string) {

    this.atencionesService.getEstudiante(codigo_estudiante).subscribe((res)=>{
      this.atencionesService.getAtencionxSolicitante(res[0].TerceroId.Id).subscribe((resAtenciones)=>{
        console.log("atenciones son ", resAtenciones)
        this.atenciones = resAtenciones;
      })
    })
    
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
            console.log("Atención guardada", solicitud);
            // TODO Guardar solicitante
            let tercero = new Tercero()
            let solicitante = new Solicitante()
            this.atencionesService.getEstudiante(this.codigo_estudiante).subscribe((res=>{
              tercero = res[0].TerceroId;
              solicitante.TerceroId = tercero.Id;
              solicitante.SolicitudId = solicitud;
              console.log("solicitante ", solicitante);
              this.solicitudService.post("solicitante",solicitante)
              .subscribe((resSolicitante)=>{
                console.log("Solicitante de la atencion registrado ",resSolicitante)
              })
            }))
            
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
