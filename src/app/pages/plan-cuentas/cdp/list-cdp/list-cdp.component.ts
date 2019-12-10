import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { DocumentoPresupuestalHelper } from '../../../../@core/helpers/documentoPresupuestal/documentoPresupuestalHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


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

  centros = { '1': 'Rector', '2': 'Convenios' };
  areas = {'1': 'Universidad Distrital Francisco José de Caldas' };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private translate: TranslateService,
    private cdpHelper: CDPHelper,
    private documentoPresupuestal: DocumentoPresupuestalHelper,
    private rqManager: RequestManager,
  ) { }

  ngOnInit() {
    this.loadDataFunction = this.documentoPresupuestal.GetAllDocumentoPresupuestalByTipo;

    this.listColumns = {
      vigencia: {
        title: this.translate.instant('GLOBAL.vigencia'),
        filter: true,
        valuePrepareFunction: value => {
          return 2019;
        }
      },
      CentroGestor: {
        title: this.translate.instant('GLOBAL.centro_gestor'),
        filter: true,
        valuePrepareFunction: (value: string) => {
          return this.centros[value];
        }
      },
      entidad: {
        title: this.translate.instant('GLOBAL.area_funcional'),
        filter: true,
        valuePrepareFunction: (value: string) => {
          return 'Universidad Distritral Francisco José de Caldas';
        }
      },
      Consecutivo: {
        title: this.translate.instant('CDP.n_cdp'),
        filter: true,
        valuePrepareFunction: value => {
          return value;
        }
      },
      Tipo: {
        title: this.translate.instant('GLOBAL.tipo'),
        filter: true,
        valuePrepareFunction: (value: string) => {
          return this.translate.instant('CDP.' + value);
        }
      },
      Estado: {
        title: this.translate.instant('CDP.estado_cdp'),
        filter: true,
        valuePrepareFunction: (value: string) => {
          return this.translate.instant('CDP.' + value);
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
    forkJoin({
      documentos: this.loadDataFunction('2019', '1', 'cdp'),
      cdp: this.cdpHelper.getListaCDP()
    }).subscribe(res => {
      res.documentos.forEach((documento: any) => {
        const solCdp = res.cdp.filter((cdp: object) => cdp['_id'] === documento.Data.solicitud_cdp)[0];
        documento.necesidad = solCdp ? solCdp.necesidad : undefined ;
      });
      const data = <Array<any>>res.documentos;
      this.source.load(data);
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
