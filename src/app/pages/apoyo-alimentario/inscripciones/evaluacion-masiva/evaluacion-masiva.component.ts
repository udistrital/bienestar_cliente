import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ListService } from '../../../../@core/store/list.service';
import Swal from 'sweetalert2';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { UtilService } from '../../../../shared/services/utilService';
import { environment } from '../../../../../environments/environment';
import { EstadoTipoSolicitud } from '../../../../@core/data/models/solicitud/estado-tipo-solicitud';
import { Estado } from '../../../../@core/data/models/solicitud/estado';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud';
import { Observacion } from '../../../../@core/data/models/solicitud/observacion';
import { TipoObservacion } from '../../../../@core/data/models/solicitud/tipo-observacion';
import { saveAs } from 'file-saver';



@Component({
  selector: 'ngx-evaluacion-masiva',
  templateUrl: './evaluacion-masiva.component.html',
  styleUrls: ['./evaluacion-masiva.component.scss']
})
export class EvaluacionMasivaComponent implements OnInit {

  periodos: Periodo[] = [];
  periodo: number = 0;
  codigo = "";
  solicitudes: Solicitud[] = [];
  estadosTipoSolicitud: EstadoTipoSolicitud[] = [];
  estadoTipo: number = 0;
  nuevoEstado: number = null;
  obseravacionText: string = null;
  seleccionado: boolean[] = [];
  numSeleccionado = 0;
  evaluacion = false;

  allSelect: boolean = false

  constructor(
    private utilService: UtilService,
    private listService: ListService,
  ) {
    this.listService.findPeriodosAcademico().then((resp) => {
      this.periodos = resp;
    }).catch((err) => this.utilService.showSwAlertError("Cargar periodos", err));

    this.listService.findEstadoTipoSolicitud(environment.IDS.IDTIPOSOLICITUD)
      .subscribe((result: any[]) => {
        if (result['Data'].length > 0) {
          let estadosTiposolicitud = <Array<EstadoTipoSolicitud>>result['Data'];
          for (let estadoTipo of estadosTiposolicitud) {
            this.estadosTipoSolicitud.push(estadoTipo);

          }
          console.log(this.estadosTipoSolicitud);

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
    console.log(this.seleccionado);
    let coutSel = 0
    for (const sel of this.seleccionado) {
      if (sel) {
        coutSel++;
      }
    }
    this.allSelect = coutSel == this.seleccionado.length
    this.numSeleccionado = coutSel
  }

  someComplete(): boolean {
    if (this.seleccionado == []) {
      return false;
    }
    return this.seleccionado.filter(t => t).length > 0 && !this.allSelect;
  }

  setAll(completed: boolean) {
    this.allSelect = completed;
    if (this.seleccionado == null) {
      return;
    }
    for (let i = 0; i < this.seleccionado.length; i++) {
      this.seleccionado[i] = completed;
    }
    this.numSeleccionado = (completed) ? this.seleccionado.length : 0;
  }

  buscar(form: NgForm) {
    if (form.invalid || this.periodos.length === 0) {
      console.log("invalido");

      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.solicitudes = []
    this.seleccionado = []
    this.numSeleccionado = 0;
    this.allSelect = false;
    this.listService.findSolicitudes(this.estadosTipoSolicitud[this.estadoTipo].Id).then((result) => {
      console.log(result);
      if (result.length > 0) {
        for (let solicitud of result) {
          try {
            let refSol: ReferenciaSolicitud = JSON.parse(solicitud.Referencia);
            if (true || this.periodo == null || this.periodos[this.periodo].Nombre == refSol.Periodo) {
              this.solicitudes.push(solicitud);
              this.seleccionado.push(false)
            }
          } catch {
            console.error("Problema con la referencia de la solicitud");
          }
        }
        if (this.solicitudes.length == 0) {
          this.utilService.showSwAlertError("Solicitudes no encontrados", `No se encontraron solicitudes ${this.estadosTipoSolicitud[this.estadoTipo].EstadoId.Nombre} para ${this.periodos[this.periodo].Nombre}`);
        }
      } else {
        console.log('entro al else');
        this.utilService.showSwAlertError("Solicitudes no encontrados", `No se encontraron solicitudes ${this.estadosTipoSolicitud[this.estadoTipo].EstadoId.Nombre} para ningun periodo`);
      }
    }).catch((err) => this.utilService.showSwAlertError("Error", err));





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
              this.solicitudes = []
              this.seleccionado = []
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
            for (let i = 0; i < this.solicitudes.length; i++) {
              if (this.seleccionado[i]) {
                this.evaluarSolicitud(this.solicitudes[i], nuevoEstadoTipo, observacionObj).then((log) => {
                  logEvents.push(log);
                  actualizadas++;
                  b.textContent = `${actualizadas}`;
                  if (actualizadas == this.numSeleccionado) {
                    Swal.close()
                  }
                }).catch((logError)=> logEvents.push('Error: '+logError));
              }
            }
          }).catch((err) => this.utilService.showSwAlertError("No se puede cargar tipo de observacion", err));
        } else {
          console.log("Se cancela");
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

}


