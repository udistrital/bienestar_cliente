import { Component, OnInit } from "@angular/core";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { SolicitudService } from "../../../@core/data/solicitud.service";
import { AtencionesService } from "../services/atenciones.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "ngx-crear-atencion",
  templateUrl: "./crear-atencion.component.html",
  styleUrls: ["./crear-atencion.component.scss"],
})
export class CrearAtencionComponent implements OnInit {
  constructor(
    private solicitudService: SolicitudService,
    private atencionesService: AtencionesService
  ) {}
  value: string = "";
  atenciones: Solicitud[] = [];

  ngOnInit() {
    this.findAtenciones();
  }

  findAtenciones() {
    this.atencionesService.findAtenciones().subscribe((response) => {
      this.atenciones = response;
    });
  }
}
