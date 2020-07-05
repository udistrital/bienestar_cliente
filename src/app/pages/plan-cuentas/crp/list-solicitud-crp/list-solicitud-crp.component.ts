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

  areas = { '1': 'Rector', '2': 'Convenios' };
  centros = {'1': 'Universidad Distrital Francisco José de Caldas' };

  constructor(private translate: TranslateService,
    private crpHelper: CRPHelper,
    private cdpHelper: CDPHelper,
    // tslint:disable-next-line
    private rqManager: RequestManager, ) { }

  ngOnInit() {
    this.crpHelper.getInfoContrato(458, 2017);
    this.loadDataFunction = this.crpHelper.getFullCRP;

    const areasCopy = this.areas;

    this.listColumns = {
      solicitudCrp: {
        title: this.translate.instant('CRP.n_sol_crp'),
        filter: true,
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      vigencia: {
        title: this.translate.instant('GLOBAL.placeholder_vigencia'),
        filter: true,
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      centroGestor: {
        title: this.translate.instant('GLOBAL.area_funcional'),
        filter: {
          type: 'list',
          config: {
            selectText: 'Todas',
            list: [
              { value: 'Rector', title: 'Rector' },
              { value: 'Convenios', title: 'Convenios' },
            ]
          },
        },
        valuePrepareFunction: value => this.areas[value],
        filterFunction(cell?: any, search?: string): boolean {
          if (areasCopy[cell.toString()].includes(search) || search === '') {
            return true;
          } else {
            return false;
          }
        }
      },
      entidad: {
        title: this.translate.instant('GLOBAL.entidad'),
        filter: true,
        valuePrepareFunction: () => {
          return 'Universidad Distrital Fransico José de Caldas';
        }
      },
      necesidadFinanciacion: {
        title: this.translate.instant('CRP.financiacion'),
        filter: {
          type: 'list',
          config: {
            selectText: 'Todas',
            list: [
              { value: 1, title: 'Inversión' },
              { value: 2, title: 'Funcionamiento' },
            ]
          },
        },
        valuePrepareFunction: value => {
          if ( value === 1) {
            return 'Inversión';
          } else {
            return 'Funcionamiento';
          }
        },
        filterFunction(cell?: any, search?: string): boolean {
          // tslint:disable-next-line
          if (cell == search) {
            return true;
          } else {
            return false;
          }
        }
      }
    };

    this.settings = {
      actions: {
        columnTitle: 'Opciones',
        add: false,
        edit: false,
        delete: false,
        custom:  [{ name: 'Ver', title: '<i title="Ver" class="fas fa-eye" (click)="ver($event)"></i>' }],
        position: 'right'
      },
      mode: 'external',
      columnTitle: 'Opciones',
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
    const a = this.crpHelper.getFullCRP();

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
