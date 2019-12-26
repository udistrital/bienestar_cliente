import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { VigenciaHelper } from '../../../../@core/helpers/vigencia/vigenciaHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-listar-vigencia',
  templateUrl: './listar-vigencia.component.html',
  styleUrls: ['./listar-vigencia.component.scss']
})
export class ListarVigenciaComponent implements OnInit {

  loadDataFunction: (...params) => Observable<any>;
  loadFormDataFunction: (...params) => Observable<any>;
  uuidReadFileName: string;
  formTitle: string;
  isOnlyCrud: boolean;
  settings: object;
  listColumns: object;
  vigencia: object;
  cambiotab: boolean = false;
  anularTab; boolean = false;

  areaFuncional = { '1': 'Rector', '2': 'Convenios' };
  centrosGestor = { '1': 'Universidad Distrital Francisco José de Caldas' };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private translate: TranslateService,
    private vigenciaHelper: VigenciaHelper,
    private rqManager: RequestManager,
    private router: Router,

  ) { }

  ngOnInit() {

    this.loadDataFunction = this.vigenciaHelper.getFullVigencias;

    this.listColumns = {
      _id: {
        title: this.translate.instant('VIGENCIA.anio_vigencia'),
        filter: false,
        valuePrepareFunction: (value: any) => {
          return value;
        }
      },
      areaFuncional: {
        title: this.translate.instant('GLOBAL.area_funcional'),
        filter: {
          type: 'list',
          config: {
            selectText: 'Todas',
            list: [
              { value: '1', title: 'Rector' },
              { value: '2', title: 'Convenios' },
            ]
          },
        },
        valuePrepareFunction: (value: any) => {
          if (value === '1') {
            return 'Rector';
          } else {
            return 'Convenios';
          }
        }
      },
      estado: {
        title: this.translate.instant('VIGENCIA.estado_vigencia'),
        filter: true,
        valuePrepareFunction: (value: any) => {
          return value;
        }
      },
      fechaCreacion: {
        title: this.translate.instant('VIGENCIA.fecha_inicio'),
        filter: true,
        valuePrepareFunction: (value: any) => {
          return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
        }
      },
      fechaCierre: {
        title: this.translate.instant('VIGENCIA.fecha_cierre'),
        filter: true,
        valuePrepareFunction: (value: any) => { 
          return (new Date( value) > new Date(2000,1,1)) ?  new DatePipe('en-US').transform(value, 'dd/MM/yyyy') : '-';
        }
      },
    };

    this.settings = {
      actions: {
        add: false,
        edit: false,
        delete: false,
        columnTitle: "Ver",
        custom: [{ name: 'ver', title: '<i class="fas fa-eye" (click)="ver($event)"></i>' }],
        position: 'right'
      },
      mode: 'external',
      columns: this.listColumns,
    };

    this.loadData();
  }

  loadData(): void {
    vigencias: this.loadDataFunction(
    ).subscribe(res => {
      const data = <Array<any>>res;
      this.source.load(data);
    });
  }

  onCustom(event: any) {
    switch (event.action) {
      case 'ver':
        this.router.navigate([`/pages/plan-cuentas/cierre-vigencia/${event.data.valor}/${event.data.areaFuncional}`]);
        break;

    }

  }

}
