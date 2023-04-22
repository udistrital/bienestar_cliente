import { Component, OnInit, Input } from "@angular/core";
import { AtencionesService } from "../services/atenciones.service";
import { Observacion } from "../../../@core/data/models/solicitud/observacion";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";

@Component({
  selector: "ngx-modal-atenciones",
  templateUrl: "./modal-atenciones.component.html",
  styleUrls: ["./modal-atenciones.component.scss"],
})
export class ModalAtencionesComponent implements OnInit {
  constructor(private atencionesService: AtencionesService) {}
  @Input() codigo_atencion: string;
  terceroId: number;
  fecha_apertura: string = "";
  fecha_finalizacion: string = "";
  observaciones: Observacion[] = [];
  atencion: Solicitud = new Solicitud();

  ngOnInit() {}

  getAtencion() {
    this.atencionesService
      .getAtencion(this.codigo_atencion)
      .subscribe((res) => {
        this.atencion = res;
        console.log("atencion", this.atencion);
        this.terceroId = res.TerceroId;
        //this.fecha_apertura = res.FechaCreacion
        this.fecha_apertura = new Date(res.FechaCreacion)
          .toISOString()
          .substring(0, 10);
        if (res.fecha_finalizacion != null) {
          this.fecha_finalizacion = new Date(res.fecha_finalizacion)
            .toISOString()
            .substring(0, 10);
        }

        console.log("ID DEL SOLICITANTE " + res.TerceroId);

        //this.fecha_finalizacion = res.fecha_finalizacion
      });
    this.atencionesService
      .getObservacionesxAtencion(this.codigo_atencion)
      .subscribe((res) => {
        this.observaciones = res;
        console.log("observaciones", this.observaciones);
      });
  }
}
