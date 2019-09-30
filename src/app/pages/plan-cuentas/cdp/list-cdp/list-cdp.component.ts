import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-list-cdp',
  templateUrl: './list-cdp.component.html',
  styleUrls: ['./list-cdp.component.scss']
})
export class ListCdpComponent implements OnInit {

  uuidReadFieldName: string;
  loadDataFunction: (...params) => Observable<any>;
  formTittle: string;
  loadFormDataFunction: (...params) => Observable<any>;
  isOnlyCrud: boolean;
  settings: object;
  cambiotab: boolean = false;
  listColumns: object;
  cdp: object;

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private translate: TranslateService,
    private cdpHelper: CDPHelper,
    // tslint:disable-next-line
    private rqManager: RequestManager,
  ) { }

  ngOnInit() {
    this.loadDataFunction = this.cdpHelper.getListaCDP;

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
      infoCdp: {
        title: this.translate.instant('CDP.n_cdp'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value.consecutivo;
        }
      },
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

  onCustom(event: any) {
    switch (event.action) {
      case 'ver':
        this.verCDP(event.data);
    }
  }
  verCDP(cdp) {
    this.cdp = cdp;
    // this.onCambiotab();
  }

}
