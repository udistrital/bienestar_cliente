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
    this.loadDataFunction = this.documentoPresupuestal.GetAllDocumentoPresupuestalByTipo;

    this.listColumns = {
      vigencia: {
        title: this.translate.instant('GLOBAL.vigencia'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return 2019;
        }
      },
      CentroGestor: {
        title: this.translate.instant('GLOBAL.centro_gestor'),
        // type: 'string;',
        // valuePrepareFunction: (value: string) => {
        //   return this.centros[value];
        // }
        valuePrepareFunction: (value: string) => {
          return "Rector";
        }
      },
      entidad: {
        // title: this.translate.instant('GLOBAL.area_funcional'),
        // // type: 'string;',
        // valuePrepareFunction: (value: string) => {
        //   return this.areas[value];
        // }

        title: this.translate.instant('GLOBAL.area_funcional'),
        // type: 'string;',
        valuePrepareFunction: (value: string) => {
          return "Universidad Distritral Francisco José de Caldas";
        }

      },
      Consecutivo: {
        title: this.translate.instant('CDP.n_cdp'),
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      Estado: {
        title: this.translate.instant('CDP.estado_cdp'),
        // type: 'string;',
        valuePrepareFunction: (value: string) => {
          // return this.translate.instant('CDP.'+value);
          return value;
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
    forkJoin(
      {
        data_function: this.loadDataFunction('2019', '1', 'cdp'),
        query : this.documentoPresupuestal.GetAllDocumentoPresupuestalByTipo('2019', '1', 'cdp_modificacion') // FLAAG
      }
    ).subscribe(res => {
      if (res) {
        let dataAll = res.data_function.concat(res.query);
        const data = <Array<any>>dataAll;
        this.documentoPresupuestal.get('2019', '1', 'tipo:cdp').subscribe(listaDocumentos => {
          let documentos = {};
          listaDocumentos.forEach((documento: object) => documentos[documento["Data"]["solicitud_cdp"]] = documento);
          dataAll.forEach((cdp: object) => {
            cdp['expedido'] = true;
            cdp['fecha_expedicion'] = documentos[cdp['_id']]['FechaRegistro'];
            cdp['valor_actual'] = documentos[cdp['_id']]['ValorActual'];
            cdp['valor_inicial'] = documentos[cdp['_id']]['ValorInicial'];
            cdp['consecutivo'] = documentos[cdp['_id']]['Consecutivo'];
            cdp['estado'] = documentos[cdp['_id']]['Estado'];
          });
        })
        this.source.load(data);
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
