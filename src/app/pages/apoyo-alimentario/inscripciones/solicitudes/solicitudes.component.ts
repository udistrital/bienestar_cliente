import { Component, OnInit } from '@angular/core';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo'
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud';
import { environment } from '../../../../../environments/environment';
import { UtilService } from '../../../../shared/services/utilService'
import { EstadoTipoSolicitud } from '../../../../@core/data/models/solicitud/estado-tipo-solicitud';
import { Estado } from '../../../../@core/data/models/solicitud/estado';


@Component({
  selector: 'ngx-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  filSols: Solicitud[] = [];
  periodos: Periodo[] = [];
  estadosTipoSolicitud: EstadoTipoSolicitud[] = [];
  estados: Estado[] = [];
  periodo: number = null;
  estado: number = null;
  busqueda: string;
  pagActual: number = 1;
  contPag: number = 0;
  itemsPag: number[] = [1, 5, 10, 15, 20, 25, 50, 75, 100];
  itemSelect: number = 10;
  constructor(
    private listService: ListService,
    private utilService: UtilService
  ) {
    this.loadPeriodo();
    
    this.listService.findSolicitudes().then((result)=>{
      console.info(result);
      if(result!=[]) {
        for (let solicitud of result) {
          this.solicitudes.push(solicitud);
        }
        this.filtrarSolicitudes();
      }else{
        this.utilService.showSwAlertError("Solicitudes no encontrados","No se encontraron solicitudes para ningun periodo");
      }
    }).catch((err)=>this.utilService.showSwAlertError("Error",err));

    this.loadEstadoTipoSolicitud();

  }
  loadEstadoTipoSolicitud() {
    this.listService.findEstadoTipoSolicitud(environment.IDS.IDTIPOSOLICITUD)
      .subscribe((result: any[]) => {
        if (result['Data'].length > 0) {
          let estadosTiposolicitud = <Array<EstadoTipoSolicitud>>result['Data'];
          for (let estadoTipo of estadosTiposolicitud) {
            this.estadosTipoSolicitud.push(estadoTipo);
            this.estados.push(estadoTipo.EstadoId);
          }
        }
      },
        error => {
          console.error(error);
        }
      );
  }

  private loadPeriodo() {
    this.listService.findParametrosByPeriodoTipoEstado(null,environment.IDS.IDINSCRIPCIONES,null)
    .then((result) => {
      console.info(result);
      if(result!=[]) {
        for (let params of result) {
          this.periodos.push(params.PeriodoId);
        }
        if (this.periodos.length > 0) {
          this.periodo = 0;
        }
      }else{
        this.utilService.showSwAlertError("Parametros no encontrados","No se encontraron periodos con solicitudes");
      }
    }).catch((err) => {this.utilService.showSwAlertError("Parametros no encontrados",err)} );
  }

  ngOnInit() {
  }

   private filtrarSolicitudes() {
    this.pagActual=1
    this.filSols=[];
    for (const solicitud of this.solicitudes) {
      try {
        let refSol: ReferenciaSolicitud = JSON.parse(solicitud.Referencia);
        console.log('referencia', refSol);
        if (this.periodo == null || this.periodos[this.periodo].Nombre == refSol.Periodo) {
          if (this.estado == null || this.estados[this.estado].Id == solicitud.EstadoTipoSolicitudId.EstadoId.Id) {
            this.filSols.push(solicitud);
          }
        }
      } catch {
        console.error("Problema con la referencia de la solicitud");
      }
    }
  }



  onSelect($event) {
    this.filtrarSolicitudes();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let filtro = filterValue.trim().toLowerCase();
    console.log(filtro);
    this.filSols = [];

    for (let i of this.solicitudes) {
      if (i.EstadoTipoSolicitudId.EstadoId.Nombre == filterValue) {
        this.filSols.push(i);
      }
    }
    console.log(this.solicitudes);
  }

  exportarCsv() {
    const headers = {
      id: "id",
      activo: "activo",
      estado: "Estado",
      fechaCreacion: "Fecha creacion",
      referencia: "referencia",
      solicitudFinalizada: "Finalizada"
    };
    const data = [];
    for (const s of this.filSols) {
      data.push({
        id: s.Id,
        activo: s.Activo,
        estado: s.EstadoTipoSolicitudId.EstadoId.Nombre,
        fechaCreacion: s.FechaCreacion,
        refencia: s.Referencia.split(':')[1][-1],
        solicitudFinalizada: s.SolicitudFinalizada
      })

    }
    let nombre ="solicitudes "+ 
    (this.estados[this.estado] != null ? this.estados[this.estado].Nombre +" ": "")+ 
    (this.periodos[this.periodo]!=null ? this.periodos[this.periodo].Nombre: "historico");
    this.utilService.exportCSVFile(headers, data, nombre);
  }
}
