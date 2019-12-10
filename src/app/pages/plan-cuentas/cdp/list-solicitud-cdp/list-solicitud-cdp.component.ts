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

  areas = { '1': 'Rector', '2': 'Convenios' };
  centros = {'1': 'Universidad Distrital Francisco José de Caldas' };

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
        filter: true,
        valuePrepareFunction: (value: any) => {
          return value;
        }
      },
      tipoFinanciacion: {
        title: this.translate.instant('CDP.tipo_financiacion'),
        filter: true,
        valuePrepareFunction: (value: object) => {
          return value ? value['TipoFinanciacionNecesidadId']['Nombre'] : '';
        }
      },
      centroGestor: {
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
          return this.areas[value];
        }
      },
      consecutivoNecesidad: {
        title: this.translate.instant('CDP.n_necesidad'),
        filter: true,
        valuePrepareFunction: (value: any) => {
          return value;
        }
      },
      consecutivo: {
        title: this.translate.instant('CDP.n_solicitud'),
        filter: true,
        valuePrepareFunction: (value: any) => {
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
        this.cdpHelper.getAllNecesidades('limit=-1&fields=Id,TipoFinanciacionNecesidadId,ConsecutivoNecesidad&query=EstadoNecesidadId.CodigoAbreviacionn:CS')
        .subscribe(resNecesidades => {
          const necesidades: object = {};
          if (resNecesidades) {
            resNecesidades.forEach((necesidad: object) => necesidades[necesidad['Id']] = necesidad);
            res.forEach((obj: object) => {
              if (necesidades[obj['necesidad']]) {
                obj['consecutivoNecesidad'] = necesidades[obj['necesidad']]['ConsecutivoNecesidad'];
                obj['tipoFinanciacion'] = necesidades[obj['necesidad']];
              }
            });
            this.source.load(data);
          }
        });
      } else {
        this.source.load([]);
      }
    });
  }

  verSolicitud(scdp: object) {
    this.solicitudcdp = scdp;
    console.info(scdp);
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
