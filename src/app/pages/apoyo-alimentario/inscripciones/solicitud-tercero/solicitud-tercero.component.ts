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
  loading: boolean = true;

  APP_CONSTANTS = ApiConstanst;
  
  referencia="";    
  observaciones: Observacion[] = [];

  username: string = "";
  private autenticacion = new ImplicitAutenticationService();
 
  constructor(
    private utilService: UtilService,
    private listService: ListService,
  ) {
    /** ventana de carga para procesar la petición. */
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
        /* Se valida que la inscripcion exista en el periodo*/
        if (resp.length > 0) {
          /** Se obtiene id del periodo de inscripción. */
          this.periodo = resp[0].PeriodoId;

          let usuarioWSO2 = this.autenticacion.getPayload().email
            ? this.autenticacion.getPayload().email.split("@").shift()
            : this.autenticacion.getPayload().sub;
          //usuarioWSO2 = "daromeror";
          //usuarioWSO2 = ""  javiermartinez25//9798   //   jgcastellanosj//9811  //fdbarretos//82   // pruebaInscripcion7//9787  //pruebaInscripcion5//9788   evaluador//9792
          //usuarioWSO2 = "sagomezl";
          usuarioWSO2 = "pruebaInscripcion5";

          this.listService.loadTerceroByWSO2(usuarioWSO2).then((respTecero) => {
            /* Se carga informacion si existe el tercero*/
            this.tercero = respTecero;
                    
            this.listService.findDocumentosTercero(this.tercero.Id, null).then((respDocs) => {
              /* Se busca carnet o documento del tercero. */
              for (const documento of respDocs) {
                if (this.estudiante.Carnet == null && documento.TipoDocumentoId.CodigoAbreviacion == "CODE") {
                  this.estudiante.Carnet = documento;
                } else if (this.estudiante.Documento == null && documento.TipoDocumentoId.CodigoAbreviacion != "CODE") {
                  this.estudiante.Documento = documento;
                }
              }
              //Se busca solicitante si existen carnet y documento
              if (this.estudiante.Carnet != null && this.estudiante.Documento != null) {
                
                this.listService.loadSolicitanteByIdTercero(this.tercero.Id, null, this.periodo.Nombre, null)
                  .then((listSolicitantes) => {
                    /** Se busca la facultad a la cual pertenece un tercero, para obtener su proyecto curricular */
                    this.listService.loadFacultadProyectoTercero(this.tercero.Id).then((nomFacultad) => {
                      this.estudiante.Facultad = nomFacultad[0];
                      this.estudiante.ProyectoCurricular = nomFacultad[1];
                      /** Se busca si existe la solicitud para el periodo actual */
                      if (listSolicitantes.length > 0) {
                        this.listService.loadSolicitud(listSolicitantes[0].SolicitudId.Id).then((sol) => {
                          this.solicitud = sol;
                          let ref: any=JSON.parse(this.solicitud.Referencia);
                          this.referencia=ref.Periodo;
                          this.loading = false;
                          Swal.close();
                          /** Se obtienen observaciones de la solicitud */
                          this.listService.findObservacion(sol.Id,1).then((respObs) => {
                            this.observaciones = respObs;
                          }).catch((errObs) => this.showError("Observación no encontrada", errObs));
                        }).catch((errorSol) => this.showError("Solicitud no encontrada", errorSol));
                      } else {
                        this.loading = false;
                        Swal.close();
                      }

                    }).catch((errorFacu) => {
                      console.log("FFFF");
                      this.showError("Facultad o Proyecto curricular no existe", errorFacu);
                    });;

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

}
