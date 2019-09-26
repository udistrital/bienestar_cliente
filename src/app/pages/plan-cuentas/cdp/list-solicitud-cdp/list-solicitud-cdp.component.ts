import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import 'style-loader!angular2-toaster/toaster.css';
import { verifyHostBindings } from '@angular/compiler';
import { getLocaleExtraDayPeriodRules } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { VerSolicitudCdpComponent } from '../ver-solicitud-cdp/ver-solicitud-cdp.component';


@Component({
  selector: 'ngx-list-solicitud-cdp',
  templateUrl: './list-solicitud-cdp.component.html',
  styleUrls: ['./list-solicitud-cdp.component.scss']
})
export class ListSolicitudCdpComponent implements OnInit {

  uuidReadFieldName: string;
  loadDataFunction: (...params) => Observable<any>;
  formTittle: string;
  loadFormDataFunction: (...params) => Observable<any>;
  isOnlyCrud: boolean;
  settings: object;
  auxcambiotab: boolean = false;
  listColumns: object;
  solicitudcdp: object;

  source: LocalDataSource = new LocalDataSource();

  constructor(private translate: TranslateService,
    private cdpHelper: CDPHelper,
    private rqManager: RequestManager,) { }

  ngOnInit() {
    this.loadDataFunction = this.cdpHelper.getSolicitudesCDP;


    this.listColumns = {
      vigencia: {
        title: this.translate.instant('GLOBAL.vigencia'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      centroGestor: {
        title: this.translate.instant('GLOBAL.centro_gestor'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      entidad: {
        title: this.translate.instant('GLOBAL.unidad-ejecutora'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      consecutivo: {
        title: this.translate.instant('CDP.n_solicitud'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      }
    };

    this.settings = {
      actions: {
        add: false,
        edit: false,
        delete: false,
        custom: [{ name: 'ver', title: '<div class="container-fluid"><i class="fas fa-eye" (click)="ver($event)">ver</i></div>' }],
        position: 'right'
      },
      mode: 'external',
      columns: this.listColumns,
    };

    this.loadData();


  }


  loadData(): void {
    this.loadDataFunction("").subscribe(res => {
      if (res !== null) {
        console.info("res", res)
        const data = <Array<any>>res;
        this.source.load(data);
      } else {
        this.source.load([]);
      }
    });
  }

  verSolicitud(scdp) {
    console.info(scdp)
    this.solicitudcdp=scdp;
  }

  onCustom(event: any) {
    switch(event.action) {
      case "ver":
        this.verSolicitud(event.data);
    }
    // this.actaSeleccionada = `${event.data.Id}`;
    // this.estadoActaSeleccionada = `${event.data.Estado}`;
    // this.accion = `${event.action}`;
  }



}
