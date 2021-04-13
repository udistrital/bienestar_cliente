import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { RegistroInscritoModel } from "../../modelos/registroInscrito.model";
import { FechaModel } from "../../modelos/fecha.model";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";
import { ListService } from "../../../../@core/store/list.service";
import { Periodo } from "../../../../@core/data/models/parametro/periodo";
import { IAppState } from "../../../../@core/store/app.state";
import { Store } from "@ngrx/store";
import { ParametroPeriodo } from "../../../../@core/data/models/parametro/parametro_periodo";
import { DatePipe } from "@angular/common";
import { formatDate } from "@angular/common";
import { environment } from "../../../../../environments/environment";
import { OikosService } from "../../../../@core/data/oikos.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { Tercero } from "../../../../@core/data/models/terceros/tercero";
import { SolicitudService } from "../../../../@core/data/solicitud.service";

import { Registro } from "../../../../@core/data/models/registro";
import { ImplicitAutenticationService } from "../../../../@core/utils/implicit_autentication.service";
import { RegistroApoyo } from "../../../../@core/data/models/solicitud/registro-apoyo";

@Component({
  selector: "ngx-inscritos",
  templateUrl: "./inscritos.component.html",
  styleUrls: ["./inscritos.component.scss"],
})
export class InscritosComponent implements OnInit {
  noBeneficiarios: boolean;
  sedesAccesso = [];
  facultadAccesso = [];
  registros = [];
  registroBase = new RegistroInscritoModel();
  periodo: Periodo = null;
  fechaActual = new FechaModel();
  myDate = formatDate(new Date(), "yyyy-MM-dd", "en");
  usuarioWSO2 = "";
  private autenticacion = new ImplicitAutenticationService();

  constructor(
    private toastrService: NbToastrService,
    private oikosService: OikosService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private store: Store<IAppState>,
    private solicitudService: SolicitudService,
    private listService: ListService
  ) {
    Swal.fire({
      title: "Por favor espere!",
      html: `cargando información de formulario`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    this.usuarioWSO2 = this.autenticacion.getPayload().email
      ? this.autenticacion.getPayload().email.split("@").shift()
      : this.autenticacion.getPayload().sub;
    this.myDate = this.datePipe.transform(this.myDate, "yyyy-MM-dd");
    this.listService.findParametros();
    this.loadPeriodo();
    this.cargarSedes()
      .then(() => {
        if (this.sedesAccesso != []) {
          this.cargarFacultades();
        }
      })
      .catch((error) => {
        Swal.close();
        Swal.fire("Error", `<p>${error}</p>`, "error");
      });
  }


  public loadPeriodo() {
    this.store
      .select((state) => state)
      .subscribe((list) => {
        const listaParam = list.listParametros;
        if (listaParam.length > 0 && this.periodo === null) {
          for (let parametro of <Array<ParametroPeriodo>>listaParam[0]["Data"]) {
            if (parametro.ParametroId.Id == environment.IDS.IDSERVICIOAPOYO && parametro.Activo) {
              this.periodo = parametro.PeriodoId;
              break;
            }
          }
        }
      });
  }

  async ngOnInit() {
    this.noBeneficiarios = false;
    this.fechaActual.fechaDia = new Date();
  }

  async guardar(form: NgForm) {
    if (form.invalid || this.sedesAccesso.length === 0) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.registroBase.sede = form.value["sede"];

    /* Asociamos tercero con el documento */
    this.listService.loadTerceroByDocumento(this.registroBase.codigo).then((resp) => {
      const terceroReg: Tercero = resp;
      let solicitudId: number = 0;
      /* Se encuentra el tercero */
      if (terceroReg !== undefined) {
        this.listService.loadSolicitanteByIdTercero(terceroReg.Id, environment.IDS.IDSOLICITUDRADICADA, this.periodo.Nombre, true)
          .then((listSolicitante) => {
            /* Validamos si esta inscrito, o si se permiten no inscritos y el estudiante esta activo */
            this.permitirRegistroNoInscrito(listSolicitante, terceroReg.Id).then(
              (permitir) => {
                this.listService.loadFacultadTercero(terceroReg.Id).then((nomFacultad) => {
                  if (nomFacultad == this.facultadAccesso[this.registroBase.sede]) {
                    this.registrar(this.registroBase.sede, solicitudId, terceroReg.Id).then((msj) => {
                      this.showToast(`${this.registroBase.codigo}`, `${msj} ${solicitudId != 0 ? 'Beneficiario' : 'No beneficiario'}`);
                    }).catch((error) => {
                      this.showError(`${this.registroBase.codigo}`, error);
                    });
                  }
                  else {
                    this.showFacultadDiferente().then(
                      (resp) => {
                        if (resp.isConfirmed) {
                          this.registrar(this.registroBase.sede, solicitudId, terceroReg.Id).then((msj) => {
                            this.showToast(`${this.registroBase.codigo}`, `${msj} ${solicitudId != 0 ? 'Beneficiario' : 'No beneficiario'}`);
                          }).catch((error) => {
                            this.showError(`${this.registroBase.codigo}`, error);
                          });
                        } else {
                          this.showError(`${this.registroBase.codigo}`, "Estudiante de otra facultad");
                        }
                      });
                  }
                })
                  .catch((error) => {
                    this.showError(`${this.registroBase.codigo}`, error);
                  });
              }
            ).catch((error) => this.showError(`${this.registroBase.codigo}`, error));
            Object.values(form.controls).forEach((control) => {
              control.markAsUntouched();
            });
            form.value["codigo"] = "";
            /* ----- */
          });
      } else {
        this.showError(`${this.registroBase.codigo}`, "Identificacion no asociada a un estudiante");
      }
    });
  }
  
  permitirRegistroNoInscrito(resp: any, terceroId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (resp.length == 0) {
        if (this.noBeneficiarios) {
          this.listService.cargarEstadoTercero(terceroId).then((estado) => {
            if (estado == 'V') {
              resolve(true);
            } else {
              reject(`El estudiante tiene el estado: ${estado}`);
            }
          }).catch((error) => {
            reject(error);
          });
          return "Informacion basica estudiante no encontrada";
        } else {
          reject("El estudiante no es beneficiario")
        }
      } else {
        resolve(true);
      }

    });
  }

