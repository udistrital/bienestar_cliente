import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  ToasterConfig
} from 'angular2-toaster';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { FuenteHelper } from '../../../../helpers/fuentes/fuenteHelper';
import { PopUpManager } from '../../../../managers/popUpManager';
@Component({
  selector: 'ngx-list-fuente',
  templateUrl: './list-fuente.component.html',
  styleUrls: ['./list-fuente.component.scss']
})
export class ListFuenteComponent implements OnInit {
  uid: string;
  cambiotab: boolean = false;
  config: ToasterConfig;
  settings: any;

  source: LocalDataSource = new LocalDataSource();
  constructor(
    private translate: TranslateService,
    private fuenteHelper: FuenteHelper,
    private popUpManager: PopUpManager
  ) {
    // console.log('constructor');
    this.loadData();
    this.cargarCampos();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
  }

  ngOnInit() { }
  cargarCampos() {
    this.settings = {
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>'
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>'
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true
      },
      mode: 'external',
      columns: {
        Nombre: {
          title: this.translate.instant('GLOBAL.nombre'),
          // type: 'string;',
          valuePrepareFunction: value => {
            return value;
          }
        },
        Descripcion: {
          title: this.translate.instant('GLOBAL.descripcion'),
          // type: 'string;',
          valuePrepareFunction: value => {
            return value;
          }
        }
      }
    };
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadData(): void {
    this.fuenteHelper.getFuentes('').subscribe(res => {
      if (res !== null) {
        const data = <Array<any>>res;
        this.source.load(data);
      } else {
        this.source.load([]);
      }
    });
  }
  onEdit(event): void {
    // console.info(event);
    this.uid = event.data['Codigo'];
    this.activetab();
  }

  onCreate(event): void {
    this.uid = null;
    this.activetab();
  }

  onDelete(event): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.eliminar'),
      text: this.translate.instant('FUENTE_FINANCIAMIENTO.mensaje_eliminar'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true
    };
    Swal.fire(opt).then(willDelete => {
      if (willDelete.value) {
        this.fuenteHelper.fuenteDelete(event.data['_id']).subscribe(res => {
          if (res !== null) {
            this.loadData();
            this.popUpManager.showSuccessAlert(
              this.translate.instant('FUENTE.confirmacion_actualizacion')
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
