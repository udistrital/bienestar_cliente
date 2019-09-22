import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-gestion-apropiaciones',
  templateUrl: './gestion-apropiaciones.component.html',
  styleUrls: ['./gestion-apropiaciones.component.scss'],
})
export class GestionApropiacionesComponent implements OnInit {
  opcionSeleccionada: boolean;
  opcion: string;
  vigencia: number;
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      'consulta_apropiacion',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'presupuesto/../assets/images/consulta_apropiacion.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'preasignacion',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'presupuesto/../assets/images/preasignacion.svg'
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
