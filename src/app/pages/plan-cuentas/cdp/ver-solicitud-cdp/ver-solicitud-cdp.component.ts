import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-ver-solicitud-cdp',
  templateUrl: './ver-solicitud-cdp.component.html',
  styleUrls: ['./ver-solicitud-cdp.component.scss']
})
export class VerSolicitudCdpComponent implements OnInit {

  @Input('solicitudcdp') solicitud: object;
  @Input('expedido') expedido: boolean;
  @Output() eventChange = new EventEmitter();
  necesidad: any = {};
  TrNecesidad: any;
  mostrandoPDF: boolean = false;
  enlacePDF: string = 'assets/images/cdp_ejemplo.pdf';
  tituloPDF: string = '';

  constructor(
    private cdpHelper: CDPHelper,
    // tslint:disable-next-line
    private rqManager: RequestManager,
    private popManager: PopUpManager,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.cdpHelper.getFullNecesidad(this.solicitud['necesidad']).subscribe(res => {
      this.TrNecesidad = res;
      if (this.TrNecesidad.Rubros) {
        this.TrNecesidad.Rubros.forEach(rubro => {
          rubro.MontoParcial = 0
          if (rubro.Metas) {
            rubro.Metas.forEach(meta => {
              if (meta.Actividades) {
                meta.Actividades.forEach(act => {
                  if (act.FuentesActividad) {
                    act.FuentesActividad.forEach(fuente => {
                      rubro.MontoParcial += fuente.MontoParcial
                    });
                  }
                });
              }
            });
          }
          if (rubro.Fuentes) {
            rubro.Fuentes.forEach(fuente => {
              rubro.MontoParcial += fuente.MontoParcial
            });

          }

        });
      }
    });
  }

  cambioTab() {
    this.eventChange.emit(false);
  }

  expedirCDP(consecutivo) {
    this.popManager.showAlert('warning', `Expedir CDP ${consecutivo}`, '¿está seguro?')
      .then((result) => {
        if (result.value) {
          this.cdpHelper.expedirCDP(this.solicitud["_id"]).subscribe(res => {
            if (res) {
              this.popManager.showSuccessAlert(`Se expidió con exito el CDP ${res.infoCdp.consecutivo}`)
              this.router.navigate(['/pages/plan-cuentas/cdp']);
            }

          })

        }
      });
  }

  mostrarPDF(consecutivo) {
    this.tituloPDF = `Certificado de disponibilidad presupuestal N° ${consecutivo}`;
    this.mostrandoPDF = !this.mostrandoPDF;
  }

}
