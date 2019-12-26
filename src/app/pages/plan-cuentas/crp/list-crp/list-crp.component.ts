import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { TranslateService } from '@ngx-translate/core';
import { CRPHelper } from '../../../../@core/helpers/crp/crpHelper';
import { DocumentoPresupuestalHelper } from '../../../../@core/helpers/documentoPresupuestal/documentoPresupuestalHelper';
import { VigenciaHelper } from '../../../../@core/helpers/vigencia/vigenciaHelper';


@Component({
  selector: 'ngx-list-crp',
  templateUrl: './list-crp.component.html',
  styleUrls: ['./list-crp.component.scss']
})
export class ListCrpComponent implements OnInit {

  uuidReadFieldName: string;
  formTittle: string;
  isOnlyCrud: boolean;
  settings: object;
  listColumns: object;
  crp: object;

  cambiotab: boolean = false;
  areas = { '1': 'Rector', '2': 'Convenios' };
  centros = { '1': 'Universidad Distrital Francisco José de Caldas' };
  source: LocalDataSource = new LocalDataSource();

  vigencias: any[] = [];
  loadDataFunction: (...params) => Observable<any>;
  loadFormDataFunction: (...params) => Observable<any>;

  constructor(
    private translate: TranslateService,
    private cdpHelper: CDPHelper,
    private documentoPresupuestalHelper: DocumentoPresupuestalHelper,
    private vigenciaHelper: VigenciaHelper,
    // tslint:disable-next-line
    private crpHelper: CRPHelper,
    // tslint:disable-next-line
    private rqManager: RequestManager,
  ) {}

  ngOnInit() {
    const centrosCopy = this.centros;
    const areasCopy = this.areas;

    this.loadDataFunction = this.documentoPresupuestalHelper.GetAllDocumentoPresupuestalByTipo;
    this.vigenciaHelper.getFullVigencias().subscribe((res: any[]) => {
      this.vigencias = res.filter(element => element.areaFuncional === '1');
    });

    this.listColumns = {
      Vigencia: {
        title: this.translate.instant('GLOBAL.vigencia'),
        filter: false,
        valuePrepareFunction: value => {
          return value;
        }
      },
      CentroGestor: {
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
        valuePrepareFunction: value => {
          return this.areas[value];
        },
        filterFunction(cell?: any, search?: string): boolean {
          if (areasCopy[cell.toString()].includes(search) || search === '') {
            return true;
          } else {
            return false;
          }
        }
      },
      entidad: {
        title: this.translate.instant('GLOBAL.centro_gestor'),
        filter: true,
        valuePrepareFunction: () => this.centros['1'],
        filterFunction(cell?: any, search?: string): boolean {
          if (centrosCopy['1'].includes(search) || search === '') {
            return true;
          } else {
            return false;
          }
        }
      },
      Consecutivo: {
        title: this.translate.instant('CRP.n_crp'),
        filter: true,
        valuePrepareFunction: value => {
          return value;
        }
      },
      Estado: {
        title: this.translate.instant('CRP.estado'),
        filter: true,
        valuePrepareFunction: value => {
          return this.translate.instant('CRP.'+value);
        }
      },
    };

    this.settings = {
      actions: {
        add: false,
        edit: false,
        delete: false,
        columnTitle: 'Opciones',
        custom: [{ name: 'ver', title: '<i title="Ver" class="fas fa-eye" (click)="ver($event)"></i>' }],
        position: 'right'
      },
      mode: 'external',
      columns: this.listColumns,
    };

    this.loadData();
  }

  onSelect(vigencia: string) {
    this.loadData(vigencia);
  }

  loadData(vigencia?: string): void {
    forkJoin(
      {
        documentos: this.loadDataFunction(vigencia ? vigencia : this.vigencias[0].valor, '1', 'rp'),
        crp: this.crpHelper.getSolicitudesCRP('', 'vigencia:!$' + (vigencia ? vigencia : this.vigencias[0].valor))
      }
    ).subscribe(res => {
      res.documentos.forEach(documento => {
        console.info(documento.Data.solicitud_crp);
        documento.solicitudCrp = res.crp.filter(crp => crp._id === documento.Data.solicitud_crp)[0].consecutivo;
      });
      const data = <Array<any>>res.documentos;
      this.source.load(data);
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
