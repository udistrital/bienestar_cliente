import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ListService } from '../../../../@core/store/list.service';
import Swal from 'sweetalert2';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { UtilService } from '../../../../shared/services/utilService';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ApoyoAlimentario } from '../../../../@core/data/models/apoyo-alimentario';
import { environment } from '../../../../../environments/environment';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud';
import { Solicitante } from '../../../../@core/data/models/solicitud/solicitante';
import { Observacion } from '../../../../@core/data/models/solicitud/observacion';

@Component({
  selector: 'ngx-fallas-justificadas',
  templateUrl: './fallas-justificadas.component.html',
  styleUrls: ['./fallas-justificadas.component.scss']
})
export class FallasJustificadasComponent implements OnInit {

  parametros: ParametroPeriodo[] = []
  solicitante: Solicitante = undefined;
  parametro: number = 0;
  codigo = "";
  tercero: Tercero = undefined;
  justificaciones: Observacion[] = [];

  addFalla: boolean = false;


  constructor(
    private utilService: UtilService,
    private listService: ListService,
  ) {
    this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDSERVICIOAPOYO, null).then((respParam) => {
      if (respParam.length > 0) {
        if (Object.keys(respParam[0]).length > 0) {
          this.parametros = respParam;
        }
      }
    });
  }
  ngOnInit() {
  }

  buscar(form: NgForm) {
    if (form.invalid || this.parametros.length === 0) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.listService.loadTerceroByDocumento(this.codigo).then((resp) => {
      this.tercero = resp;
      if (this.tercero !== undefined) {
        let nombrePeriodo: string = null
        if (this.parametro != undefined) {
          nombrePeriodo = this.parametros[this.parametro].PeriodoId.Nombre;
        }
        this.listService.loadSolicitanteByIdTercero(this.tercero.Id, null, nombrePeriodo, null).then(
          (resp) => {
            if (resp.length > 0) {
              this.solicitante = resp[0];
              this.listService.findObservacion(this.solicitante.SolicitudId.Id, 6).then((respObs) => {
                this.justificaciones = respObs;
              }).catch((errObs) => this.utilService.showSwAlertError("Observación no encontrada", errObs));
            } else {
              this.utilService.showSwAlertError("Solicitud no encontrada", 'No se encuentra solicitud de ' + this.tercero.NombreCompleto);
              this.tercero = undefined;
            }
          }
        ).catch((error) => console.error(error));

      } else {
        this.utilService.showSwAlertError("Estudiante no encontrado", 'No se encuentra el tercero');
      }
    }).catch(
      (error) => {
        this.utilService.showSwAlertError("Estudiante no encontrado", `<p>${error}</p>`);
        /* Swal.fire("Error",
          `<p>${error}</p>`, "error"); */
      }
    );

  }

  agregarJustificacion(fecha, justificacion) {

    if (justificacion != "" && fecha != null) {
      let titulo = 'Falla justificada para ' + fecha

      this.utilService.showSwAlertQuery("¿Agregar justificacion?",
        `<b>${titulo}</b><hr> ${justificacion}`, "Agregar").then((respq) => {
          if (respq) {
            this.listService.loadTiposObservacion(6).then((resp) => {
              /*  Agregar observacion*/
              let observacionObj = new Observacion();
              observacionObj.SolicitudId = this.solicitante.SolicitudId;
              observacionObj.TerceroId = this.tercero.Id;
              observacionObj.Titulo = titulo;
              observacionObj.Valor = justificacion + " // " + this.utilService.getUsuarioWSO2();
              observacionObj.TipoObservacionId = resp['Data'][0];
              this.listService.crearObservacion(observacionObj).then((resp) => {
                resp.FechaCreacion = resp.FechaCreacion.split('.')[0] + '.000000 +0000 +0000';
                this.justificaciones.push(resp);

                this.utilService.showSwAlertSuccess("Nueva falla justificada", "Se agrego la falla justificada de forma correcta", "success");
                this.addFalla = false;
              }).catch((errOb) => this.utilService.showSwAlertError("No se pudo crear la observacion", errOb));
            }).catch((err) => this.utilService.showSwAlertError("Observaciones no encontradas", err));
          }
        });
    } else {
      this.utilService.showSwAlertError('Error en los datos', 'Todos los campos son obligatorios')
    }
  }

  borrarBusqueda() {
    if (!this.addFalla) {
      this.tercero = undefined;
      this.solicitante = undefined;
    } else {
      this.addFalla = false;
    }


  }


}


