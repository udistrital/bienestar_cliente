import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';

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
  ) {
   }

  ngOnInit() {
    this.necesidad = this.cdpHelper.getNecesidad(this.solicitud['necesidad']);
    console.info('this nes' , this.necesidad);
  }

  cambioTab () {
    this.eventChange.emit(false);

  }

}
