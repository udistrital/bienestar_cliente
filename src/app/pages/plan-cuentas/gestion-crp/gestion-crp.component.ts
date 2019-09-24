import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-gestion-crp',
  templateUrl: './gestion-crp.component.html',
  styleUrls: ['./gestion-crp.component.scss']
})
export class GestionCrpComponent implements OnInit {
  opcionSeleccionada: boolean;
  opcion: string;
  vigencia: number;
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      'solicitud_crp',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'presupuesto/../assets/images/solicitud_crp.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'consulta_crp',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'presupuesto/../assets/images/consulta_crp.svg'
      )
    );

    this.opcionSeleccionada = false;
    this.opcion = '';
    this.vigencia = 2020;
  }

  ngOnInit() {}
  routeView(opc) {
    console.info(opc);
    this.opcionSeleccionada = true;
    this.opcion = opc;
  }
  backView() {
    this.opcionSeleccionada = false;
    this.opcion = '';
  }
}