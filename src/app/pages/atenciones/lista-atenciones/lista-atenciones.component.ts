import { Component, OnInit } from "@angular/core";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { AtencionesService } from "../services/atenciones.service";

export interface PeriodicElement {
  idAtencion: number;
  codigo: string;
  nombre: number;
  fechaCreacion: Date;
  fechaFinalizacion: Date;
  estado: string;
}

@Component({
  selector: "ngx-lista-atenciones",
  templateUrl: "./lista-atenciones.component.html",
  styleUrls: ["./lista-atenciones.component.scss"],
})
export class ListaAtencionesComponent implements OnInit {
  displayedColumns: string[] = [
    "idAtencion",
    "codigo",
    "nombre",
    "fechaCreacion",
    "fechaFinalizacion",
    "estado",
    "acciones",
  ];
  dataSource: Solicitud[] = [];
  constructor(private atencionesService: AtencionesService) {}

  ngOnInit() {
    this.findAtenciones();
    this.atencionesService.createAtencion();
  }

  findAtenciones() {
    this.atencionesService.findAtenciones().subscribe((response) => {
      // Filtra las atenciones de bienestar
      this.dataSource = response.filter((atencion) =>
        atencion.EstadoTipoSolicitudId.TipoSolicitud.Nombre.includes(
          "Atención Bienestar"
        )
      );
      // Ajusta las fechas
      this.dataSource.forEach(atencion=>{
        atencion.FechaCreacion=atencion.FechaCreacion.split(" ")[0]
      })
      console.log(this.dataSource);
    });
  }
}
