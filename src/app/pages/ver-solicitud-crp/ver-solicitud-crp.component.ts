import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CRPHelper } from '../../@core/helpers/crp/crpHelper';
import { RequestManager } from '../../@core/managers/requestManager';
import { PopUpManager } from '../../@core/managers/popUpManager';
import { Router } from '@angular/router';
import { CDPHelper } from '../../@core/helpers/cdp/cdpHelper';

@Component({
  selector: 'ngx-ver-solicitud-crp',
  templateUrl: './ver-solicitud-crp.component.html',
  styleUrls: ['./ver-solicitud-crp.component.scss']
})
export class VerSolicitudCrpComponent implements OnInit {


  @Input('solicitudcrp') solicitud: object;
  @Input('expedido') expedido: boolean;
  @Output() eventChange = new EventEmitter();
  necesidad: any = {};
  cdpData: any = {};
  mostrandoPDF: boolean = false;
  enlacePDF: string = 'assets/images/cdp_ejemplo.pdf';
  tituloPDF: string = '';
  constructor(
    private crpHelper: CRPHelper,
    private cdpHelper: CDPHelper,
    // tslint:disable-next-line
    private rqManager: RequestManager,
    private popManager: PopUpManager,
    private router: Router,
  ) { }

  ngOnInit() {
    console.info(this.solicitud);
    this.crpHelper.getInfoCDP(this.solicitud['consecutivoCdp']).subscribe(resCdp => {
      const cdpInfo = resCdp;
      console.info(cdpInfo, "On init");
      this.cdpHelper.getNecesidadAdm(cdpInfo.necesidad).subscribe(res => {
        const nec_adm = res;
        this.cdpHelper.getNecesidadPC(cdpInfo.necesidad).subscribe(nec_pc => {
          this.necesidad = {...nec_adm, ...nec_pc};
          this.cdpData = cdpInfo;

          console.info("Pa que highlighter si tu brillas sola :v ", this.necesidad , this.cdpData);
        });
      }); 
    })

  }


  cambioTab () {
    this.eventChange.emit(false);
  }

  expedirCRP(consecutivo) {
    this.popManager.showAlert('warning', 'Expedir CRP', '¿está seguro?')
    .then((result) => {
      if (result.value) {
        console.info(`Expedir CRP ${consecutivo}`);
        this.router.navigate(['/pages/plan-cuentas/crp']);
        // TODO usar el endpoint de expedir cdp cuando se implemente el mismo
      }
    });
  }

  mostrarPDF(consecutivo) {
    this.tituloPDF = `Certificado de Registro Presupuestal N° ${consecutivo}`;
    this.mostrandoPDF = !this.mostrandoPDF;
  }
}
