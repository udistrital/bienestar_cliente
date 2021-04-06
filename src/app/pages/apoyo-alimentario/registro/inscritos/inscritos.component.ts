import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { SedeModel } from "../../modelos/sede.model";
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
import { TercerosService } from "../../../../@core/data/terceros.service";
import { Tercero } from "../../../../@core/data/models/terceros/tercero";
import { Solicitante } from "../../../../@core/data/models/solicitud/solicitante";
import { Solicitud } from "../../../../@core/data/models/solicitud/solicitud";
import { SolicitudService } from "../../../../@core/data/solicitud.service";
import { ReferenciaSolicitud } from "../../../../@core/data/models/solicitud/referencia-solicitud";

import { id } from "@swimlane/ngx-charts/release/utils";
import { Registro } from "../../../../@core/data/models/registro";
import { AcademicaService } from "../../../../@core/data/academica.service";

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


  constructor(
    private toastrService: NbToastrService,
    private oikosService: OikosService,
    private tercerosService: TercerosService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private store: Store<IAppState>,
    private solicitudService: SolicitudService,
    private academicaService: AcademicaService,
    private listService: ListService
  ) {
    this.myDate = this.datePipe.transform(this.myDate, "yyyy-MM-dd");
    this.listService.findParametroPeriodo(environment.IDS.IDSERVICIOAPOYO);
    this.loadPeriodo();
    this.cargarSedes()
      .then(() => {
        if (this.sedesAccesso != []) {
          this.cargarFacultades();
        }
      })
      .catch(() => {
        console.error("Error en cargar sedes");
      });
  }

  public loadPeriodo() {
    this.store
      .select((state) => state)
      .subscribe((list) => {
        const listaParam = list.listParametros;
        if (listaParam.length > 0 && this.periodo === null) {
          console.info("Periodo");
          console.info(listaParam);
          for (let parametro of <Array<ParametroPeriodo>>listaParam[0]["Data"]){
            console.log(parametro);
            if(parametro.Activo){
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
    console.log(this.registroBase.sede);
    console.log(this.facultadAccesso[this.registroBase.sede]);
    console.log(this.registroBase);

    /* Asociamos tercero con el documento */
    this.loadTerceroByDocumento(this.registroBase.codigo).then((resp) => {
      const terceroReg: Tercero = resp;
      /* Se encuentra el tercero */
      if (terceroReg !== undefined) {
        console.log(terceroReg);
        this.registrarInscrito(terceroReg.Id).then((resp) => {
          console.log(resp);
          this.showToast("Registro beneficiario", `Estudiante: ${this.registroBase.codigo}`);
        }
        ).catch((error) => {
          console.log("Error desde Guardar",error);
          if (error == "No se encuentra inscrito" && this.noBeneficiarios) {
            this.registrarNoInscrito(terceroReg.Id).then((resp) => {
              console.log(resp);
              this.showToast("Registro NO beneficiario", `Estudiante: ${this.registroBase.codigo}`);
            }
            ).catch((err) => {
              this.showError(`${err} ${this.registroBase.codigo}`);
            });
          } else {
            this.showError(`${error} ${this.registroBase.codigo}`);
          }

        });
        /* Sin fallos pero no se encuentra */
      } else {
        this.showError(`No se encuentra el documento ${this.registroBase.codigo}`);
      }
    })
      .catch(() => {
        Swal.fire('Error al cargar documentos');
      });

    Object.values(form.controls).forEach((control) => {
      control.markAsUntouched();
    });
    form.value["codigo"] = "";
  }

  registrarInscrito(Id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadSolicitudTercero(Id).then((resp) => {
        if (resp != undefined) {
          this.loadFacultadTercero(Id).then((respDependencia) => {
            console.log(respDependencia);
            resolve(resp);
          }).catch((error)=> {
          reject(error);
          });
        } else {
          reject("No se encuentra inscrito");
        }
      })
        .catch((error) => {
          reject(error);
        });
    });
  }
  loadFacultadTercero(Id: number) {
    return new Promise((resolve, reject) => {
      /* Cargamos vinculacion*/
      this.tercerosService
        .get(
          `vinculacion?query=TerceroPrincipalId.Id:${Id}&sortby=Id&order=desc&limit=-1`
        )
        .subscribe(
          (result) => {
            let vinculacionDep = 0;
            for (let i = 0; i < result.length; i++) {
              if (Object.keys(result[i]).length > 0) {
                if (result[i].TipoVinculacionId == 346) {
                  console.log(result[i].DependenciaId);
                  vinculacionDep = result[i].DependenciaId;
                  break;
                }
              }
            }
            /* Si se encuenta vinculacion como estudiante a un departamento */
            if (vinculacionDep != 0) {
              /* Cargamos facultad y proyecto */
              this.oikosService.get(`dependencia_padre?query=HijaId.Id:${vinculacionDep}`)
                .subscribe((resp) => {
                  console.log(resp[0].PadreId.Nombre);
                  console.log(this.facultadAccesso[this.registroBase.sede]);
                  if (resp[0].PadreId.Nombre == this.facultadAccesso[this.registroBase.sede]) {
                    console.log("Iguales");
                    resolve(true);
                  } else {                  
                    Swal.fire({
                      title: 'Estudiante de otra facultad',
                      text: "¿Deseas aceptar este registro?",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Registrar'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        resolve(true);
                      } else {
                        reject("No es de la facultad ");
                      }
                    })

                  }
                },
                  (error: HttpErrorResponse) => {
                    reject(error);
                  });
            } else {
              reject("Vinculacion del estudiante no encontrada");
            }
          },
          (error: HttpErrorResponse) => {
            reject(error);
            Swal.fire({
              icon: "error",
              title: error.status + "",
              text: this.translate.instant("ERROR." + error.status),
              footer:
                this.translate.instant("GLOBAL.cargar") +
                "-" +
                this.translate.instant("GLOBAL.academica"),
              confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
            });
          }
        );

    });
  }

  registrarNoInscrito(Idtercero: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cargarEstadoTercero(Idtercero).then((estado) => {
        console.log(estado);
        resolve("Se registra no inscrito");
      }).catch((error) => reject(error));
    });
  }

  cargarEstadoTercero(Idtercero: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cargarCarnetTecero(Idtercero).then((carnet) => {
        if (carnet != undefined) {
          this.academicaService.get(`datos_basicos_estudiante/${carnet['Numero']}`).subscribe((result) => {
            /* Cambiar por A */
            if (result.datosEstudianteCollection.datosBasicosEstudiante[0].estado == 'V') {
              resolve(true);
            } else {
              reject("El estudiante no esta activo")
            }
          });
        } else {
          reject("No se encuentra carnet asociado");
        }

      }).catch((error) => reject(error));


    });
    throw new Error("Method not implemented.");
  }
  cargarCarnetTecero(Idtercero: number) {
    return new Promise((resolve, reject) => {
      this.tercerosService
        .get(
          `datos_identificacion?query=TerceroId.Id:${Idtercero},TipoDocumentoId.CodigoAbreviacion:CODE&sortby=id&order=desc`
        )
        .subscribe(
          (result) => {
            if (Object.keys(result[0]).length > 0) {
              console.log(result[0]);
              console.log("Llgo llenno")
              resolve(result[0]);
            } else {
              console.log("Llega vacio")
              resolve(undefined);
            }

          },
          (error: HttpErrorResponse) => {
            reject(error);
          }
        );
    });
  }

  loadSolicitudTercero(IdTercero: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.solicitudService
        .get(`solicitante?query=TerceroId:${IdTercero}`)
        .subscribe(
          (result: any[]) => {
            let solicitante: Solicitante;
            if (Object.keys(result[0]).length > 0) {
              /* Consultamos las solicitudes de un solicitante */
              for (solicitante of result) {
                const sol: Solicitud = solicitante.SolicitudId;
                /* Se busca una solicitud radicada */
                if (
                  sol.EstadoTipoSolicitudId.Id ===
                  environment.IDS.IDSOLICITUDRADICADA
                ) {
                  /* Se busca una referencia correspondiente al periodo actual */
                  let refSol: ReferenciaSolicitud;
                  try {
                    refSol = JSON.parse(sol.Referencia);
                    if (refSol != null) {
                      if (refSol.Periodo === this.periodo.Nombre) {
                        resolve(sol);
                      }
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }
              }
              resolve(undefined);
            } else {
              resolve(undefined);
            }
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  loadTerceroByDocumento(documento: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tercerosService
        .get(`datos_identificacion?query=Numero:${documento}`)
        .subscribe(
          (result) => {
            resolve(result[0].TerceroId);
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

  cargarTerceroByDocumento(documento: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tercerosService
        .get(`datos_identificacion?query=Numero:${documento}`)
        .subscribe(
          (result) => {
            console.log(result[0].TerceroId);
            resolve(result[0].TerceroId);
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
            reject(error)
          }
        );
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
              this.sedesAccesso.push(result[i].EspacioFisicoId.Nombre);
            }
            resolve(true);
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

    //temporal
    /* let ingenieria = new SedeModel();
    ingenieria.id = "1";
    ingenieria.nombre = "Ingenieria";

    let macarena = new SedeModel();
    macarena.id = "2";
    macarena.nombre = "Macarena";

    let vivero = new SedeModel();
    vivero.id = "3";
    vivero.nombre = "Vivero"; */
    /* 
    this.sedesAccesso.push(ingenieria);
    this.sedesAccesso.push(macarena);
    this.sedesAccesso.push(vivero); */
  }

  async cargarFacultades() {
    console.log("Se toman:", this.sedesAccesso);
    for (let i = 0; i < this.sedesAccesso.length; i++) {
      this.facultadAccesso.push("");
    }
    for (let i = 0; i < this.sedesAccesso.length; i++) {
      console.log("Buscando facultad de:", this.sedesAccesso[i]);
      this.oikosService
        .get(
          `asignacion_espacio_fisico_dependencia?query=EspacioFisicoId.Nombre:${this.sedesAccesso[i]}&limit=-1`
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
          /* console.log(
            "se encuenta facultad de:",
            result[0].DependenciaId.Nombre
          ); */
        });
    }
    console.log(this.facultadAccesso);
  }

  showToast(titulo, mensaje) {
    let reg = new Registro(titulo, mensaje, "alert-success");
    this.registros.push(reg);
    /* console.log(dato); */

    this.toastrService.show(
      mensaje,
      /* `Estudiante: ${this.registroBase.codigo}`, */
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

  showError(error) {
    let reg = new Registro("Error", error, "alert-danger");
    this.registros.push(reg);
    this.toastrService.show(
      error,
      /* `Estudiante: ${this.registroBase.codigo}`, */
      "Error: ",
      {
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        status: "danger",
        duration: 2000,
        icon: "checkmark-square-outline",
      }
    );
    /* this.toastrService.danger(error,"Error"); */
  }
}
