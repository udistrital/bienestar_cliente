import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { DocumentoPresupuestalHelper } from '../../../../@core/helpers/documentoPresupuestal/documentoPresupuestalHelper';
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

  centros = { "1": 'Rector', "2": 'Convenios' };
  areas = {"1": 'Universidad Distrital Francisco José de Caldas' };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private translate: TranslateService,
    private cdpHelper: CDPHelper,
    private documentoPresupuestal: DocumentoPresupuestalHelper,
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
        valuePrepareFunction: (value: string) => {
          return this.centros[value];
        }
      },
      entidad: {
        title: this.translate.instant('GLOBAL.area_funcional'),
        // type: 'string;',
        valuePrepareFunction: (value: string) => {
          return this.areas[value];
        }
      },
      consecutivo: {
        title: this.translate.instant('CDP.n_cdp'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      estado: {
        title: this.translate.instant('CDP.estado_cdp'),
        // type: 'string;',
        valuePrepareFunction: (value: string) => {
          return this.translate.instant('CDP.'+value);
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
        this.documentoPresupuestal.get('2019', '1', 'tipo:cdp').subscribe(listaDocumentos => {
          let documentos = {};
          listaDocumentos.forEach((documento: object) => documentos[documento["Data"]["solicitud_cdp"]] = documento);
          res.forEach((cdp: object) => {
            cdp['consecutivo'] = documentos[cdp['_id']]['Consecutivo'];
            cdp['estado'] = documentos[cdp['_id']]['Estado'];
          });
          this.source.load(data);
        });
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
    this.onCambiotab();
  }

  onCambiotab(): void {
    this.cambiotab = !this.cambiotab ;
  }

}
