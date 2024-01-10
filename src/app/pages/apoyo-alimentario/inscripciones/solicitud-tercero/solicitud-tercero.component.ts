import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { environment } from "../../../../../environments/environment";
import { Periodo } from "../../../../@core/data/models/parametro/periodo";
import { ListService } from "../../../../@core/store/list.service";
import { Solicitud } from "../../../../@core/data/models/solicitud/solicitud";
import { ImplicitAutenticationService } from "../../../../@core/utils/implicit_autentication.service";
import { Tercero } from "../../../../@core/data/models/terceros/tercero";
import { ApiConstanst } from "../../../../shared/constants/api.constans";
import { InfoCompletaEstudiante } from "../../../../@core/data/models/info-completa-estudiante/info-completa-estudiante";
import { InfoComplementariaTercero } from "../../../../@core/data/models/terceros/info_complementaria_tercero";
import { UtilService } from "../../../../shared/services/utilService";
import { Observacion } from "../../../../@core/data/models/solicitud/observacion";
import { NgForm } from "@angular/forms";
import { delay } from "rxjs/operators";
import { Solicitante } from "../../../../@core/data/models/solicitud/solicitante";
import { ReferenciaSolicitud } from "../../../../@core/data/models/solicitud/referencia-solicitud";
@Component({
  selector: "ngx-solicitud-tercero",
  templateUrl: "./solicitud-tercero.component.html",
  styleUrls: ["./solicitud-tercero.component.scss"],
})
export class SolicitudTerceroComponent implements OnInit {
  tercero: Tercero = null;
  solicitud: Solicitud = null;
  periodo: Periodo = null;
  loading: boolean = true;
  puedeCrear: boolean = false;

  creando: boolean = false;

  APP_CONSTANTS = ApiConstanst;

  estadosSolicitud = [
    [environment.IDS.IDSOLICITUDRADICADA, "Radicada"],
    [environment.IDS.IDSOLICITUDACEPTADA, "Aceptada"],
    [environment.IDS.IDSOLICITUDNOACEPTADA, "Rechazada"],
    [environment.IDS.IDSOLICITUDPREPARADA, "Preparada para presentar a comité"],
  ];

  referencia = "";
  observaciones: Observacion[] = [];

  username: string = "";
  private autenticacion = new ImplicitAutenticationService();
  solicitudes: Solicitud[] = [];

  constructor(
    private utilService: UtilService,
    private listService: ListService
  ) {
    /** ventana de carga para procesar la petición. */
    Swal.fire({
      title: "Por favor espere!",
      html: `cargando información del estudiante`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();

    this.listService
      .getInfoEstudiante()
      .then((respUser) => {
        //usuarioWSO2 = "" javiermartinez25//9798 / 20152072116
        // pruebaInscripcion7//9787 //
        //pruebaInscripcion5//9788  // 20172010086
        //respUser.Codigo="20161020046"
        this.listService
          .loadTerceroByDocumento(respUser.Codigo)
          .then((respTecero) => {
            this.tercero = respTecero;
            if (this.tercero !== undefined) {
              this.listService
                .loadSolicitanteByIdTercero(this.tercero.Id, null, null, null)
                .then((resp) => {
                  this.solicitudes = [];
                  for (const solicitante of resp) {
                    this.estadosSolicitud.forEach((element: any) => {
                      let estado: number =
                        solicitante.SolicitudId.EstadoTipoSolicitudId.Id;
                      if (estado == element[0]) {
                        solicitante.SolicitudId.EstadoTipoSolicitudId.EstadoId.Nombre =
                          element[1];
                      }
                    });
                    this.solicitudes.push(solicitante.SolicitudId);
                  }
                  Swal.close();
                  this.puedeCrearSolicitud();
                })
                .catch((error) => console.error(error));
            } else {
              this.showError(
                "Estudiante no encontrado",
                "No se encuentra el tercero"
              );
            }
          })
          .catch((errorT) => this.showError("Estudiante no existe", errorT));
      })
      .catch((err) => this.showError("No se encontro al estudiante", err));

    this.listService
      .findParametrosByPeriodoTipoEstado(
        null,
        environment.IDS.IDINSCRIPCIONES,
        true
      )
      .then((resp) => {
        /* Se valida que la inscripcion exista en el periodo*/
        if (resp.length > 0) {
          /** Se obtiene id del periodo de inscripción. */
          this.periodo = resp[0].PeriodoId;
          this.puedeCrearSolicitud();
        }
      })
      .catch((error) => {
        this.showError("Periodo Vacio", error);
        Swal.close();
      });
    Swal.close();
  }

  puedeCrearSolicitud() {
    this.puedeCrear = false;
    if (this.periodo != null) {
      this.puedeCrear = true;
      if (this.solicitudes.length > 0) {
        for (const sol of this.solicitudes) {
          let refSol: ReferenciaSolicitud;
          try {
            refSol = JSON.parse(sol.Referencia);
            if (refSol != null) {
              if (refSol.Periodo === this.periodo.Nombre) {
                if (sol.Activo == true) {
                  this.puedeCrear = false;
                  break;
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }

  ngOnInit() {}

  verSolicitud(i: number) {
    this.listService
      .loadSolicitud(this.solicitudes[i].Id)
      .then((sol) => {
        this.solicitud = sol;
        let ref: any = JSON.parse(this.solicitud.Referencia);
        this.referencia = ref.Periodo;
        this.loading = false;
        /** Se obtienen observaciones de la solicitud */
        this.listService
          .findObservacion(sol.Id, 1)
          .then((respObs) => {
            this.observaciones = respObs;
          })
          .catch((errObs) =>
            this.showError("Observación no encontrada", errObs)
          );
      })
      .catch((errorSol) => this.showError("Solicitud no encontrada", errorSol));
  }

  editarSolicitud(i: number) {
    this.creando = true;
  }

  nuevaSolicitud() {
    this.creando = true;
  }

  loadingForm(load) {
    this.loading = load;
    Swal.close();
  }

  sendData(form: NgForm) {}

  showError(titulo: string, msj: any) {
    this.loading = false;
    Swal.close();
    this.utilService.showSwAlertError(titulo, msj);
  }

  puedeEditar(sol) {
    let refSol: ReferenciaSolicitud;
    try {
      refSol = JSON.parse(sol.Referencia);
      if (refSol != null) {
        if (refSol.Periodo === this.periodo.Nombre) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
