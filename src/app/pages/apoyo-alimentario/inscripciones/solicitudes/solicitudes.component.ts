import { Component, OnInit } from '@angular/core';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo'
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud';
import { environment } from '../../../../../environments/environment';
import { UtilService } from '../../../../shared/services/utilService'
import { EstadoTipoSolicitud } from '../../../../@core/data/models/solicitud/estado-tipo-solicitud';
import { Estado } from '../../../../@core/data/models/solicitud/estado';
import { DatePipe } from '@angular/common';

class SolicitudExt {
  Solicitud: Solicitud;
  Periodo: string;
  Puntaje: number;
  constructor(sol: Solicitud) {
    this.Solicitud = sol;
    const refSol: ReferenciaSolicitud = JSON.parse(sol.Referencia);
    this.Periodo = refSol.Periodo;
    this.Puntaje = refSol.Puntaje;
  }
}


@Component({
  selector: 'ngx-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})


export class SolicitudesComponent implements OnInit {

  solicitudesExt: SolicitudExt[] = [];
  solicitudes: Solicitud[] = [];
  filSols: Solicitud[] = [];
  periodos: Periodo[] = [];
  estadosTipoSolicitud: EstadoTipoSolicitud[] = [];
  estados: Estado[] = [];
  periodo: number = null;
  estadoTipo: number = null;
  busqueda: string;
  pagActual: number = 1;
  contPag: number = 0;
  itemsPag: number[] = [1, 5, 10, 15, 20, 25, 50, 75, 100];
  itemSelect: number = 10;
  constructor(
    private listService: ListService,
    private utilService: UtilService,
  ) {
    this.loadPeriodo();
    /* this.listService.findSolicitudes(null,-1).then((result)=>{
      if(result!=[]) {
        for (let solicitud of result) {
          this.solicitudes.push(solicitud);
        }
        this.filtrarSolicitudes();
      }else{
        this.utilService.showSwAlertError("Solicitudes no encontrados","No se encontraron solicitudes para ningun periodo");
      }
    }).catch((err)=>this.utilService.showSwAlertError("Error",err)); */

    this.loadEstadoTipoSolicitud();

  }
  loadEstadoTipoSolicitud() {
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

  private loadPeriodo() {
    this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDINSCRIPCIONES, null)
      .then((result) => {
        if (result != []) {
          for (let params of result) {
            this.periodos.push(params.PeriodoId);
          }
          if (this.periodos.length > 0) {
            this.periodo = 0;
          }
        } else {
          this.utilService.showSwAlertError("Parametros no encontrados", "No se encontraron periodos con solicitudes");
        }
      }).catch((err) => { this.utilService.showSwAlertError("Parametros no encontrados", err) });
  }

  ngOnInit() {
  }

  buscarSolicitudes() {
    console.log(this.estadoTipo)
    console.log(this.periodo)
    console.log(this.itemSelect)
    this.listService.findSolicitudes(this.estadoTipo, this.itemSelect).then((result) => {
      if (result != []) {
        this.solicitudesExt = []
        for (let solicitud of result) {
          const solext = new SolicitudExt(solicitud);
          if (this.periodo == null || this.periodos[this.periodo].Nombre == solext.Periodo) {
            this.solicitudesExt.push(solext)
          }
        }
        if(this.solicitudesExt.length==0){
          this.utilService.showSwAlertError('Solicitudes no encontradas','No se encontro ninguna solicitud con los parametros seleccionados.');
        }
      } else {
        this.utilService.showSwAlertError("Solicitudes no encontrados", "No se encontraron solicitudes para ningun periodo");
      }
    }).catch((err) => this.utilService.showSwAlertError("Error", err));
  }

  exportarCsv() {
    const headers = {
      id: "id",
      tipo: "tipo_solicitud",
      activo: "activo",
      estado: "estado_soolicitud",
      fechaCreacion: "fecha_creacion",
      periodo: "periodo",
      puntaje: "puntaje",
      solicitudFinalizada: "Finalizada"
    };
    const data = [];
    for (const s of this.solicitudesExt) {
      data.push({
        id: s.Solicitud.Id,
        tipo: s.Solicitud.EstadoTipoSolicitudId.TipoSolicitud.Nombre,
        activo: s.Solicitud.Activo ? 'SI' : 'NO',
        estado: s.Solicitud.EstadoTipoSolicitudId.EstadoId.Nombre,
        fechaCreacion: s.Solicitud.FechaCreacion,
        periodo: s.Periodo,
        puntaje: s.Puntaje,
        solicitudFinalizada: s.Solicitud.SolicitudFinalizada ? 'SI' : 'NO'
      });
    }
    let nombre = "solicitudes " +
      (this.estadoTipo != null ? this.estadosTipoSolicitud[this.estadoTipo].EstadoId.Nombre + " " : "") +
      (this.periodos[this.periodo] != null ? this.periodos[this.periodo].Nombre : "historico") +
      " "+(new Date()).toISOString();
    this.utilService.exportCSVFile(headers, data, nombre);
  }
}
