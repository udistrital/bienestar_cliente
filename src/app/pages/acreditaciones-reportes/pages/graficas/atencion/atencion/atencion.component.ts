import { Component, OnInit, Input } from "@angular/core";
import { AtencionesService } from "../../../../services/atenciones.service";
import { DateCustomPipePipe } from "../../../../../../shared/pipes/date-custom-pipe.pipe";
import { FormsModule } from "../../../../../forms/forms.module";
import { UtilService } from "../../../../../../shared/services/utilService";
FormsModule;

export interface PeriodicElement {
  name: string;
  value: number;
}

@Component({
  selector: "ngx-atencion",
  templateUrl: "./atencion.component.html",
  styleUrls: ["./atencion.component.scss"],
})
export class AtencionComponent implements OnInit {
  fechaInicio = "";
  fechaFinal = "";
  facultades: string[] = [
    "FACULTAD DE INGENIERIA",
    "FACULTAD DE CIENCIAS Y EDUCACION",
    "FACULTAD DE MEDIO AMBIENTE",
    "FACULTAD TECNOLOGICA",
    "FACULTAD DE CIENCIAS MATEMATICAS Y NATURALES",
    "FACULTAD DE ARTES -  ASAB",
  ];
  facultad = "";
  dataAxS = null;
  dataAxF = null;

  constructor(
    private AtencionesService: AtencionesService,
    private utilService: UtilService,
    private dateCustomPipe: DateCustomPipePipe
  ) {
    this.dataAxS = this.AtencionesService.atencionesDataAxS;
    this.dataAxF = this.AtencionesService.atencionesDataAxF;
  }
  ELEMENT_DATA: PeriodicElement[] = this.dataAxS;
  displayedColumns: string[] = ["name", "value"];
  dataSource = this.ELEMENT_DATA;

  @Input() atencion!: any;

  ngOnInit() {}

  //pasar tipo de atencion al servicio
  BuscarSolicitud() {
    let fechaI = this.fechaInicio
      ? this.dateCustomPipe.transform(this.fechaInicio)
      : "";
    let fechaF = this.fechaInicio
      ? this.dateCustomPipe.transform(this.fechaFinal)
      : "";

    this.AtencionesService.setFiltroFacultad(
      this.facultad,
      fechaI,
      fechaF
    ).then(() => {
      this.dataAxS = this.AtencionesService.atencionesDataAxS;
      this.dataAxF = this.AtencionesService.atencionesDataAxF;
    });
  }

  exportarCsv() {
    console.log("dataAxS : ", this.dataAxS);

    // const headers = {
    //   nombre: "nombre",
    //   numeroArencion: "atenciones",
    // };

    // const data = [];
    // for (const s of this.dataAxF) {
    //   data.push({
    //     facultad: s.name,
    //     Numero_Atenciones: s.value,
    //   });
    // }

    // // for (const s of  this.dataAxS) {
    // //   data.push({
    // //     atencion: s.name,
    // //     Numero_Atenciones: s.value
    // //   });
    // // }
    // let nombre = "solicitudes";
    // // let nombre = "solicitudes " +
    // //   (this.estadoNum != null ? this.estadosTipoSolicitud[this.estadoNum].EstadoId.Nombre + " " : "") +
    // //   (this.periodos[this.periodo] != null ? this.periodos[this.periodo].Nombre : "historico") +
    // //   " "+(new Date()).toISOString();
    // this.utilService.exportCSVFile(headers, data, nombre);
  }
}
