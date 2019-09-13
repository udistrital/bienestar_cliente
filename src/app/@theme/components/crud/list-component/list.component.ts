import { Component, OnInit, Input } from '@angular/core';
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

  @Input('loadFormDataFunction') loadFormData: (...params) => Observable<any>;
  @Input('updateEntityFunction') updateEntityFunction: (...params) => Observable<any>;
  @Input('createEntityFunction') createEntityFunction: (...params) => Observable<any>;

  uid: any;
  cambiotab: boolean = false;
  settings: any;
  regresarLabel: string;

  source: LocalDataSource = new LocalDataSource();
  constructor(
    private translate: TranslateService,
    private popUpManager: PopUpManager,
    // tslint:disable-next-line
    private rqManager: RequestManager,
  ) {
    // console.log('constructor');
  }

  ngOnInit() {
    this.regresarLabel = this.translate.instant('GLOBAL.regresar');
    this.loadData();
    this.cargarCampos();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
  }
  cargarCampos() {
    this.settings = {
      actions: {
        add: true,
        edit: false,
        delete: false,
        custom: [{ name: 'edit', title: '<i class="nb-edit"></i>' },{ name: 'delete', title: '<i class="nb-trash"></i>' },{ name: 'other', title: '<i class="nb-shuffle"></i>' }],
        position: 'left'
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
  useLanguage(language: string) {
    this.translate.use(language);
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
  onEdit(event): void {
    console.info(event);
    this.uid = event.data[this.uuidReadField];
    this.activetab();
  }
  
  onAddOther(event): void {
    console.info(event);
  }
  onCustom(event): void {
    switch (event.action) {
      case 'edit':
        console.info(event);
        this.onEdit(event)
        break;
      case 'delete':
        this.onDelete(event)
        break;
      case 'other':
        this.onAddOther(event)
        break;
      default:
        break;
    }
  }

  onCreate(event): void {
    this.uid = null;
    this.activetab();
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
        this.deleteDataFunction(event.data[this.uuidDeleteField]).subscribe(res => {
          if (res !== null) {
            this.loadData();
            this.popUpManager.showSuccessAlert(
              this.translate.instant(this.deleteConfirmMessage)
            );
          }
        });
      }
    });
  }

  activetab(): void {
    this.cambiotab = !this.cambiotab;
  }

  selectTab(event): void {
    if (event.tabTitle === this.translate.instant('GLOBAL.lista')) {
      this.cambiotab = false;
    } else {
      this.cambiotab = true;
    }
  }

  onChange(event) {
    if (event) {
      this.loadData();
      this.cambiotab = !this.cambiotab;
    }
  }
  itemselec(event): void {
    // console.log('afssaf');
  }


}
