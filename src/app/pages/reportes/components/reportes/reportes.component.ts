import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// tslint:disable-next-line
import { KnowageHelper } from '../../../../@core/helpers/knowage/knowage.helper';
// import { spago } from '../../dependences/SpagoBIAPI/*' ;
import { spagoBIService } from '../../dependences/SpagoBIAPI/spagoBiService.js';
import { ImplicitAutenticationService } from '../../../../@core/utils/implicit_autentication.service';

@Component({
  selector: 'ngx-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  username: '';
  vigencia: number;
  area: number;
  consecutivo: number;

  reporte: any;
  reportes: object[];
  vigencias = [2020, 2019];
  areas = [
    { label: 'Rector', value: 1 },
    { label: 'Convenios', value: 2 }
  ];
  @ViewChild('spagoBIDocumentArea', { static: false })
  spagoBIDocumentArea: ElementRef;
  reportConfig: {
    documentLabel: string;
    executionRole: string;
    parameters: {},
    displayToolbar: boolean;
    displaySliders: boolean;
    iframe: { style: string; height: string; width: string };
  };

  constructor(private autenticacion: ImplicitAutenticationService) {
    this.reportes = [
      { name: 'Certificado de disponibilidad presupuestal', label: 'cdp' },
      { name: 'Certificado de registro presupuestal', label: 'crp' },
      { name: 'Apropiación inicial', label: 'apropiacion_inicial' },
      { name: 'Consecutivo compromisos', label: 'cons_compr' },
      {
        name: 'Libro de ejecución de ingresos y gastos',
        label: 'libro_ingr_gastos'
      },
      {
        name: 'Disponibilidades comprometidas por rubro',
        label: 'disponibilidad_rubro'
      },
      {name: 'Consecutivo de disponibilidades', label: 'consecutivo_disp'}
    ];
    this.initReportConfig();
  }

  initReportConfig() {
    this.reportConfig = {
      documentLabel: 'apropiacion_inicial',
      executionRole: 'dev',
      parameters: { },
      displayToolbar: true,
      displaySliders: true,
      iframe: {
        style: 'border: solid rgb(0,0,0,0.2) 1px;',
        height: '500px;',
        width: '100%'
      }
    };
  }

  buildReportWithParams() {
    this.reportConfig.documentLabel = 'cdp';
    console.info(this.vigencia, this.area, this.consecutivo);
    this.reportConfig.parameters = {
      consecutivo: this.consecutivo,
      areaFuncional: this.area,
      vigencia: this.vigencia,
      usuario: this.username
    };

    this.getReporte();
  }

  callbackFunction(result, args, success) {
    if (success === true) {
      const html = spagoBIService.getDocumentHtml(this.reportConfig);
      this.reporte = html;
      this.spagoBIDocumentArea.nativeElement.innerHTML = html;
    } else {
      // console.info('ERROR: authentication failed! Invalid username and/or password ');
    }
  }

  ngOnInit() {
    this.username = this.autenticacion.getPayload().sub;
  }

  getReporte() {
    spagoBIService.getReport(this, this.callbackFunction);
  }

  showReport(label: string) {
    this.reportConfig.documentLabel = label;
    this.getReporte();
  }
}
