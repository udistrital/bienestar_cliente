import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import 'style-loader!angular2-toaster/toaster.css';
import { LocalDataSource } from 'ng2-smart-table';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';



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
  cambiotab: boolean = false;
  listColumns: object;
  solicitudcdp: object;

  source: LocalDataSource = new LocalDataSource();

  constructor(private translate: TranslateService,
    private cdpHelper: CDPHelper,
    private rqManager: RequestManager, ) { }

  ngOnInit() {
    this.loadDataFunction = this.cdpHelper.getSolicitudesCDP;
    this.rqManager = this.rqManager;

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
        custom: [{ name: 'ver', title: '<i class="fas fa-eye" (click)="ver($event)"></i>' }],
        position: 'right'
      },
      mode: 'external',
      columns: this.listColumns,
    };

    this.loadData();


  }


  loadData(): void {
    this.loadDataFunction('').subscribe(res => {
      if (res) {
        const data = <Array<any>>res;
        this.source.load(data);
      } else {
        this.source.load([]);
      }
    });
  }

  verSolicitud(scdp) {
    this.solicitudcdp = scdp;
    this.onCambiotab();
  }

  onCustom(event: any) {
    switch (event.action) {
      case 'ver':
        this.verSolicitud(event.data);
    }
  }

  onCambiotab(): void {
    this.cambiotab = !this.cambiotab ;
  }



}
