import { Component, OnInit } from '@angular/core';
import { FORM_INFO_SOL_CRP } from './form_info_sol_crp';
import { SolicitudCrp } from '../../../@core/data/models/sol_crp';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from '../../../@core/managers/popUpManager';
import { FormManager } from '../../../@core/managers/formManager';
@Component({
  selector: 'ngx-solicitud-crp',
  templateUrl: './solicitud-crp.component.html',
  styleUrls: ['./solicitud-crp.component.scss']
})
export class SolicitudCrpComponent implements OnInit {
  info_solCrp: SolicitudCrp;
  clean = false;
  formInfoSolCrp: any;
  crpData: SolicitudCrp;

  constructor(
    private translate: TranslateService,
    private popManager: PopUpManager,
  ) { 
    this.formInfoSolCrp = FORM_INFO_SOL_CRP;
    this.construirForm();

    this.crpData = {
      ConsecutivoCDP: undefined,
      Vigencia: '',
      Beneficiario: '',
      Valor: undefined,
      NumeroCompromiso: undefined,
      TipoCompromiso: undefined,
      FechaCreacion: undefined
    };
  }

  ngOnInit() {
    this.info_solCrp = {} as SolicitudCrp;
  }

  construirForm() {
    this.formInfoSolCrp.btn = this.translate.instant('GLOBAL.guardar');
    for (let i = 0; i < this.formInfoSolCrp.campos.length; i++) {
      this.formInfoSolCrp.campos[i].label = this.formInfoSolCrp.campos[i].label_i18n;
      this.formInfoSolCrp.campos[i].placeholder = this.formInfoSolCrp.campos[i].label_i18n;
    }
  }

  cleanForm() {
    this.clean = !this.clean;
    this.info_solCrp = null;
    this.formInfoSolCrp.campos[FormManager.getIndexForm(this.formInfoSolCrp, 'Codigo')].prefix.value = '';

  }



  validarForm(event) {
    if (event.valid) {

    } else {
      this.popManager.showErrorAlert('Datos Incompletos!');
    }
  }
}
