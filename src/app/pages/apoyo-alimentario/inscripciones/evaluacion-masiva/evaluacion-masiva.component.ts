import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ListService } from '../../../../@core/store/list.service';
import Swal from 'sweetalert2';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { UtilService } from '../../../../shared/services/utilService';
import { environment } from '../../../../../environments/environment';
import { EstadoTipoSolicitud } from '../../../../@core/data/models/solicitud/estado-tipo-solicitud';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud';
import { Observacion } from '../../../../@core/data/models/solicitud/observacion';
import { saveAs } from 'file-saver';


class SolicitudExt {
  Solicitud: Solicitud;
  Periodo: string;
  Puntaje: number;
  Seleccionado: boolean;
  constructor(sol: Solicitud) {
    this.Solicitud = sol;
    const refSol: ReferenciaSolicitud = JSON.parse(sol.Referencia);
    this.Periodo = refSol.Periodo;
    this.Puntaje = refSol.Puntaje;
    this.Seleccionado = false;
  }
}

@Component({
  selector: 'ngx-evaluacion-masiva',
  templateUrl: './evaluacion-masiva.component.html',
  styleUrls: ['./evaluacion-masiva.component.scss']
})

export class EvaluacionMasivaComponent implements OnInit {

  periodos: Periodo[] = [];
  periodo: number = 0;
  solicitudesExt: SolicitudExt[] = [];
  estadosTipoSolicitud: EstadoTipoSolicitud[] = [];
  estadoTipo: number = 0;
  nuevoEstado: number = null;
  obseravacionText: string = null;
  numSeleccionado = 0;
  evaluacion = false;
  limite = -1;
  puntoInicial = 0;
  solFinalizada = "activas";

  allSelect: boolean = false

  constructor(
    private utilService: UtilService,
    private listService: ListService,
  ) {

    
    this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDINSCRIPCIONES, null)
      .then((result) => {
        if (result != []) {
          for (let params of result) {
            this.periodos.push(params.PeriodoId);
          }
          if (this.periodos.length > 0) {
            this.periodo = 0;
          }else{
            this.utilService.showSwAlertError("No hay peridos", "No se encontraron periodos con inscripciones a apoyo alimentario");
          }
        } else {
          this.utilService.showSwAlertError("Parametros no encontrados", "No se encontraron periodos con solicitudes");
        }
      }).catch((err) => { this.utilService.showSwAlertError("Parametros no encontrados", err) });
    

   /*  this.listService.findPeriodosAcademico().then((resp) => {
      this.periodos = resp;
    }).catch((err) => this.utilService.showSwAlertError("Cargar periodos", err)); */

