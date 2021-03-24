import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Solicitante } from '../../../../@core/data/models/solicitud/solicitante';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { SolicitudService } from '../../../../@core/data/solicitud.service';

@Component({
  selector: 'ngx-evaluar-solicitud',
  templateUrl: './evaluar-solicitud.component.html',
  styleUrls: ['./evaluar-solicitud.component.scss']
})
export class EvaluarSolicitudComponent implements OnInit {
  idSolicitud = 0;
  solicitud: Solicitud = null;
  solicitante: Solicitante = null;
  constructor(
    private route: ActivatedRoute,
    private solicitudService: SolicitudService
  ) {
    this.idSolicitud = parseInt(this.route.snapshot.paramMap.get('idSolicitud'));
    if (this.idSolicitud != 0) {
      this.loadSolicitudSp();
    }
  }

  ngOnInit() {
  }
  public loadSolicitudSp() {
    this.solicitudService.get(`solicitud?query=Id:${this.idSolicitud}`)
      .subscribe(
        (result: any[]) => {
          if (result.length > 0) {
            console.log(result);
            this.solicitud = result[0];
            try {
              if (this.solicitud.Id == this.idSolicitud) {
                this.loadSolicitanteSp();
              } else {
                this.solicitud = null;
              }
            } catch (error) {
              this.solicitud = null;
            }

          }
          else {
            this.solicitud = null;
          }
          //this.solicitud=null
        },
        error => {
          this.solicitud = null;
        },
      );

  }
  public loadSolicitanteSp() {
    this.solicitudService.get(`solicitante?query=SolicitudId.Id:${this.idSolicitud}`)
      .subscribe(
        (result: any[]) => {
          let solicitante: Solicitante;
          if (result.length > 0) {
            console.log(result);
            this.solicitante = result[0];
            try {
              if (this.solicitante.SolicitudId.Id == this.idSolicitud) {

              } else {
                this.solicitante = null;
              }
            } catch (error) {
              this.solicitante = null;
            }

          }
          else {
            this.solicitante = null;
          }
          //this.solicitud=null
        },
        error => {
          this.solicitante = null;
        },
      );

  }

}


