import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CDPHelper } from '../../../../@core/helpers/cdp/cdpHelper';
import { PlanAdquisicionHelper } from '../../../../@core/helpers/plan_adquisicion/planAquisicionHelper';
import { CoreHelper } from '../../../../@core/helpers/core/coreHelper';
import { DependenciaHelper } from '../../../../@core/helpers/oikos/dependenciaHelper';
import { MovimientosHelper } from '../../../../@core/helpers/movimientos/movimientosHelper';
import { NecesidadesHelper } from '../../../../@core/helpers/necesidades/necesidadesHelper';
import { DocumentoPresupuestalHelper } from '../../../../@core/helpers/documentoPresupuestal/documentoPresupuestalHelper';
import { RequestManager } from '../../../../@core/managers/requestManager';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  areas = { "1": 'Rector', "2": 'Convenios' };
  entidades = {"1": 'Universidad Distrital Francisco José de Caldas' };

  areaFuncional: object;
  centroGestor: object;

  actividades: object[];
  dependenciaSoliciante: object;

  estadoNecesidadRechazada: object;

  constructor(
    private cdpHelper: CDPHelper,
    private planAdquisicionHelper: PlanAdquisicionHelper,
    private coreHelper: CoreHelper,
    private dependenciaHelper: DependenciaHelper,
    private movimientosHelper: MovimientosHelper,
    private necesidadesHelper: NecesidadesHelper,
    private documentoPresuestalHelper: DocumentoPresupuestalHelper,
    private popManager: PopUpManager,
    private router: Router,
  ) { }

  ngOnInit() {
    this.cdpHelper.getFullNecesidad(this.solicitud['necesidad']).subscribe(async res => {
      this.TrNecesidad = res;

      this.areaFuncional = this.areas[this.TrNecesidad["Necesidad"]["AreaFuncional"]];
      this.centroGestor = this.entidades[this.solicitud["centroGestor"]];

      let jefe_dependencia: object;
      await this.getInfoJefeDepdencia(this.TrNecesidad["Necesidad"]["DependenciaNecesidadId"]["JefeDepSolicitanteId"]).toPromise().then(res => { jefe_dependencia = res });
      await this.getInfoDependencia(jefe_dependencia["DependenciaId"]).toPromise().then(res => { this.dependenciaSoliciante = res });
      await this.getInfoMeta(this.TrNecesidad["Necesidad"]["Vigencia"], this.dependenciaSoliciante["Id"]).toPromise().then(res => { this.actividades = res });

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
    return this.planAdquisicionHelper.getPlanAdquisicionByDependencia(vigencia.toString(), dependencia.toString());
  };

  getInfoJefeDepdencia(jefe_dependencia_id: Number): Observable<any> {
    return this.coreHelper.getJefeDependencia(jefe_dependencia_id.toString());
  }

  getInfoDependencia(dependencia: Number): Observable<any> {
    return this.dependenciaHelper.get(dependencia);
  }

  cambioTab() {
    this.eventChange.emit(false);
  }

  expedirCDP(consecutivo) {
    this.popManager.showAlert('warning', `Expedir la solicitud de CDP ${consecutivo}`, 'continuar')
      .then((result) => {
        if (result.value) {
          this.construirDatosMovimiento().then(movimiento => {
            this.movimientosHelper.postMovimiento(movimiento).subscribe(res => {
              if (res) {
                this.popManager.showSuccessAlert(`Se expidió con éxito el CDP`)
                this.router.navigate(['/pages/plan-cuentas/cdp']);
              }
            });
          });
        }
      });
  }

  private async construirDatosMovimiento(): Promise<object> {
    var movimiento = {
      Data: { "solicitud_cdp": this.solicitud["_id"] },
      Tipo: "cdp",
      Vigencia: 2019,
      CentroGestor: String(this.solicitud["centroGestor"]),
      AfectacionMovimiento: []
    };

    this.TrNecesidad["Rubros"].forEach((rubro: object) => {
      movimiento.AfectacionMovimiento.push(
        {
          MovimientoProcesoExternoId: {
              TipoMovimientoId: {
                  Id: 7,
                  Acronimo: "cdp"
              }
          },
          DocumentoPadre: rubro["RubroId"],
          Valor: rubro["MontoParcial"],
          Descripcion: this.TrNecesidad["Necesidad"]["Objeto"]
        }
      )
    });
    await this.documentoPresuestalHelper.GetAllDocumentoPresupuestalByTipo(
      String(this.TrNecesidad["Necesidad"]["Vigencia"]),
      String(this.solicitud["centroGestor"]),
      "cdp").toPromise().then(res => {
        movimiento.Data["consecutivo_cdp"] = res;
      });
    return movimiento;
  };

  rechazarSolicitud() {
    this.popManager.showAlertInput('warning', `Rechazar solicitud de CDP`, 
      'Escriba la justificación del rechazo', 'Es necesario escribir una justificación de rechazo', 'textarea')
        .then((result) => {
          if (result.value) {
            this.necesidadesHelper.getEstadoRechazado().pipe(
              switchMap(estadoRechazada => {
                  if(estadoRechazada) {
                    let necesidad = this.TrNecesidad["Necesidad"]
                    necesidad["EstadoNecesidadId"] = estadoRechazada;
                    return this.necesidadesHelper.putNecesidad(necesidad, necesidad["Id"]);
                  }
                }
              )
            ).subscribe(res => {
              if(res) {
                let necesidadRechazada = {
                  Justificacion: result.value,
                  NecesidadId: { Id: this.TrNecesidad["Necesidad"]["Id"] },
                  FechaRechazo: new Date(),
                  ConsecutivoNecesidad: this.TrNecesidad["Necesidad"]["ConsecutivoNecesidad"]
                };
                this.necesidadesHelper.postNecesidadRechazada(necesidadRechazada).subscribe(); 
              }
            });
          }
      });
  }

  mostrarPDF(consecutivo) {
    this.tituloPDF = `Certificado de disponibilidad presupuestal N° ${consecutivo}`;
    this.mostrandoPDF = !this.mostrandoPDF;
  }

}
