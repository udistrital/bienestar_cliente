import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
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
export class ListEntityComponent implements OnInit {
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
  @Input('listSettings') listSettings: object;
  @Input('externalCreate') externalCreate: boolean;
  @Input('viewItemSelected') viewItemSelected: boolean;
  @Input('loadFormDataFunction') loadFormData: (...params) => Observable<any>;
  @Input('updateEntityFunction') updateEntityFunction: (...params) => Observable<any>;
  @Input('createEntityFunction') createEntityFunction: (...params) => Observable<any>;
  @Output() auxcambiotab = new EventEmitter<boolean>();
  @Output() crudcambiotab = new EventEmitter<boolean>();
  @Output() externalTabActivator = new EventEmitter<string>();
  @Output() infooutput = new EventEmitter<any>();
  externalTabActive: boolean = true;

  uid: any;
  settings: any;
  regresarLabel: string;

  source: LocalDataSource = new LocalDataSource();
  cambiotab: boolean;
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

  }
  filtrarLista() {
    this.source.onChanged().subscribe((change) => {

      if (change.action === 'filter') {
        /*        console.info(change);
               console.info(change.filter.filters); */
        change.filter.filters.map((item) => {
          if (item.field == 'Vigencia' &&
            (item.search.length === 4 || item.search === '0')) {
            this.paramsFieldsName = { Vigencia: item.search, UnidadEjecutora: 1 }
            this.loadData();
          }
        })

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

  loadData(): void {

    this.loadDataFunction('', this.paramsFieldsName ? this.paramsFieldsName : '').subscribe(res => {
      if (res !== null) {
        const data = <Array<any>>res;
        this.source.load(data);
      } else {
        this.source.load([]);
      }
    });
  }
  IsFuente(event) {
    if (event.data.ValorInicial !== undefined) {
      this.formEntity.campos[this.getIndexForm('Codigo')].deshabilitar = true;
      this.paramsFieldsName["Vigencia"] = event.data.Vigencia;
      if(event.data.Vigencia == "sin vigencia asignada"){
        this.paramsFieldsName["Vigencia"] = "0";
      }
    }
  }
  onEdit(event): void {
    console.info(event);
    this.uid = event.data[this.uuidReadField];
    this.IsFuente(event)
    this.activetab('crud');
  }

  emitItemSelected(event){
    this.infooutput.emit(event.data);
  }

  onAddOther(event): void {
    console.info(event);
    this.infooutput.emit(event.data);
    this.activetab(event.action);
  }
  onCustom(event): void {
    switch (event.action) {
      case 'edit':
        console.info(event);
        this.onEdit(event);
        break;
      case 'delete':
        this.onDelete(event);
        break;
      case 'other':
        this.onAddOther(event);
        break;
      default:
        this.onAddOther(event);
        break;
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
            if( res['Message']){
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
        return index
      }
    }
    return 0;
  }

}
