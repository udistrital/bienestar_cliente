import { Component, OnInit, ViewChild } from "@angular/core";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { AtencionesService } from "../services/atenciones.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

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
  data: Solicitud[] = [];
  dataSource: Solicitud[] = [];
  mostrarAtenciones: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private atencionesService: AtencionesService) {}

  ngOnInit() {}

  showAtenciones() {
    this.mostrarAtenciones = !this.mostrarAtenciones;
    if (this.mostrarAtenciones) {
      this.findAtenciones();
    }
  }

  applyFilter(filterValue: string) {
    // this.dataSource = filterValue.trim().toLowerCase();
    this.dataSource = this.data.filter(
      (atencion) =>
        atencion.EstadoTipoSolicitudId.TipoSolicitud.Id == parseInt(filterValue)
    );
  }

  findAtenciones() {
    this.atencionesService.findAtenciones().subscribe((response) => {
      // Filtra las atenciones de bienestar
      this.data = response.filter((atencion) =>
        atencion.EstadoTipoSolicitudId.TipoSolicitud.Nombre.includes(
          "Atención Bienestar"
        )
      );
      this.dataSource = [...this.data];
      // Ajusta las fechas
      this.dataSource.forEach((atencion) => {
        atencion.FechaCreacion = atencion.FechaCreacion.split(" ")[0];
      });
    });
  }
}
