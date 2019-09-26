import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-ver-solicitud-cdp',
  templateUrl: './ver-solicitud-cdp.component.html',
  styleUrls: ['./ver-solicitud-cdp.component.scss']
})
export class VerSolicitudCdpComponent implements OnInit {

  cdp: any;
  @Input('solicitudcdp') solicitud: object;

  constructor() {
   }

  ngOnInit() {
  }

}
