import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { TranslateService } from '@ngx-translate/core';
import { CRPHelper } from '../../../../@core/helpers/crp/crpHelper';


@Component({
  selector: 'ngx-list-crp',
  templateUrl: './list-crp.component.html',
  styleUrls: ['./list-crp.component.scss']
})
export class ListCrpComponent implements OnInit {

  uuidReadFieldName: string;
  loadDataFunction: (...params) => Observable<any>;
  formTittle: string;
  loadFormDataFunction: (...params) => Observable<any>;
  isOnlyCrud: boolean;
  settings: object;
  cambiotab: boolean = false;
  listColumns: object;
  crp: object;
  estados = [{Id : 1, Estado : 'Saldo Parcialmente Comprometido'} , {Id : 2, Estado : 'Saldo Parcialmente Ejecutado'}];

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private translate: TranslateService,
    private cdpHelper: CDPHelper,
    // tslint:disable-next-line
    private crpHelper: CRPHelper,
    // tslint:disable-next-line
    private rqManager: RequestManager,
  ) { }

  ngOnInit() {
    this.loadDataFunction = this.crpHelper.getListaCRP;

    this.listColumns = {
      vigencia: {
        title: this.translate.instant('GLOBAL.vigencia'),
        filter: true,
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      centroGestor: {
        title: this.translate.instant('GLOBAL.area_funcional'),
        filter: true,
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      entidad: {
        title: this.translate.instant('GLOBAL.centro_gestor'),
        filter: true,
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      consecutivo_crp: {
        title: this.translate.instant('CRP.n_crp'),
        filter: true,
        // type: 'string;',
        valuePrepareFunction: value => {
          return value;
        }
      },
      estado_crp: {
        title: this.translate.instant('CRP.estado'),
        filter: true,
        // type: 'string;',
        valuePrepareFunction: value => {
          value = this.estados.filter(element => {
            return element.Id === value;
          });
          value = value.Estado;
          return value;
        }
      },
    };

    this.settings = {
      actions: {
        add: false,
        edit: false,
        delete: false,
        columnTitle: 'Opciones',
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
        this.verCRP(event.data);
    }
  }
  verCRP(crp) {
    this.crp = crp;
    this.onCambiotab();
  }

  onCambiotab(): void {
    this.cambiotab = !this.cambiotab ;
  }

}
