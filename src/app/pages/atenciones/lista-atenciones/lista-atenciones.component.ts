import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { AtencionesService } from "../services/atenciones.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private atencionesService: AtencionesService) {}

  ngOnInit() {
    this.findAtenciones();
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


  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  public downloadAsPDF() {
    const doc = new jsPDF();
   
    const pdfTable = this.pdfTable.nativeElement;
   
    var html = htmlToPdfmake(pdfTable.innerHTML);
     
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open(); 
     

  }

}
