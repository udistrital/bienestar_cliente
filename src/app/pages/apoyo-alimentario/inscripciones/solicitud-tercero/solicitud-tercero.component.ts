import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { environment } from "../../../../../environments/environment";
import { Periodo } from "../../../../@core/data/models/parametro/periodo";
import { ListService } from "../../../../@core/store/list.service";
import { Solicitud } from "../../../../@core/data/models/solicitud/solicitud";
import { ImplicitAutenticationService } from "../../../../@core/utils/implicit_autentication.service";
import { Tercero } from "../../../../@core/data/models/terceros/tercero";
import { TercerosService } from "../../../../@core/data/terceros.service";
import { SolicitudService } from "../../../../@core/data/solicitud.service";
import { Solicitante } from "../../../../@core/data/models/solicitud/solicitante";
import { ReferenciaSolicitud } from "../../../../@core/data/models/solicitud/referencia-solicitud";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { ViewChild } from "@angular/core";
import { TemplateRef } from "@angular/core";
import { ApiConstanst } from "../../../../shared/constants/api.constans";
import { TranslateService } from "@ngx-translate/core";
import { AcademicaService } from "../../../../@core/data/academica.service";
import { InfoCompletaEstudiante } from "../../../../@core/data/models/info-completa-estudiante/info-completa-estudiante";
import { DatePipe } from "@angular/common";
import { InfoComplementariaTercero } from "../../../../@core/data/models/terceros/info_complementaria_tercero";
import { UtilService } from "../../../../shared/services/utilService";
import { OikosService } from '../../../../@core/data/oikos.service';
import { Observacion } from "../../../../@core/data/models/solicitud/observacion";
import { NuxeoService } from "../../../../@core/utils/nuxeo.service";
import { DocumentoService } from "../../../../@core/data/documento.service";

@Component({
  selector: "ngx-solicitud-tercero",
  templateUrl: "./solicitud-tercero.component.html",
  styleUrls: ["./solicitud-tercero.component.scss"],
})
export class SolicitudTerceroComponent implements OnInit {
  tercero: Tercero = null;
  solicitud: Solicitud = null;
  periodo: Periodo = null;
  estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante();
  listInfoComplementaria: InfoComplementariaTercero[] = [];
  loading: boolean = true;

  APP_CONSTANTS = ApiConstanst;
  
  observaciones: Observacion[] = [];

  username: string = "";
  private autenticacion = new ImplicitAutenticationService();
 
