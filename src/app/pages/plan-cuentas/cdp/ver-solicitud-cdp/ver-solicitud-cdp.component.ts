import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { PlanAdquisicionHelper } from '../../../../@core/helpers/plan_adquisicion/planAquisicionHelper';
import { CoreHelper } from '../../../../@core/helpers/core/coreHelper';
import { DependenciaHelper } from '../../../../@core/helpers/oikos/dependenciaHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-ver-solicitud-cdp',
  templateUrl: './ver-solicitud-cdp.component.html',
  styleUrls: ['./ver-solicitud-cdp.component.scss']
})
export class VerSolicitudCdpComponent implements OnInit {

  @Input('solicitudcdp') solicitud: object;
  @Input('expedido') expedido: boolean;
  @Output() eventChange = new EventEmitter();
  necesidad: any = {};
  TrNecesidad: any;
  mostrandoPDF: boolean = false;
  enlacePDF: string = 'assets/images/cdp_ejemplo.pdf';
  tituloPDF: string = '';

  areas = [{ Id: 1, Nombre: 'Rector' }, { Id: 2, Nombre: 'Convenios' }];
  entidades = [{ Id: 1, Nombre: 'Universidad Distrital Francisco José de Caldas' }];

  areaFuncional: object;
  centroGestor: object;

  actividades: object[];
  dependenciaSoliciante: object;

  constructor(
    private cdpHelper: CDPHelper,
    private planAdquisicionHelper: PlanAdquisicionHelper,
    private coreHelper: CoreHelper,
    private dependenciaHelper: DependenciaHelper,
    // tslint:disable-next-line
    private rqManager: RequestManager,
    private popManager: PopUpManager,
    private router: Router,
  ) {
  }

  ngOnInit() {

    this.cdpHelper.getFullNecesidad(this.solicitud['necesidad']).subscribe(async res => {
      this.TrNecesidad = res;

      let jefe_dependencia: object;
      await this.getInfoJefeDepdencia(this.TrNecesidad["Necesidad"]["DependenciaNecesidadId"]["JefeDepSolicitanteId"]).toPromise().then(res => { jefe_dependencia = res });
      await this.getInfoDependencia(jefe_dependencia["DependenciaId"]).toPromise().then(res => { this.dependenciaSoliciante = res });
      await this.getInfoMeta(this.TrNecesidad["Necesidad"]["Vigencia"], this.dependenciaSoliciante["Id"]).toPromise().then(res => { this.actividades = res });
      

      this.areaFuncional = this.areas[this.TrNecesidad["Necesidad"]["AreaFuncional"]];
      this.centroGestor = this.entidades[this.solicitud["centroGestor"]];

      if (this.TrNecesidad.Rubros) {
        this.TrNecesidad.Rubros.forEach(rubro => {
          rubro.MontoParcial = 0
          if (rubro.Metas) {
            rubro.Metas.forEach(meta => {
              meta["InfoMeta"] = this.actividades["metas"]["actividades"].filter(actividad => actividad["meta_id"] === meta["MetaId"]);
              if (meta.Actividades) {
                meta.Actividades.forEach(act => {
                  act["InfoActividad"] = this.actividades["metas"]["actividades"].filter(actividad => actividad["actividad_id"] === act["ActividadId"]);
                  if (act.FuentesActividad) {
                    act.FuentesActividad.forEach(fuente => {
                      rubro.MontoParcial += fuente.MontoParcial
                    });
                  }
                });
              }
            });
          }
          if (rubro.Fuentes) {
            rubro.Fuentes.forEach(fuente => {
              rubro.MontoParcial += fuente.MontoParcial
            });
          }
        });
      }
    });
  }

  getInfoMeta(vigencia: Number, dependencia: Number): Observable<any> {
    // this.planAdquisicionHelper.getPlanAdquisicionByDependencia(vigencia.toString(), dependencia.toString()).subscribe(res => {
    //   this.actividades = res;
    // });
    return this.planAdquisicionHelper.getPlanAdquisicionByDependencia(vigencia.toString(), dependencia.toString());
  };

  getInfoJefeDepdencia(jefe_dependencia_id: Number): Observable<any> {
    // this.coreHelper.getJefeDependencia(dependencia.toString()).subscribe(res => {
    //   console.info("jefe dependencia:",res);
    //   this.dependenciaHelper.get(res["DependenciaId"]).subscribe(resDepndencia => {
    //     this.dependenciaSoliciante = resDepndencia;
    //   });
    // });
    return this.coreHelper.getJefeDependencia(jefe_dependencia_id.toString());
  }

  getInfoDependencia(dependencia: Number): Observable<any> {
    return this.dependenciaHelper.get(dependencia);
  }

  cambioTab() {
    this.eventChange.emit(false);
  }

  expedirCDP(consecutivo) {
    this.popManager.showAlert('warning', `Expedir CDP ${consecutivo}`, 'continuar')
      .then((result) => {
        if (result.value) {
          this.cdpHelper.expedirCDP(this.solicitud["_id"]).subscribe(res => {
            if (res) {
              this.popManager.showSuccessAlert(`Se expidió con éxito el CDP ${res.infoCdp.consecutivo}`)
              this.router.navigate(['/pages/plan-cuentas/cdp']);
            }

          })

        }
      });
  }

  mostrarPDF(consecutivo) {
    this.tituloPDF = `Certificado de disponibilidad presupuestal N° ${consecutivo}`;
    this.mostrandoPDF = !this.mostrandoPDF;
  }

}
