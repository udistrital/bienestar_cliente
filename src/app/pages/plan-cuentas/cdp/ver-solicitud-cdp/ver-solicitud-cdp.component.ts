import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { PopUpManager } from '../../../../@core/managers/popUpManager';

@Component({
  selector: 'ngx-ver-solicitud-cdp',
  templateUrl: './ver-solicitud-cdp.component.html',
  styleUrls: ['./ver-solicitud-cdp.component.scss']
})
export class VerSolicitudCdpComponent implements OnInit {

  @Input('solicitudcdp') solicitud: object;
  @Output() eventChange = new EventEmitter();
  necesidad: any = {};

  constructor(
    private cdpHelper: CDPHelper,
    // tslint:disable-next-line
    private rqManager: RequestManager,
    private popManager: PopUpManager,
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
        // TODO usar el endpoint de expedir cdp cuando se implemente el mismo
      }
    });
  }

}
