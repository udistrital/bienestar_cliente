import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CRPHelper } from '../../../../@core/helpers/crp/crpHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { Router } from '@angular/router';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { MovimientosHelper } from '../../../../@core/helpers/movimientos/movimientosHelper';
// import { PlanAdquisicionHelper } from '../../../../@core/helpers/plan_adquisicion/planAquisicionHelper';
import { PlanAdquisicionHelper } from '../../../../@core/helpers/plan_adquisicion/planAdquisicionHelper';
// import { PlanAdquisicionHelper } from '../../../../@core/helpers/plan_adquisicion/planAdquisicionHelper';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-ver-solicitud-crp',
  templateUrl: './ver-solicitud-crp.component.html',
  styleUrls: ['./ver-solicitud-crp.component.scss']
})
export class VerSolicitudCrpComponent implements OnInit {


  @Input('solicitudcrp') solicitud: any;
  @Input('expedido') expedido: boolean;
  @Output() eventChange = new EventEmitter();
  cdpInfo: any = {};
  solicitudc: any = {};
  solCdpInfo: any = {};
  TrNecesidad: any;
  beneficiario: any = {};
  tipoID: string;
  doc: string;
  objetoNecesidad: any = {};
  mostrandoPDF: boolean = false;
  formRubros = false;
  // movimiento: any = null;
  enlacePDF: string = 'assets/images/crp-ejemplo.pdf';
  tituloPDF: string = '';
  areas = [{ Id: 1, Nombre: 'Rector' }, { Id: 2, Nombre: 'Convenios' }];
  entidades = [{ Id: 1, Nombre: 'Universidad Distrital Francisco José de Caldas' }];
  area: any;
  entidad: any;
  tCompromiso: any;
  actividades: object[];
  r = /\d+/;
  habilitarExpedir = false;
  movimiento: any = null;

  constructor(
    private crpHelper: CRPHelper,
    private cdpHelper: CDPHelper,
    private planAdquisicionHelper: PlanAdquisicionHelper,
    // tslint:disable-next-line
    private rqManager: RequestManager,
    private popManager: PopUpManager,
    private router: Router,
    private movimientosHelper: MovimientosHelper,
  ) { }

  ngOnInit() {
    if (this.solicitud !== undefined) {

      this.crpHelper.getSolicitudCRP(this.solicitud['solicitudCrp']).subscribe(resp => {

        this.solicitudc = resp[0];

        if (this.solicitudc) {

          this.crpHelper.getInfoCDP(this.solicitudc['vigencia'], this.solicitudc['consecutivoCdp']).subscribe(resCdp1 => {
            if (resCdp1.estado === 'expedido') { // validacion de expedicion
              this.expedido = true;
            } else {
              this.expedido = false;
            }

          });

          this.crpHelper.getCompromiso(this.solicitudc['compromiso'].tipoCompromiso).subscribe(resC => {
            this.tCompromiso = resC;
          });

          this.doc = this.solicitudc['beneficiario'].match(this.r);
          this.tipoID = this.solicitudc['beneficiario'].match(/[a-zA-Z]+/g);
          this.crpHelper.getInfoNaturalJuridica(this.doc).subscribe(respuesta => {
            this.beneficiario = respuesta.NomProveedor;

          });

          this.crpHelper.getInfoCDP(this.solicitudc['vigencia'], this.solicitudc['consecutivoCdp']).subscribe(resCdp => {
            this.cdpInfo = resCdp;

            if (this.cdpInfo) {

              this.crpHelper.getInfoCdpPC(this.cdpInfo.Data.solicitud_cdp).subscribe(res => {
                this.solCdpInfo = res;
                this.area = this.areas.filter(i => {
                  return i.Id === this.solCdpInfo.centroGestor;
                });

                this.entidad = this.entidades.filter(j => {
                  return j.Id === this.solCdpInfo.entidad;
                });

                this.cdpHelper.getFullNecesidad(this.solCdpInfo.necesidad).subscribe(async res2 => {
                  this.TrNecesidad = res2;

                  if (this.TrNecesidad) {
                    this.objetoNecesidad = this.TrNecesidad.Necesidad.Objeto;
                    await this.getInfoMeta(this.TrNecesidad['Necesidad'].Vigencia, 122).toPromise().then(resMeta => { this.actividades = resMeta; });

                    if (this.TrNecesidad.Rubros) {
                      this.TrNecesidad.Rubros.forEach(rubro => {
                        rubro.MontoParcial = 0;

                        if (rubro.Metas) {
                          rubro.Metas.forEach(meta => {
                            meta['InfoMeta'] = this.actividades['metas'].actividades.filter(actividad => actividad['meta_id'] === meta['MetaId']);

                            if (meta.Actividades) {
                              meta.Actividades.forEach(act => {
                                act['InfoActividad'] = this.actividades['metas'].actividades.filter(actividad => actividad['actividad_id'] === act['ActividadId']);

                                if (act.FuentesActividad) {
                                  act.FuentesActividad.forEach(fuente => {
                                    rubro.MontoParcial += fuente.MontoParcial;
                                  });
                                }
                              });
                            }
                          });
                        }

                        if (rubro.Fuentes) {
                          rubro.Fuentes.forEach(fuente => {
                            rubro.MontoParcial += fuente.MontoParcial;
                          });

                        }

                      });
                    }


                  }
                  if (this.TrNecesidad.Rubros.length > 1) {
                    this.formRubros = true;
                  } else {
                    this.construirMovimiento();
                  }

                });
              });
            }
          });

        }
      });
    }
  }

  getInfoMeta(vigencia: Number, dependencia: Number): Observable<any> {
    return this.planAdquisicionHelper.getPlanAdquisicionByDependencia(vigencia.toString(), dependencia.toString());
  }

  cambioTab() {
    this.eventChange.emit(false);
  }

  onMovimientoBuiled(event: Event) {
    this.movimiento = event;
  }

  expedirCRP() {
    this.popManager.showAlert('warning', `Expedir CRP ${this.solicitudc.consecutivo}`, '¿Continuar?')
      .then((result) => {
        this.crpHelper.expedirCRP(this.solicitud._id).subscribe();
        if (result.value) {
          this.movimientosHelper.postMovimiento(this.movimiento).subscribe((res: any) => {
            this.popManager.showSuccessAlert(`Se expidió con exito el CRP ${res.DocInfo.Consecutivo}`);
            this.router.navigate(['/pages/plan-cuentas/crp']);
          });
        }
      });
  }

  private construirMovimiento() {
    this.movimiento = {
      Data: { 'solicitud_crp': this.solicitudc._id },
      Tipo: 'rp',
      Vigencia: 2019,
      CentroGestor: this.solicitud.centroGestor,
      AfectacionMovimiento: []
    };

    this.cdpInfo.AfectacionIds.forEach((cdp: any) => {
        this.movimiento.AfectacionMovimiento.push(
            {
                MovimientoProcesoExternoId: {
                    TipoMovimientoId: {
                        Id: 7,
                        Acronimo: 'rp'
                    }
                },
                DocumentoPadre: cdp,
                Valor: this.solicitudc.valor,
                Descripcion: 'Expedición CRP'
            },

        );
    });
  }

  mostrarPDF(consecutivo) {
    this.tituloPDF = `Certificado de Registro Presupuestal N° ${consecutivo}`;
    this.mostrandoPDF = !this.mostrandoPDF;
  }
}
