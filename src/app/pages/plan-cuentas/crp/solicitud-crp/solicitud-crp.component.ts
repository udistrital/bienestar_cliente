import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FORM_INFO_SOL_CRP } from './form_info_sol_crp';
import { SolicitudCrp } from '../../../../@core/data/models/sol_crp';
import { RubroHelper } from '../../../../@core/helpers/rubros/rubroHelper';
import { AdmAmazonHelper } from '../../../../@core/helpers/administrativa/admAmazonHelper';
import { DocumentoPresupuestalHelper } from '../../../../@core/helpers/documentoPresupuestal/documentoPresupuestalHelper';
import { MovimientosHelper } from '../../../../@core/helpers/movimientos/movimientosHelper';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { CRPHelper } from '../../../../@core/helpers/crp/crpHelper';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'ngx-solicitud-crp',
  templateUrl: './solicitud-crp.component.html',
  styleUrls: ['./solicitud-crp.component.scss']
})
export class SolicitudCrpComponent implements OnInit {
  info_solCrp: SolicitudCrp;
  formInfoSolCrp: any;
  rubrosCdp: any;
  solCrpData: SolicitudCrp;
  docPresupuestalCdp: any;
  tipoDocData: Array<any>;
  tipoCompromisosData: Array<any>;
  valorCrp: number; 

  numeroCdp: number = null;
  numDocBeneficiario =  '';
  nomBeneficiario = '';
  validated = false;
  clean = false;
  vigencias = [{ Id: 1, valor: '2017' }, { Id: 2, valor: '2018' },{ Id: 3, valor: '2019' }, { Id: 4, valor: '2020' }];
  montos = [{ Id: 1, valor: 'Monto Parcial' }, { Id: 2, valor: 'Monto Total' }];

  formGroup = new FormGroup({
    tipoCompromiso: new FormControl(null, Validators.required),
    vigencia: new FormControl(null, Validators.required),
    numCompromiso: new FormControl(null, Validators.required),
    fechaIniVigencia: new FormControl({value: new Date(), disabled: true}, Validators.required),
    fechaFinVigencia: new FormControl({value: new Date(), disabled: true}, Validators.required),
    tipoMonto: new FormControl({value: null, disabled: true}, Validators.required),
    valorCrp: new FormControl({value: 0, disabled: true}, [Validators.required, Validators.min(1)])
  });

  constructor(
    private translate: TranslateService,
    private crpHelper: CRPHelper,
    private cdpHelper: CDPHelper,
    private rubroHelper: RubroHelper,
    private popManager: PopUpManager,
    private admAmazonHelper: AdmAmazonHelper,
    private router: Router,
    private docPresupuestalHelper: DocumentoPresupuestalHelper,
    private movimientosHelper: MovimientosHelper
  ) {
    this.formInfoSolCrp = FORM_INFO_SOL_CRP;
  }

  ngOnInit() {
    this.info_solCrp = {} as SolicitudCrp;
    this.loadOptionsCompromisos();
  }

  onChangeMonto() {
    if (this.formGroup.value.tipoMonto === 2) {
      this.formGroup.controls['valorCrp'].disable();
      this.formGroup.controls['valorCrp'].setValue(this.docPresupuestalCdp.ValorActual);
    } else {
      this.formGroup.controls['valorCrp'].enable();
      this.formGroup.controls['valorCrp'].setValue(0);
    }   
  }

  guardar() {
    if (this.formGroup.value.valorCrp === 0) {

    }
    if (this.formGroup.value.valorCrp > this.docPresupuestalCdp.ValorActual) {
      this.popManager.showErrorAlert('El valor del CRP no debe ser mayor al saldo del CDP');
    } else {
      this.solCrpData = {
        ConsecutivoCDP: this.numeroCdp,
        Vigencia: this.formGroup.value.vigencia,
        Beneficiario: this.numDocBeneficiario,
        Valor: this.formGroup.value.valorCrp,
        Compromiso: {
          NumeroCompromiso: this.formGroup.value.numCompromiso,
          TipoCompromiso: this.formGroup.value.tipoCompromiso,
        },
        FechaCreacion: new Date(),
        FechaInicialVigencia: this.formGroup.value.fechaIniVigencia,
        FechaFinalVigencia: this.formGroup.value.fechaFinVigencia
      };

      this.crpHelper.solCrpRegister(this.solCrpData).subscribe((res) => {
        if (res) {
          this.popManager.showSuccessAlert(this.translate.instant('CRP.Solicitud_efectuada'), 'La solicitud N° ' + res.consecutivo + ' ha sido registrada')
            .then((result) => {
              if (result.value) {
                this.router.navigate(['/pages/plan-cuentas/solicitudcrp']);
              }
            });
        }
      });
    }
  }

  buscarCompromiso() {
    this.crpHelper.getContratoSuscrito(this.formGroup.value.numCompromiso, this.formGroup.value.vigencia).pipe(
      switchMap(resCS => this.crpHelper.getContratoDisponibilidad(resCS[0].NumeroContrato.Id))
      ).pipe(
        switchMap(resCD => {
          this.numeroCdp = resCD[0].NumeroCdp;
          return this.crpHelper.getContratoGeneral(resCD[0].NumeroContrato, resCD[0].Vigencia);
        }),
      ).pipe(
        switchMap(resCG => this.crpHelper.getContratista(resCG[0].Contratista))
      ).subscribe(resIP => {
        if (resIP) {
          this.numDocBeneficiario = resIP.NumDocumento;
          this.nomBeneficiario = resIP.NomProveedor;
        }
        const vigencia = this.formGroup.value.vigencia;
        const query = 'consecutivo:' + this.numeroCdp + ',tipo:cdp';
        this.docPresupuestalHelper.get(vigencia, '1', query).pipe(
          switchMap(res =>  {
            this.docPresupuestalCdp = res[0];
            return this.movimientosHelper.getByDocumentoPresupuestal(vigencia, '1', res[0]['_id']);
          })
        ).subscribe((res: Array<any>) => {
          res.forEach(element => {
            this.rubroHelper.getRubro(element.Padre).subscribe(res => {
              element.InfoRubro = res[0];
            });
          });
          console.info(res);
          this.rubrosCdp = res;
          
          this.formGroup.controls['tipoMonto'].enable();
          this.formGroup.controls['fechaIniVigencia'].enable();
          this.formGroup.controls['fechaFinVigencia'].enable();
        });
      });
  }

  loadOptionsCompromisos(): void {
    this.crpHelper.getCompromisos().subscribe(res => {
      if (res != null) {
        this.tipoCompromisosData = res;
      }
    });
  }
}
