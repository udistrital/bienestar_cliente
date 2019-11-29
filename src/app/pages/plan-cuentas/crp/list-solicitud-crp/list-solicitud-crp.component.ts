import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { CRPHelper } from '../../../../@core/helpers/crp/crpHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';


@Component({
  selector: 'ngx-list-solicitud-crp',
  templateUrl: './list-solicitud-crp.component.html',
  styleUrls: ['./list-solicitud-crp.component.scss']
})
export class ListSolicitudCrpComponent implements OnInit {
  uuidReadFieldName: string;
  loadDataFunction: (...params) => Observable<any>;
  formTittle: string;
  loadFormDataFunction: (...params) => Observable<any>;
  isOnlyCrud: boolean;
  settings: object;
  cambiotab: boolean = false;
  listColumns: object;
  solicitudcrp: object;

  source: LocalDataSource = new LocalDataSource();

  constructor(private translate: TranslateService,
    private crpHelper: CRPHelper,
    private cdpHelper: CDPHelper,
    // tslint:disable-next-line
    private rqManager: RequestManager, ) { }

  ngOnInit() {
    //this.crpHelper.getInfoCRP(1);
    this.crpHelper.getInfoContrato(458,2017);
    this.loadDataFunction = this.crpHelper.getSolicitudesCRP;


    this.listColumns = {
      consecutivo: {
        title: this.translate.instant('CRP.n_sol_crp'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      vigencia: {
        title: this.translate.instant('GLOBAL.placeholder_vigencia'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      centroGestor: {
        title: this.translate.instant('GLOBAL.centro_gestor'),
        // type: 'string;',
        valuePrepareFunction: value => {
          // if(value===1){
          //   return "Rector"
          // }else{
          //   return value;
          // }

          return "Rector";
        }
      },
      entidad: {
        title: this.translate.instant('GLOBAL.entidad'),
        // type: 'string;',
        valuePrepareFunction: value => {
          // if(value===1){
          //   return "Universidad Distrital FJC"
          // }else{
          //   return value;
          // }
          return "Universidad Distrital FJC";
        }
      },
      financiacion: {
        title: this.translate.instant('CRP.financiacion'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return "Inversión";
        }
      }
    };

    this.settings = {
      actions: {
        add: false,
        edit: false,
        delete: false,
        custom: [{ name: 'Ver', title: '<div class="container-fluid"><i class="fas fa-eye" (click)="ver($event)"></i></div>' }],
        position: 'right'
      },
      mode: 'external',
      columns: this.listColumns,
    };

    this.loadData();


  }


  loadData(): void {
    this.loadDataFunction('').subscribe(res => {
      if (res !== null) {
        const data = <Array<any>>res;
        this.source.load(data);
      } else {
        this.source.load([]);
      }
    });
  }


  loadCRPData () {
    var a = this.crpHelper.getFullCRP()

  }

  verSolicitud(scrp) {
    this.solicitudcrp = scrp;
    this.onCambiotab();
  }

  onCambiotab(): void {
    this.cambiotab = !this.cambiotab;
  }

  onCustom(event: any) {

    switch (event.action) {
      case 'Ver':
        this.verSolicitud(event.data);
    }

  }



}