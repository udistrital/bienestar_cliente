import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { AtencionesService } from "../services/atenciones.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import jsPDF from "jspdf";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from "html-to-pdfmake";
import { TipoSolicitud } from "../../../@core/data/models/solicitud/tipo_solicitud";
import { CrearAtencionComponent } from "../crear-atencion/crear-atencion.component";
import { ListService } from "../../../@core/store/list.service";
import { DatePipe } from "@angular/common";
import { SolicitudService } from "../../../@core/data/solicitud.service";
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
  tipo: TipoSolicitud = new TipoSolicitud();
  tiposAtenciones: TipoSolicitud[] = [];
  fecha_min: string = "";
  fecha_max : string="";
  tipo_atencion_reporte: TipoSolicitud = new TipoSolicitud();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private atencionesService: AtencionesService,
    private listService: ListService,
    private solicitudService: SolicitudService,
    private datePipe: DatePipe
    ) {}

  
  ngOnInit() {
    this.getTiposAtenciones();
  }

  showAtenciones() {
    this.mostrarAtenciones = !this.mostrarAtenciones;
    if (this.mostrarAtenciones) {
      this.findAtenciones();
    }
  }

  getTiposAtenciones() {
    this.atencionesService.getTiposAtenciones().subscribe((response) => {
      this.tiposAtenciones = response.Data.filter((tipoAtencion) =>
        tipoAtencion.Nombre.includes("Atención Bienestar")
      );
    });
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

      this.data = this.data.filter((atencion) =>
        atencion.EstadoTipoSolicitudId.TipoSolicitud = this.tipo_atencion_reporte
      
      );

      
      
      
      this.data = this.data.filter((atencion)=>
         // atencion.FechaCreacion > this.fecha_min 
         new Date(atencion.FechaCreacion) > new Date( this.fecha_min)
      );
      

      
      this.data = this.data.filter((atencion)=>
      new Date(atencion.FechaCreacion) < new Date( this.fecha_max)
      );

      
      
      this.dataSource = [...this.data];
      // Ajusta las fechas
      this.dataSource.forEach((atencion) => {
        atencion.FechaCreacion = atencion.FechaCreacion.split(" ")[0];
      });

    });
  }

  reporteAtenciones(){
    console.log(this.fecha_min)
    console.log(this.fecha_max)
    console.log(this.tipo_atencion_reporte)
    this.findAtenciones()
  }

  @ViewChild("pdfTable", { static: false }) pdfTable: ElementRef;
  public downloadAsPDF() {
    const doc = new jsPDF();

    const pdfTable = this.pdfTable.nativeElement;

    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();
  }
}

