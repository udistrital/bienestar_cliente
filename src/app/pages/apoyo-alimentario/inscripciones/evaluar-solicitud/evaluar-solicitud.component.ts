import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
          let solicitud: Solicitud;
          if (result.length > 0) {
            console.log(result);
            
              this.solicitud = result[0];
              try {
                if(this.solicitud.Id==this.idSolicitud){

                }else{
                  this.solicitud=null;
                }
              } catch (error) {
                this.solicitud=null;
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

}


