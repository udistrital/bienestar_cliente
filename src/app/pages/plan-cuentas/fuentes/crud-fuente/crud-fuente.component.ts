import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FuenteFinanciamiento } from '../../../../@core/data/models/fuente_financiamiento';
import { FORM_FUENTE } from './form-fuente';
import { ToasterConfig } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { FormManager } from '../../../../managers/formManager';
import { FuenteHelper } from '../../../../helpers/fuentes/fuenteHelper';
import { PopUpManager } from '../../../../managers/popUpManager';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-crud-fuente',
  templateUrl: './crud-fuente.component.html',
  styleUrls: ['./crud-fuente.component.scss']
})
export class CrudFuenteComponent implements OnInit {
  config: ToasterConfig;
  fuente_id: string;
  @Input('fuente_id')
  set name(fuente_id: string) {
    this.fuente_id = fuente_id;
    this.loadFuente();
  }
  @Output() eventChange = new EventEmitter();

  info_fuente: FuenteFinanciamiento;
  formFuente: any;
  regFuente: any;
  clean: boolean;
  constructor(
    private translate: TranslateService,
    private fuenteHelper: FuenteHelper,
    private popUpManager: PopUpManager
  ) {
    this.formFuente = FORM_FUENTE;
    this.formFuente = FormManager.ConstruirForm(
      this.formFuente,
      this.translate,
      'FUENTE_FINANCIAMIENTO.asignar_fuente'
    );
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.formFuente = FormManager.ConstruirForm(
        this.formFuente,
        this.translate,
        'FUENTE_FINANCIAMIENTO.asignar_fuente'
      );
    });
  }

  ngOnInit() {
    this.loadFuente();
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  public loadFuente(): void {
    if (this.fuente_id) {
      this.fuenteHelper.getFuentes(this.fuente_id).subscribe(res => {
        if (res !== null) {
          this.info_fuente = <FuenteFinanciamiento>res;
        }
      });
    } else {
      this.info_fuente = undefined;
      this.clean = !this.clean;
    }
  }

  updateFuente(fuente: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.actualizar'),
      text: this.translate.instant('FUENTE_FINANCIAMIENTO.mensaje_actualizar'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true
    };
    Swal.fire(opt).then(willDelete => {
      if (willDelete.value) {
        this.info_fuente = <FuenteFinanciamiento>fuente;
        this.fuenteHelper.fuenteUpdate(this.info_fuente).subscribe(res => {
          this.loadFuente();
          this.eventChange.emit(true);
          this.popUpManager.showSuccessAlert(
            this.translate.instant(
              'FUENTE_FINANCIAMIENTO.confirmacion_actualizacion'
            )
          );
        });
      }
    });
  }

  createFuente(fuente: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.crear'),
      text: this.translate.instant('FUENTE_FINANCIAMIENTO.mensaje_registrar'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true
    };
    Swal.fire(opt).then(willDelete => {
      if (willDelete.value) {
        this.info_fuente = <FuenteFinanciamiento>fuente;
        this.info_fuente.Codigo = this.info_fuente.Codigo.toString();
        this.fuenteHelper.fuenteRegister(this.info_fuente).subscribe(res => {
          this.info_fuente = <FuenteFinanciamiento><unknown>res;
          this.eventChange.emit(true);
          this.popUpManager.showSuccessAlert(
            this.translate.instant(
              'FUENTE_FINANCIAMIENTO.confirmacion_creacion'
            )
          );
        });
      }
    });
  }

  validarForm(event) {
    if (event.valid) {
      if (this.info_fuente === undefined) {
        this.createFuente(event.data.FuenteFinanciamiento);
      } else {
        this.updateFuente(event.data.FuenteFinanciamiento);
      }
    }
  }
}