    this.listService.findEstadoTipoSolicitud(environment.IDS.IDTIPOSOLICITUD)
      .subscribe((result: any[]) => {
        if (result['Data'].length > 0) {
          let estadosTiposolicitud = <Array<EstadoTipoSolicitud>>result['Data'];
          for (let estadoTipo of estadosTiposolicitud) {
            this.estadosTipoSolicitud.push(estadoTipo);
          }
        }
      },
        error => {
          console.error(error);
        }
      );
  }

  ngOnInit() {
  }

  updateAllComplete() {

    let coutSel = 0
    for (const sel of this.solicitudesExt) {
      if (sel.Seleccionado) {
        coutSel++;
      }
    }
    this.allSelect = coutSel == this.solicitudesExt.length
    this.numSeleccionado = coutSel
  }

  someComplete(): boolean {
    if (this.solicitudesExt == []) {
      return false;
    }
    return this.solicitudesExt.filter(t => t.Seleccionado).length > 0 && !this.allSelect;
  }

  setAll(completed: boolean) {
    this.allSelect = completed;
    if (this.solicitudesExt == null) {
      return;
    }
    for (let i = 0; i < this.solicitudesExt.length; i++) {
      this.solicitudesExt[i].Seleccionado = completed;
    }
    this.numSeleccionado = (completed) ? this.solicitudesExt.length : 0;
  }

  buscar(form: NgForm) {
    if (form.invalid || this.periodos.length === 0) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    if (this.limite < -1) {
      this.utilService.showSwAlertError('Limite invalido', 'El limite puede ser -1 o un numero positivo');
      return;
    }
    let finalizadas: boolean = null;
    if (this.solFinalizada == 'activas') {
      finalizadas = false;
    }
    if (this.solFinalizada == 'finalizadas') {
      finalizadas = true;
    }

    this.solicitudesExt = []
    this.numSeleccionado = 0;
    this.allSelect = false;

    this.listService.findSolicitudes(this.estadosTipoSolicitud[this.estadoTipo].Id, this.limite, this.puntoInicial, finalizadas).then((result) => {
      if (result.length > 0) {
        let countIter = 0
        for (let solicitud of result) {
          countIter++;
          try {
            let refSol: ReferenciaSolicitud = JSON.parse(solicitud.Referencia);
            if (this.periodo == null || this.periodos[this.periodo].Nombre == refSol.Periodo) {
              this.solicitudesExt.push(new SolicitudExt(solicitud))
            }
          } catch {
            console.error("Problema con la referencia de la solicitud");
          }
          finally {
            if (countIter == result.length) {
              if (this.solicitudesExt.length == 0) {
                let refSol: ReferenciaSolicitud = JSON.parse(result[0].Referencia);
                this.utilService.showSwAlertError('No se encontraron solicitudes de ' + this.periodos[this.periodo].Nombre,
                  `No se encontraron solicitudes de este periodo, se encontraron solicitudes de ${refSol.Periodo}`)
              } else {
                this.solicitudesExt.sort((a, b) => (b.Puntaje > a.Puntaje) ? 1 : ((a.Puntaje > b.Puntaje) ? -1 : 0));
              }
            }
          }
        }

        if (this.solicitudesExt.length == 0) {
          let refSol: ReferenciaSolicitud = JSON.parse(result[0].Referencia);
          this.utilService.showSwAlertError('No se encontraron solicitudes de ' + this.periodos[this.periodo].Nombre,
            `No se encontraron solicitudes de este periodo, se encontraron solicitudes de ${refSol.Periodo}`)
          /* this.utilService.showSwAlertError("Solicitudes no encontrados", `No se encontraron solicitudes ${this.estadosTipoSolicitud[this.estadoTipo].EstadoId.Nombre} para ${this.periodos[this.periodo].Nombre}`); */
        }
      } else {
        this.utilService.showSwAlertError("Solicitudes no encontrados", `No se encontraron solicitudes ${this.estadosTipoSolicitud[this.estadoTipo].EstadoId.Nombre} para ningun periodo`);
      }
    }).catch((err) => this.utilService.showSwAlertError("Error", err));

  }

  seleccionMasiva() {
    Swal.fire({
      title: '¿Cuantas solicitudes desea seleccionar?',
      text: 'Se seleccionaran en orden desendente deacuerdo al puntaje',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Seleccionar',
      cancelButtonText: 'Cancelar selección',
      cancelButtonColor: '#d33',

    }).then((result) => {
      if (result.value) {
        const numSelect = result.value
        if (numSelect <= this.solicitudesExt.length && numSelect > 0) {
          this.setAll(false);
          for (let i = 0; i < numSelect; i++) {
            this.solicitudesExt[i].Seleccionado = true;
          }
          this.allSelect = numSelect == this.solicitudesExt.length;
          this.numSeleccionado = numSelect;
          //Usar Utils
          Swal.fire({
            title: '¡Seleccion masiva exitosa!',
            text: 'Se seleccionaron de forma exitosa ' + numSelect + ' solicitudes',
            icon: 'success'
          })
        } else {
          //Usar Utils
          Swal.fire({
            title: 'Valor ingresado incorrecto',
            text: 'El valor ingresado tiene que estar entre 1 y ' + this.solicitudesExt.length,
            icon: 'error'
          })
        }
      }
    });

  }

  empezarEvaluacion() {
    if (this.numSeleccionado == 0) {
      this.utilService.showSwAlertError('Seleccion incorrecta', 'No has seleccionando ninguna solicitud para evaluar')
    } else {
      this.evaluacion = true;
    }
  }

  save() {
    if (this.nuevoEstado == null) {
      this.utilService.showSwAlertError("Nuevo estado vacio", "El nuevo estado es obligatorio");
      return;
    }
    const nuevoEstadoTipo = this.estadosTipoSolicitud[this.nuevoEstado];
    if (nuevoEstadoTipo.Id == this.estadosTipoSolicitud[this.estadoTipo].Id) {
      this.utilService.showSwAlertError("Cambio de Estado", "El nuevo estado no puede ser igual al actual");
      return;
    }
    if (this.obseravacionText == null) {
      this.utilService.showSwAlertError("Observación Vacia", "Agregar una observacion es obligatorio");
      return;
    }

    let tituloObservacion = `Cambio estado masivo ${this.estadosTipoSolicitud[this.estadoTipo].EstadoId.Nombre} a ` +
      `${nuevoEstadoTipo.EstadoId.Nombre}`;

    let obseracionCompleta = `${this.obseravacionText} // ${this.utilService.getUsuarioWSO2()}`;

    this.utilService.showSwAlertQuery(`¿Cambiar estado a ${this.numSeleccionado} solicitudes?`, `<p>Su nuevo estado sera <strong>${nuevoEstadoTipo.EstadoId.Nombre}</strong></p>` +
      `<p> <strong> Observacion: ${tituloObservacion}</strong>
      ${obseracionCompleta}</p>`, 'Cambiar estado')
      .then((result) => {
        if (result) {
          let logEvents: any[] = []
          Swal.fire({
            title: 'Evaluacion masiva de solicitudes',
            html: `<b>0</b> de ${this.numSeleccionado} ... espere`,
            timerProgressBar: true,
            willOpen: () => {
              Swal.showLoading();
            },
            willClose: () => {
              let txtLogs = "";
              for (const log of logEvents) {
                txtLogs += log + "\n";
              }
              var blob = new Blob([txtLogs], { type: "text/plain;charset=utf-8" });
              saveAs(blob, "registro de evaluacion masiva.txt");
              this.utilService.showSwAlertSuccess("Evaluacion masiva", `Se evaluaron ${this.numSeleccionado} solicitudes de forma correcta`, "success");
              this.solicitudesExt = []
              this.numSeleccionado = 0;
              this.allSelect = false;
              this.evaluacion = false;
            }
          });
          const content = Swal.getContent();
          const b = content.querySelector('b');
          let actualizadas = 0
          logEvents.push("Logs");
          this.listService.loadTiposObservacion(1).then((resp) => {
            let observacionObj = new Observacion();
            observacionObj.Titulo = tituloObservacion;
            observacionObj.Valor = obseracionCompleta;
            observacionObj.TipoObservacionId = resp['Data'][0];
            for (const solicitudExt of this.solicitudesExt) {
              if (solicitudExt.Seleccionado) {
                this.evaluarSolicitud(solicitudExt.Solicitud, nuevoEstadoTipo, observacionObj).then((log) => {
                  logEvents.push(log);
                  actualizadas++;
                  b.textContent = `${actualizadas}`;
                  if (actualizadas == this.numSeleccionado) {
                    Swal.close()
                  }
                }).catch((logError) => logEvents.push('Error: ' + logError));

              }
            }
          }).catch((err) => this.utilService.showSwAlertError("No se puede cargar tipo de observacion", err));
        } else {
        }
      });
  }

  evaluarSolicitud(solicitud, nuevoEstadoTipo, observacionObj): Promise<any> {
    return new Promise((resolve, reject) => {
      this.listService.loadSolicitanteBySolicitud(solicitud.Id).then((respSolicitante) => {
        let solicitante = respSolicitante;
        if (solicitante != undefined) {
          this.listService.cambiarEstadoSolicitud(solicitud, nuevoEstadoTipo, solicitante.TerceroId).then((resp) => {
            solicitud.EstadoTipoSolicitudId = nuevoEstadoTipo;
            observacionObj.SolicitudId = solicitud;
            observacionObj.TerceroId = solicitante.TerceroId;
            this.listService.crearObservacion(observacionObj).then((resp) => {
              resolve("Se evaluo de forma correcta la solicitud #" + solicitud.Id)
            }).catch((error) => {
              reject("No se creo la Observación para la solicitud #" + solicitud.Id);
            });
          }).catch((err) => {
            reject("No se cambio el estado para la solicitud #" + solicitud.Id);
          })
        } else {
          reject("No se cambio el estado para la solicitud #" + solicitud.Id);
        }
      }).catch((err) => {
        reject("No se cambio el estado para la solicitud #" + solicitud.Id);
      });
    });
  }

  cambiarSolicitudFinalizada(estado: boolean) {
    /* if (this.solicitud.SolicitudFinalizada == estado) {
        return;
    } */
    if (this.solFinalizada == 'todas') {
      return;
    }
    if (estado && this.solFinalizada != 'activas') {
      return;
    }
    if (!estado && this.solFinalizada != 'finalizadas') {
      return;
    }
    let tituloObs = estado ? 'Finalizar' : 'Activar'
    this.utilService.showSwAlertQuery(`¿Desea ${tituloObs} ${this.numSeleccionado} solicitudes?`,
      `Vas a <b>${tituloObs}</b> las solicitudes de forma masiva`, tituloObs).then((respq) => {
        if (respq) {
          let logEvents: any[] = []
          Swal.fire({
            title: tituloObs + ' masiva de solicitudes',
            html: `<b>0</b> de ${this.numSeleccionado} ... espere`,
            timerProgressBar: true,
            willOpen: () => {
              Swal.showLoading();
            },
            willClose: () => {
              let txtLogs = "";
              for (const log of logEvents) {
                txtLogs += log + "\n";
              }
              var blob = new Blob([txtLogs], { type: "text/plain;charset=utf-8" });
              saveAs(blob, "registro de " + estado ? "finalizacion" : "activacion" + " masiva.txt");
              this.utilService.showSwAlertSuccess(`${estado ? 'Finalizacion' : 'Activacion'} masiva`, `Se ${estado ? 'finalizaron' : 'activaron'} ${this.numSeleccionado} solicitudes de forma correcta`, "success");
              this.solicitudesExt = []
              this.numSeleccionado = 0;
              this.allSelect = false;
              this.evaluacion = false;
            }
          });
          const content = Swal.getContent();
          const b = content.querySelector('b');
          let actualizadas = 0
          logEvents.push("Logs");
          this.listService.loadTiposObservacion(1).then((resp) => {
            let observacionObj = new Observacion();
            observacionObj.Titulo = estado ? 'Finalizacion' : 'Activacion' + " masiva";
            observacionObj.Valor = `Accion realizada de forma masiva // ${this.utilService.getUsuarioWSO2()}`;
            observacionObj.TipoObservacionId = resp['Data'][0];
            for (const solicitudExt of this.solicitudesExt) {
              if (solicitudExt.Seleccionado) {
                this.cambiarEstado(solicitudExt.Solicitud, estado, observacionObj).then((log) => {
                  logEvents.push(log);
                  actualizadas++;
                  b.textContent = `${actualizadas}`;
                  if (actualizadas == this.numSeleccionado) {
                    Swal.close()
                  }
                }).catch((logError) => logEvents.push('Error: ' + logError));
              }
            }

          }).catch((err) => this.utilService.showSwAlertError("No se puede cargar tipo de observacion", err));
        }
      });
  }

  cambiarEstado(solicitud: Solicitud, finalizada: boolean, observacionObj: Observacion): Promise<any> {
    return new Promise((resolve, reject) => {
      this.listService.loadSolicitanteBySolicitud(solicitud.Id).then((respSolicitante) => {
        let solicitante = respSolicitante;
        if (solicitante != undefined) {
          solicitud.SolicitudFinalizada = finalizada
          this.listService.actualizarSolicitud(solicitud).then((resp) => {
            observacionObj.SolicitudId = solicitud;
            observacionObj.TerceroId = solicitante.TerceroId;
            this.listService.crearObservacion(observacionObj).then((respObs) => {
              resolve(`Se ${finalizada ? 'finalizo' : 'activo'} de forma correcta la solicitud #${solicitud.Id}`)
            }).catch((errOb) => reject("No se creo la Observación para la solicitud #" + solicitud.Id));
          }).catch((err) => {
            reject(`No se pudo ${finalizada ? 'finalizar' : 'activar'} de forma correcta la solicitud #${solicitud.Id}`);
          });
        } else {
          reject("No se cambio el estado para la solicitud #" + solicitud.Id);
        }
      }).catch((err) => {
        reject("No se cambio el estado para la solicitud #" + solicitud.Id);
      });
    });
  }




}