  constructor(
    private utilService: UtilService,
    private listService: ListService,
  ) {
    Swal.fire({
      title: "Por favor espere!",
      html: `cargando información del estudiante`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();

    /* Cargamos periodo con inscripciones activas */
    this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDINSCRIPCIONES, true).then(
      (resp) => {
        console.log(resp);
        console.log(resp != []);

        //if (resp != []) {
        if (resp.length > 0) {
          this.periodo = resp[0].PeriodoId;
          console.log(this.periodo);

          let usuarioWSO2 = this.autenticacion.getPayload().email
            ? this.autenticacion.getPayload().email.split("@").shift()
            : this.autenticacion.getPayload().sub;
          usuarioWSO2 = "daromeror";
          //usuarioWSO2 = "";
          //usuarioWSO2 = "sagomezl";

          this.listService.loadTerceroByWSO2(usuarioWSO2).then((respTecero) => {
            console.log("loadTerceroByWSO2");
            this.tercero = respTecero;
            console.log(this.tercero);
            this.listService.findDocumentosTercero(this.tercero.Id, null).then((respDocs) => {
              console.log("findDocumentosTercero");
              for (const documento of respDocs) {
                if (this.estudiante.Carnet == null && documento.TipoDocumentoId.CodigoAbreviacion == "CODE") {
                  this.estudiante.Carnet = documento;
                } else if (this.estudiante.Documento == null && documento.TipoDocumentoId.CodigoAbreviacion != "CODE") {
                  this.estudiante.Documento = documento;
                }
              }
              //Change this.estudiante.Documento
              if (this.estudiante.Carnet != null && this.estudiante.Documento != null) {
                this.listService.loadSolicitanteByIdTercero(this.tercero.Id, null, this.periodo.Nombre, null)
                  .then((listSolicitantes) => {
                    console.log("loadSolicitanteByIdTercero");
                    this.listService.loadFacultadProyectoTercero(this.tercero.Id).then((nomFacultad) => {
                      this.estudiante.Facultad = nomFacultad[0];
                      this.estudiante.ProyectoCurricular = nomFacultad[1];

                      if (listSolicitantes.length > 0) {
                        this.listService.loadSolicitud(listSolicitantes[0].SolicitudId.Id).then((sol) => {
                          this.solicitud = sol;
                          console.log(this.solicitud);
                          this.loading = false;
                          Swal.close();
                          this.listService.findObservacion(sol.Id).then((respObs) => {
                            console.log(respObs);
                            this.observaciones = respObs;
                          }).catch((errObs) => this.showError("Observación no encontrada", errObs));
                        }).catch((errorSol) => this.showError("Solicitud no encontrada", errorSol));
                      } else {
                        this.loading = false;
                        Swal.close();
                      }

                    });

                  }).catch((errorSolT) => {
                    this.showError("Solicitud no existe", errorSolT);
                  });

              } else {
                this.showError("Documentos del estudiante no encontrados", "No se encontro el carnet y documento de identificacion");
              }
            }).catch((errorDocs) => this.showError("Documentos no encontrados", errorDocs));

          }).catch((errorT) => this.showError("Estudiante no existe", errorT));

        } else {
          this.showError("Periodo Vacio", "No se encuentra un periodo activo para inscripciones");
        }
      }).catch((error) => {
        this.showError("Periodo Vacio", error);
      });
  }


  ngOnInit() {
    console.log("CUANDO CARGO");
  }

  loadingForm(load){
    this.loading = load;
    Swal.close();
  }

  sendData(form: NgForm) { }

  showError(titulo: string, msj: any) {
    this.loading = false;
    Swal.close();
    this.utilService.showSwAlertError(titulo, msj);
  }

  async save() {
    const isValidTerm = await this.utilService.termsAndConditional();

    /* let caracterizaciones = [...this.comorbilidades, ...this.otros]; */

    if (isValidTerm) {
      //***************************************************** */
      /* if (this.validacionesForm()) {
        this.registrar();
        console.log("Se guardoooo");
      } */

      /* Swal.fire({
        title: 'Información de caracterización',
        text: `Se ${this.isPost ? 'almacenará' : 'actualizará'} la información correspondiente a la caracterización`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: this.isPost ? 'Guardar' : 'Actualizar',
      }).then(result => {
        if (result.value) {
          Swal.fire({
            title: '¡Por favor espere!',
            html: this.isPost ? 'Guardando' : 'Actualizando' + ' caracterización',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading();
            },
          });

          if (this.tercero) {
            Swal.fire({
              title: this.isPost ? 'Guardando' : 'Actualizando' + ' caracterización',
              html: `<b></b> de ${caracterizaciones.length + this.vinculaciones.length} registros ${this.isPost ? 'almacenados' : 'actualizados'}`,
              timerProgressBar: true,
              willOpen: () => {
                Swal.showLoading();
              },
            });

            let vinculacionesC = this.vinculaciones.map((vinculacion: any) => {
              const newVinculacion = { ...vinculacion };
              newVinculacion.Alternancia = newVinculacion.isSelected;
              delete newVinculacion.label;
              delete newVinculacion.isSelected;
              delete newVinculacion.name;
              delete newVinculacion.nombreVinculacion;
              return newVinculacion
            })
            from(vinculacionesC)
              .subscribe((vinculacionC: any) => {
                this.request.put(environment.TERCEROS_SERVICE, 'vinculacion', vinculacionC, vinculacionC.Id)
                  .subscribe((data) => {

                  }),
                  error => {
                    Swal.fire({
                      title: 'error',
                      text: `${JSON.stringify(error)}`,
                      icon: 'error',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      confirmButtonText: `Aceptar`,
                    });
                  };
              })

            let updated = this.vinculaciones.length;
            from(caracterizaciones)
              .subscribe((caracterizacion: any) => {
                let caracterizacionTercero = {
                  TerceroId: { Id: this.tercero.Id },
                  InfoComplementariaId: {
                    Id: caracterizacion.Id,
                  },
                  Dato: JSON.stringify({ dato: caracterizacion.isSelected }),
                  Activo: true,
                };
                this.updateStorage()

                if (this.isPost) {
                  this.request
                    .post(environment.TERCEROS_SERVICE, 'info_complementaria_tercero/', caracterizacionTercero)
                    .subscribe((data: any) => {
                      const content = Swal.getContent();
                      if (content) {
                        const b = content.querySelector('b');
                        if (b) {
                          b.textContent = `${updated}`;
                        }
                      }
                      updated += 1;
                      if (updated === (caracterizaciones.length + this.vinculaciones.length)) {
                        Swal.close();
                        Swal.fire({
                          title: `Registro correcto`,
                          text: `Se ingresaron correctamente ${caracterizaciones.length + this.vinculaciones.length} registros`,
                          icon: 'success',
                        }).then((result) => {
                          if (result.value) {
                            this.router.navigate(['/pages']);
                          }
                        })
                        this.isPost = false;
                      }
                    }),
                    error => {
                      Swal.fire({
                        title: 'error',
                        text: `${JSON.stringify(error)}`,
                        icon: 'error',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: `Aceptar`,
                      });
                    };
                } else {
                  this.request
                    .put(environment.TERCEROS_SERVICE, 'info_complementaria_tercero', caracterizacionTercero, caracterizacion.form.Id)
                    .subscribe((data: any) => {
                      const content = Swal.getContent();
                      if (content) {
                        const b = content.querySelector('b');
                        if (b) {
                          b.textContent = `${updated}`;
                        }
                      }
                      updated += 1;
                      if (updated === (caracterizaciones.length + this.vinculaciones.length)) {
                        Swal.close();
                        Swal.fire({
                          title: `Actualización correcta`,
                          text: `Se actualizaron correctamente ${caracterizaciones.length + this.vinculaciones.length} registros`,
                          icon: 'success',
                        }).then((result) => {
                          if (result.value) {
                            this.router.navigate(['/pages']);
                          }
                        })
                      }
                    }),
                    error => {
                      Swal.fire({
                        title: 'error',
                        text: `${JSON.stringify(error)}`,
                        icon: 'error',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: `Aceptar`,
                      });
                    };
                }
              });
          }
        }
      });
    } */
    }
  }
}