  registrar(idSede: string, idSolicitud: number, idTercero: number): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(`Registro #${145}`);
      const idSed = this.sedesAccesso[idSede].Id;
      const newReg: RegistroApoyo =
        new RegistroApoyo(this.periodo.Id,
          this.myDate.toString(),
          idSed,
          idSolicitud,
          idTercero,
          this.usuarioWSO2);
     /*  this.solicitudService.post('registro_apoyo', JSON.stringify(newReg))
        .subscribe(res => {
          newReg.id = res['Data']['Id']
          resolve(`Registro #${newReg.id}`);
        }, (error) => reject(error)); */
    });
  }



  cargarSedes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.oikosService
        .get(
          `tipo_uso_espacio_fisico?query=TipoUsoId.Nombre:Apoyo,Activo:true&limit=-1`
        )
        .subscribe(
          (result) => {
            for (let i = 0; i < result.length; i++) {
              this.sedesAccesso.push(result[i].EspacioFisicoId);
            }
            if (this.sedesAccesso.length > 0) {
              resolve(true);
            } else {
              reject("Error al cargar las sedes")
            }
          },
          (error: HttpErrorResponse) => {
            Swal.fire({
              icon: "error",
              title: error.status + "",
              text: this.translate.instant("ERROR." + error.status),
              footer:
                this.translate.instant("GLOBAL.cargar") +
                "-" +
                this.translate.instant("GLOBAL.info_complementaria"),
              confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
            });
            reject(error);
          }
        );
    });

  }

  async cargarFacultades() {
    for (let i = 0; i < this.sedesAccesso.length; i++) {
      this.facultadAccesso.push("");
    }
    for (let i = 0; i < this.sedesAccesso.length; i++) {
      this.oikosService
        .get(
          `asignacion_espacio_fisico_dependencia?query=EspacioFisicoId.Nombre:${this.sedesAccesso[i].Nombre}&limit=-1`
        )
        .subscribe((result) => {
          for (let j = 0; j < result.length; j++) {
            let nomDependencia = result[j].DependenciaId.Nombre;
            var splitted = nomDependencia.split(" ", 1);
            if (splitted[0] == "FACULTAD") {
              this.facultadAccesso[i] = nomDependencia;
              break;
            }
          }
          Swal.close();
        });
    }
  }

  showToast(titulo, mensaje) {
    let reg = new Registro(titulo, mensaje, "alert-success");
    this.registros.push(reg);

    this.toastrService.show(
      mensaje,
      titulo,
      {
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        status: "success",
        duration: 2000,
        icon: "checkmark-square-outline",
      }
    );
    this.registroBase.codigo = "";
  }

  showError(titulo, error) {
    let reg = new Registro(titulo, error, "alert-danger");
    this.registros.push(reg);
    this.toastrService.show(
      error,
      /* `Estudiante: ${this.registroBase.codigo}`, */
      titulo,
      {
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        status: "danger",
        duration: 3000,
        icon: "checkmark-square-outline",
      }
    );
  }


  private showFacultadDiferente(): Promise<any> {
    return new Promise((resolve) => {
      Swal.fire({
        title: 'Estudiante de otra facultad',
        text: "¿Deseas aceptar este registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Registrar'
      }).then((result) => resolve(result)).catch(() => resolve(false));
    });
  }

}
