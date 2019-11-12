import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { FormManager } from '../../../../@core/managers/formManager';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { Observable } from 'rxjs';
import { RequestManager } from '../../../../@core/managers/requestManager';

@Component({
  selector: 'ngx-crud-entity',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudEntityComponent implements OnInit {
  @Input('entitiId') entitiId: any;
  @Input('formEntity') formEntity: any;
  @Input('formTittle') formTittle: string;
  @Input('paramsFieldsName') paramsFieldsName: object;
  @Input('updateMessage') updateMessage: string;
  @Input('createMessage') createMessage: string;
  @Input('updateConfirmMessage') updateConfirmMessage: string;
  @Input('createConfirmMessage') createConfirmMessage: string;

  @Input('loadFormDataFunction') loadFormData: (...params) => Observable<any>;
  @Input('updateEntityFunction') updateEntityFunction: (...params) => Observable<any>;
  @Input('createEntityFunction') createEntityFunction: (...params) => Observable<any>;

  @Output() eventChange = new EventEmitter();

  entityInfo: any;
  clean: boolean;
  constructor(
    private translate: TranslateService,
    private popUpManager: PopUpManager,
    // tslint:disable-next-line
    private rqManager: RequestManager,
  ) {

  }
  ngOnChanges(changes) {
    if (changes['paramsFieldsName'] && changes['paramsFieldsName'].currentValue) {
      this.paramsFieldsName = changes['paramsFieldsName'].currentValue;
    }
  }
  ngOnInit() {
    this.formEntity = FormManager.ConstruirForm(
      this.formEntity,
      this.translate,
      this.formTittle,
    );
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.formEntity = FormManager.ConstruirForm(
        this.formEntity,
        this.translate,
        this.formTittle,
      );
    });
    this.loadData();

  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  public loadData(): void {
    if (this.entitiId) {
      this.loadFormData(this.entitiId, this.paramsFieldsName ? this.paramsFieldsName : '').subscribe(res => {
        if (res !== null) {
          this.entityInfo = res;
        }
      });
    } else {
      this.entityInfo = undefined;
      this.clean = !this.clean;
    }
  }

  updateEntity(entityData: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.actualizar'),
      text: this.translate.instant(this.updateMessage),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true
    };
    Swal.fire(opt).then(willDelete => {
      if (willDelete.value) {
        this.entityInfo = entityData;
        this.updateEntityFunction(this.entityInfo).subscribe(res => {
          if (res['Type'] === 'error') {
            this.popUpManager.showErrorAlert(res['Message']);
          } else {
            this.loadData();
            this.eventChange.emit(true);
            this.popUpManager.showSuccessAlert(
              this.translate.instant(
                this.updateConfirmMessage
              )
            );
          }
        });
      }
    });
  }

  createEntity(entity: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.crear'),
      text: this.translate.instant(this.createMessage),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true
    };
    Swal.fire(opt).then(willDelete => {
      if (willDelete.value) {
        this.entityInfo = entity;
        this.createEntityFunction(this.entityInfo).subscribe(res => {
          if (res['Type'] === 'error') {
            this.popUpManager.showErrorAlert(res['Message']);
          } else {
            this.entityInfo = res;
            this.eventChange.emit(true);
            this.popUpManager.showSuccessAlert(
              this.translate.instant(
                this.createConfirmMessage
              )
            );
          }
        });
      }
    });
  }

  validarForm(event) {
    if (event.valid) {
      if (this.entityInfo === undefined) {
        this.createEntity(event.data[this.formEntity['modelo']]);
      } else {
        this.updateEntity(event.data[this.formEntity['modelo']]);
      }
    }
  }
}
