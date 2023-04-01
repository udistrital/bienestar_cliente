import { Component, OnInit } from "@angular/core";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { SolicitudService } from "../../../@core/data/solicitud.service";
import { AtencionesService } from "../services/atenciones.service";
import { TipoSolicitud } from "../../../@core/data/models/solicitud/tipo_solicitud";
import { Estado } from "../../../@core/data/models/solicitud/estado";
import { EstudiantesService } from "../../../shared/services/estudiantes.service";
import { ListService } from "../../../@core/store/list.service";
import { InfoCompletaEstudiante } from "../../../@core/data/models/info-completa-estudiante/info-completa-estudiante";

@Component({
  selector: "ngx-crear-atencion",
  templateUrl: "./crear-atencion.component.html",
  styleUrls: ["./crear-atencion.component.scss"],
})
export class CrearAtencionComponent implements OnInit {
  constructor(
    private estudiantesService: EstudiantesService,
    private atencionesService: AtencionesService,
    private listService: ListService
  ) {}
  value: string = "";
  atenciones: Solicitud[] = [];
  tiposAtenciones: TipoSolicitud[] = [];
  estadosAtenciones: Estado[] = [];
  estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante();
  codigo: string = "";

  // { codigo: "20172020079", estado: "A", pensum: "325", carrera: "20", nombre: "BUITRAGO CAMACHO WILLIAM NICOLAS" }

  ngOnInit() {
    this.findAtenciones();
    this.getTiposAtenciones();
    this.getEstadosAtenciones();
  }

  getEstudiante() {
    this.estudiantesService.getEstudiante(this.codigo).subscribe((res) => {
      this.estudiante.Nombre =
        res.datosEstudianteCollection.datosBasicosEstudiante[0].nombre;
      this.estudiante.Carnet =
        res.datosEstudianteCollection.datosBasicosEstudiante[0].codigo;
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
}
