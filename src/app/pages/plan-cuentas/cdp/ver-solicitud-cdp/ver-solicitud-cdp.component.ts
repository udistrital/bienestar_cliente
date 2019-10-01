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
    this.cdpHelper.getNecesidadAdm(this.solicitud['necesidad']).subscribe(res => {
      const nec_adm = res;
      this.cdpHelper.getNecesidadPC(this.solicitud['necesidad']).subscribe(nec_pc => {
        this.necesidad = {...nec_adm, ...nec_pc};
      });
    });
  }

  cambioTab () {
    this.eventChange.emit(false);
  }

  expedirCDP(consecutivo) {
    this.popManager.showAlert('warning', 'Expedir CDP', '¿está seguro?')
    .then((result) => {
      if (result.value) {
        console.info(`expedir CDP ${consecutivo}`);
        this.router.navigate(['/pages/plan-cuentas/cdp']);
        // TODO usar el endpoint de expedir cdp cuando se implemente el mismo
      }
    });
  }

  mostrarPDF(consecutivo) {
    this.tituloPDF = `Certificado de disponibilidad presupuestal N° ${consecutivo}`;
    this.mostrandoPDF = !this.mostrandoPDF;
  }

}
