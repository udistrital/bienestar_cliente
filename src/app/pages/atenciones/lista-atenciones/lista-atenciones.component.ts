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
const ELEMENT_DATA: PeriodicElement[] = [
  {
    idAtencion: 1,
    codigo: "Hydrogen",
    nombre: 1.0079,
    fechaCreacion: new Date(),
    fechaFinalizacion: new Date(),
    estado: "Activo",
  },
  {
    idAtencion: 2,
    codigo: "Helium",
    nombre: 4.0026,
    fechaCreacion: new Date(),
    fechaFinalizacion: new Date(),
    estado: "Activo",
  },
  {
    idAtencion: 3,
    codigo: "Lithium",
    nombre: 6.941,
    fechaCreacion: new Date(),
    fechaFinalizacion: new Date(),
    estado: "Activo",
  },
  {
    idAtencion: 4,
    codigo: "Beryllium",
    nombre: 9.0122,
    fechaCreacion: new Date(),
    fechaFinalizacion: new Date(),
    estado: "Activo",
  },
  {
    idAtencion: 5,
    codigo: "Boron",
    nombre: 10.811,
    fechaCreacion: new Date(),
    fechaFinalizacion: new Date(),
    estado: "Activo",
  },
  {
    idAtencion: 6,
    codigo: "Carbon",
    nombre: 12.0107,
    fechaCreacion: new Date(),
    fechaFinalizacion: new Date(),
    estado: "Activo",
  },
  {
    idAtencion: 7,
    codigo: "Nitrogen",
    nombre: 14.0067,
    fechaCreacion: new Date(),
    fechaFinalizacion: new Date(),
    estado: "Activo",
  },
  {
    idAtencion: 8,
    codigo: "Oxygen",
    nombre: 15.9994,
    fechaCreacion: new Date(),
    fechaFinalizacion: new Date(),
    estado: "Activo",
  },
  {
    idAtencion: 9,
    codigo: "Fluorine",
    nombre: 18.9984,
    fechaCreacion: new Date(),
    fechaFinalizacion: new Date(),
    estado: "Activo",
  },
  {
    idAtencion: 10,
    codigo: "Neon",
    nombre: 20.1797,
    fechaCreacion: new Date(),
    fechaFinalizacion: new Date(),
    estado: "Activo",
  },
];

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
    // this.findAtenciones();
    this.atencionesService.createAtencion()
  }

  findAtenciones() {
    this.atencionesService.findAtenciones().subscribe((response) => {
      this.dataSource = response;
      console.log(this.dataSource);
    });
  }
}
