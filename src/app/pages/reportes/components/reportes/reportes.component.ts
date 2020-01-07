import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { KnowageHelper } from '../../../../@core/helpers/knowage/knowage.helper';
// import { spago } from '../../dependences/SpagoBIAPI/*' ;
import {spagoBIService} from '../../dependences/SpagoBIAPI/spagoBiService.js' ;



@Component({
  selector: 'ngx-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  
  reporte: any;
  reportes: object[];
  @ViewChild('spagoBIDocumentArea', {static: false}) spagoBIDocumentArea: ElementRef;
  reportConfig: {
  documentLabel: string; eecutionRole: string;
    // parameters: {'PARAMETERS': 'param_1=1&param_2=2'},
    displayToolbar: boolean; displaySliders: boolean; iframe: { style: string; height: string; width: string; };
  };


  constructor() {
    this.reportes = [
      {name: 'Apropiación inicial', label: 'apropiacion_inicial'},
      {name: 'Consecutivo compromisos', label: 'cons_compr'},
      {name: 'Libro de ejecución de ingresos y gastos', label: 'libro_ingr_gastos'}
    ]
    this.initReportConfig();
  }

  initReportConfig() {
    this.reportConfig = {
      documentLabel: 'apropiacion_inicial',
      eecutionRole: '/spagobi/user/admin',
      // parameters: {'PARAMETERS': 'param_1=1&param_2=2'},
      displayToolbar: true,
      displaySliders: true,
      iframe: {
          style: 'border: solid rgb(0,0,0,0.2) 1px;',
          height: '500px;',
          width: '100%',
      },
    };
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
    
  }

  getReporte() {
    spagoBIService.getReport(this, this.callbackFunction);
  }

  showReport(label: string) {
    this.reportConfig.documentLabel = label;
    this.getReporte();
  }

}
