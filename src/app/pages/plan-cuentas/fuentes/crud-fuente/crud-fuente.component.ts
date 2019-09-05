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
    private popUpManager: PopUpManager,
  ) {
    this.formFuente = FORM_FUENTE;
    this.formFuente = FormManager.ConstruirForm(this.formFuente, this.translate, 'RUBRO.add-fuente');
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.formFuente = FormManager.ConstruirForm(this.formFuente, this.translate, 'RUBRO.add-fuente');
    });

   }

  ngOnInit() {
  }

  public loadFuente(): void {
    if (this.fuente_id) {
      this.fuenteHelper.getFuentes(this.fuente_id)
        .subscribe(res => {
          if (res !== null) {
            this.info_fuente = <FuenteFinanciamiento>res;
          }
        });
    } else {
      this.info_fuente = undefined;
      this.clean = !this.clean;
    }
  }


}
