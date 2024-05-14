import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { Observable } from 'rxjs';
import { RequestManager } from '../../../../@core/managers/requestManager';
@Component({
  selector: 'ngx-list-entity',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListEntityComponent implements OnInit, OnChanges {
  // Local Inputs ...
  @Input('uuidReadFieldName') uuidReadField: string;
  @Input('paramsFieldsName') paramsFieldsName: object;
  @Input('uuidDeleteFieldName') uuidDeleteField: string;
  @Input('listColumns') listColumns: object;

  @Input('deleteConfirmMessage') deleteConfirmMessage: string;
  @Input('deleteMessage') deleteMessage: string;

  @Input('loadDataFunction') loadDataFunction: (...params) => Observable<any>;
  @Input('deleteDataFunction') deleteDataFunction: (...params) => Observable<any>;
  // Crud Inputs.
  @Input('formEntity') formEntity: any;
  @Input('formTittle') formTittle: string;
  @Input('updateMessage') updateMessage: string;
  @Input('createMessage') createMessage: string;
  @Input('updateConfirmMessage') updateConfirmMessage: string;
  @Input('createConfirmMessage') createConfirmMessage: string;
  @Input('isOnlyCrud') isOnlyCrud: boolean;
  @Input('listSettings') listSettings: any;
  @Input('externalCreate') externalCreate: boolean;
  @Input('viewItemSelected') viewItemSelected: boolean;
  @Input('reloadTable') reloadTable: boolean;
  @Input('loadFormDataFunction') loadFormData: (...params) => Observable<any>;
  @Input('updateEntityFunction') updateEntityFunction: (...params) => Observable<any>;
  @Input('createEntityFunction') createEntityFunction: (...params) => Observable<any>;
  @Output() reloadTableChange = new EventEmitter<boolean>();
  @Output() auxcambiotab = new EventEmitter<boolean>();
  @Output() crudcambiotab = new EventEmitter<boolean>();
  @Output() externalTabActivator = new EventEmitter<string>();
  @Output() infooutput = new EventEmitter<any>();
  @Output() totalElementosChange = new EventEmitter<any>();
  externalTabActive: boolean = true;

  uid: any;
  settings: any;
  regresarLabel: string;

  source: LocalDataSource = new LocalDataSource();
  cambiotab: boolean;
  totalElementos: number = 0;
  constructor(
    private translate: TranslateService,
    private popUpManager: PopUpManager,
    // tslint:disable-next-line
    private rqManager: RequestManager,
  ) {
    this.cambiotab = false;
    this.crudcambiotab.emit(false);
    this.auxcambiotab.emit(false);
    // console.log('constructor');
  }

  ngOnInit() {
    this.regresarLabel = this.translate.instant('GLOBAL.regresar');
    this.loadData();
    this.cargarCampos();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
    this.filtrarLista();
  }
  ngOnChanges(changes) {
    if (changes['paramsFieldsName'] && changes['paramsFieldsName'].currentValue) {
      this.paramsFieldsName = changes['paramsFieldsName'].currentValue;
      this.loadData();
    }
    if (changes.reloadTable && changes.reloadTable.currentValue){
      this.loadData();
      setTimeout(()=>{
        this.reloadTable = false;
        this.reloadTableChange.emit(this.reloadTable);
      },100);
    }

  }
  filtrarLista() {
    this.source.onChanged().subscribe((change) => {

      if (change.action === 'filter') {
        /*        console.info(change);
               console.info(change.filter.filters); */
        change.filter.filters.map((item) => {
          if (item.field === 'Vigencia' &&
            (item.search.length === 4 || item.search === '0')) {
            this.paramsFieldsName = { Vigencia: item.search, UnidadEjecutora: 1 };
            this.loadData();
          }
        });

        // Do whatever you want with the filter event

      }
    });

  }
  cargarCampos() {
    if (this.listSettings !== undefined) {
      this.settings = this.listSettings;
    } else {
      this.settings = {
        actions: {
          add: true,
          edit: false,
          delete: false,
          custom: [{ name: 'edit', title: '<i class="nb-edit"></i>' }, { name: 'delete', title: '<i class="nb-trash"></i>' }],
          position: 'right'
        },
        add: {
          addButtonContent: '<i class="nb-plus"></i>',
          createButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>'
        },
        mode: 'external',
        columns: this.listColumns,
      };
    }

  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadData(params?: any): void {

    this.loadDataFunction('', this.paramsFieldsName ? this.paramsFieldsName : '', params).subscribe(res => {
      if (res !== null) {
        const data = <Array<any>>res;
        this.totalElementos = data.length;
        if(this.totalElementos === 1 && Object.keys(data[0]).length === 0){
          this.totalElementos = 0;
        }
        this.totalElementosChange.emit(this.totalElementos);
        this.source.load(data);
      } else {
        this.source.load([]);
      }
    });
  }
  IsFuente(event) {
    if (event.data.ValorInicial !== undefined) {
      this.formEntity.campos[this.getIndexForm('Codigo')].deshabilitar = true;
      this.paramsFieldsName['Vigencia'] = event.data.Vigencia;
      if (event.data.Vigencia === 'sin vigencia asignada') {
        this.paramsFieldsName['Vigencia'] = '0';
      }
    }
  }
  onEdit(event): void {
    console.info(event);
    this.uid = event.data[this.uuidReadField];
    this.IsFuente(event);
    this.activetab('crud');
  }

  emitItemSelected(event) {
    this.infooutput.emit(event.data);
  }

  onAddOther(event): void {
    console.info(event);
    this.infooutput.emit(event.data);
    this.activetab(event.action);
  }
  onCustom(event): void {
    switch (true) {
      case event.action === 'edit':
        this.onEdit(event);
        break;
      case event.action === 'delete':
        this.onDelete(event);
        break;
      case event.action === 'other':
        this.onAddOther(event);
        break;
      case event.action && event.action.endsWith('Custom'):
        this.executeCustomAction(event);
        break;
      default:
        this.onAddOther(event);
        break;
    }
  }

  executeCustomAction(event: any) {
    if(this.listSettings){
      for(const action of this.listSettings.actions.custom){
        if(action.name===event.action){
          action.customFunction(event.data);
        }
      }
    }
  }

  onCreate(event): void {
    if (!this.externalCreate) {
      this.formEntity.campos[this.getIndexForm('Codigo')].deshabilitar = false;
      this.uid = null;
      this.activetab('crud');
    } else {
      this.activetab('external-create');
    }
  }

  onDelete(event): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.eliminar'),
      text: this.translate.instant(this.deleteMessage),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true
    };
    Swal.fire(opt).then(willDelete => {
      if (willDelete.value) {
        this.deleteDataFunction(event.data[this.uuidDeleteField], this.paramsFieldsName ? this.paramsFieldsName : '').subscribe(res => {
          if (res['Type'] === 'error') {
            if (res['Message']) {
              this.popUpManager.showErrorAlert(res['Message']);
            } else {
              this.popUpManager.showErrorAlert(res['Body']);
            }
          } else {
            this.loadData();
            this.popUpManager.showSuccessAlert(
              this.translate.instant(this.deleteConfirmMessage)
            );
          }
        });
      }
    });
  }

  activetab(tab): void {
    if (tab === 'crud') {
      this.cambiotab = !this.cambiotab;
      this.crudcambiotab.emit(this.cambiotab);
    } else if (tab === 'other') {
      this.auxcambiotab.emit(true);
      this.externalTabActivator.emit(tab);
    } else {
      this.externalTabActive = true;
      this.externalTabActivator.emit(tab);
    }
  }



  selectTab(event): void {
    if (event.tabTitle === this.translate.instant('GLOBAL.lista')) {
      this.crudcambiotab.emit(false);
      this.cambiotab = false;
    } else {
      this.cambiotab = true;
      this.crudcambiotab.emit(true);
    }
  }

  onChange(event) {
    if (event) {
      this.loadData();
      this.cambiotab = !this.cambiotab;
      this.crudcambiotab.emit(this.cambiotab);
    }
  }
  itemselec(event): void {
    // console.info(event);
  }
  getIndexForm(nombre: String): number {
    for (let index = 0; index < this.formEntity.campos.length; index++) {
      const element = this.formEntity.campos[index];
      if (element.nombre === nombre) {
        return index;
      }
    }
    return 0;
  }

}
