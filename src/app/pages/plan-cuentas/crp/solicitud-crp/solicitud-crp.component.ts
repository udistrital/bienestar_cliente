import { Component, OnInit } from '@angular/core';
import { FORM_INFO_SOL_CRP } from './form_info_sol_crp';
import { SolicitudCrp } from '../../../../@core/data/models/sol_crp';
import { FormManager } from '../../../../@core/managers/formManager';
import { AdmAmazonHelper } from '../../../../@core/helpers/administrativa/admAmazonHelper';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { CRPHelper } from '../../../../@core/helpers/crp/crpHelper';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-solicitud-crp',
  templateUrl: './solicitud-crp.component.html',
  styleUrls: ['./solicitud-crp.component.scss']
})
export class SolicitudCrpComponent implements OnInit {
  info_solCrp: SolicitudCrp;
  clean = false;
  formInfoSolCrp: any;
  solCrpData: SolicitudCrp;

  constructor(
    private translate: TranslateService,
    private crpHelper: CRPHelper,
    private cdpHelper: CDPHelper,
    private popManager: PopUpManager,
    private admAmazonHelper: AdmAmazonHelper,
    private router: Router,
  ) {
    this.formInfoSolCrp = FORM_INFO_SOL_CRP;
    this.construirForm();

    this.solCrpData = {
      ConsecutivoCDP: undefined,
      Vigencia: '',
      Beneficiario: '',
      Valor: undefined,
      Compromiso: {
        NumeroCompromiso: undefined,
        TipoCompromiso: undefined,
      },
      FechaCreacion: undefined,
      FechaFinalVigencia: undefined
    };
  }

  ngOnInit() {
    this.info_solCrp = {} as SolicitudCrp;
    this.loadOptionsTipoDocumento();
    this.loadOptionsCompromisos();

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
    // tslint:disable-next-line
    const today = new Date();
    if (event.valid) {
      this.solCrpData.ConsecutivoCDP = typeof event.data.SolicitudCRP.NumeroCDP === 'undefined' ? undefined : event.data.SolicitudCRP.NumeroCDP;
      this.solCrpData.Vigencia = typeof event.data.SolicitudCRP.Vigencia.valor === 'undefined' ? undefined : event.data.SolicitudCRP.Vigencia.valor;
      this.solCrpData.Beneficiario = typeof event.data.SolicitudCRP.NumeroDocumento === 'undefined' ? undefined : event.data.SolicitudCRP.NumeroDocumento;
      this.solCrpData.Compromiso.TipoCompromiso = typeof event.data.SolicitudCRP.TipoCompromiso.Id === 'undefined' ? undefined : event.data.SolicitudCRP.TipoCompromiso.Id;
      this.solCrpData.Compromiso.NumeroCompromiso = typeof event.data.SolicitudCRP.NumeroCompromiso === 'undefined' ? undefined : event.data.SolicitudCRP.NumeroCompromiso;
      this.solCrpData.FechaCreacion = new Date();
      this.solCrpData.FechaFinalVigencia = typeof event.data.SolicitudCRP.FechaFinalVigencia === 'undefined' ? undefined : event.data.SolicitudCRP.FechaFinalVigencia;

      if (event.data.SolicitudCRP.MontoCRP.Id === 1) {
        this.solCrpData.Valor = typeof event.data.SolicitudCRP.ValorParcial === 'undefined' ? undefined : event.data.SolicitudCRP.ValorParcial;
      } else {
        this.solCrpData.Valor = 0;
      }


      this.crpHelper.solCrpRegister(this.solCrpData).subscribe((res) => {
        if (res) {
          this.popManager.showAlert('success', 'Solicitud de CDP Registrada', 'La solicitud N° ' + res.consecutivo + ' ha sido registrada')
            .then((result) => {
              if (result.value) {
                this.router.navigate(['/pages/plan-cuentas/solicitudcrp']);
              }
            });

        }
      });
    } else {
      this.popManager.showErrorAlert('Datos Incompletos!');
    }
  }


  loadCDPInfo(): void {
    let cdpsConsecutivos: Array<any> = [];
    this.cdpHelper.getListaCDP('').subscribe(res => {
      if (res != null) {
        cdpsConsecutivos = res;
      }
      this.formInfoSolCrp.campos[this.getIndexForm('NumeroCDP')].opciones = cdpsConsecutivos;
    });
  }

  button(event: any) {
    this.crpHelper.getContratoSuscrito(event.data.NumeroCompromiso, event.data.Vigencia.valor).subscribe(resCS => {
      if (resCS[0]) {
        this.crpHelper.getContratoDisponibilidad(resCS[0].NumeroContrato.Id).subscribe(resCD => {// se obtiene la información del CDP de ese contrato
          if (resCD[0]) {
            this.formInfoSolCrp.campos[this.getIndexForm('NumeroCDP')].valor = resCD[0].NumeroCdp;
            this.crpHelper.getContratoGeneral(resCD[0].NumeroContrato, resCD[0].Vigencia).subscribe(resCG => {
              if (resCG) {
                this.crpHelper.getContratista(resCG[0].Contratista).subscribe(resIP => {
                  if (resIP) {
                    this.formInfoSolCrp.campos[this.getIndexForm('NombreBeneficiario')].valor = resIP.NomProveedor;
                    this.formInfoSolCrp.campos[this.getIndexForm('NumeroDocumento')].valor = resIP.NumDocumento;
                  }
                });
              }
            });
          }
        });
      } else {

      }
    });
  }

  loadOptionsTipoDocumento(): void {
    let tipoDocData: Array<any> = [];
    this.admAmazonHelper.getAllTipoDocumento().subscribe(res => {
      if (res !== null) { tipoDocData = res; }
      this.formInfoSolCrp.campos[this.getIndexForm('TipoDocumento')].opciones = tipoDocData;
    });
  }

  loadOptionsCompromisos(): void {
    let tipoCompromisosData: Array<any> = [];
    this.crpHelper.getCompromisos().subscribe(res => {
      if (res != null) {
        tipoCompromisosData = res;
      }
      this.formInfoSolCrp.campos[this.getIndexForm('TipoCompromiso')].opciones = tipoCompromisosData;
    });
  }

  getIndexForm(nombre: String): number {
    for (let index = 0; index < this.formInfoSolCrp.campos.length; index++) {
      const element = this.formInfoSolCrp.campos[index];
      if (element.nombre === nombre) {
        return index;
      }
    }
    return 0;
  }
}
