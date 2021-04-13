import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo'
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { IAppState } from '../../../../@core/store/app.state';
import { Store } from '@ngrx/store';

import Swal from 'sweetalert2';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud';
import { environment } from '../../../../../environments/environment';
import { MatTableDataSource } from '@angular/material';
import { UtilService } from '../../../../shared/services/utilService'
import { EstadoTipoSolicitud } from '../../../../@core/data/models/solicitud/estado-tipo-solicitud';
import { TipoSolicitud } from '../../../../@core/data/models/solicitud/tipo_solicitud';
import { Estado } from '../../../../@core/data/models/solicitud/estado';



@Component({
  selector: 'ngx-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  filSols: Solicitud[] = [];
  filtroPeriodo: boolean = false;
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
    private store: Store<IAppState>,
    private listService: ListService,
    private utilService: UtilService
  ) {

    this.listService.findSolicitudesRadicadas();
    this.loadPeriodoSp();
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

  ngOnInit() {
  }

  public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const objList = list.listSolicitudesRadicadas;
        if (objList.length > 0 && this.solicitudes.length === 0) {
          const listSolicitudes = objList[0];
          for (let i = 0; i < listSolicitudes.length; i++) {
            this.solicitudes.push(listSolicitudes[i]);
          }
          this.filtrarSolicitudes();
        }
      });
  }



  public filtrarSolicitudes() {

    this.pagActual=1
    this.filSols=[];
    /* let nombrePeriodo = this.periodo == null ? "" : this.periodos[this.periodo].Nombre;
    console.log("nombre periodo =>", nombrePeriodo); */


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





  public loadPeriodoSp() {
    this.listService.findParametrosSp(environment.IDS.IDTIPOPARAMETRO)
      .subscribe((result: any[]) => {
        if (result['Data'].length > 0) {
          let parametros = <Array<ParametroPeriodo>>result['Data'];

          for (let param of parametros) {
            //console.log(param);
            if (param.ParametroId.Id == environment.IDS.IDINSCRIPCIONES) {
              this.periodos.push(param.PeriodoId);
            }
          }
          if (this.periodos.length > 0) {
            this.periodo = 0;
            this.loadLists();
          }
          console.info(this.periodo);
          //this.periodo = result['Data'][0].PeriodoId;
          //this.listService.findSolicitudesRadicadas();
          //this.loadLists();
        }
      },
        error => {
          console.error(error);
        }
      );
  }



  onSelect($event) {
    console.log("-----Nueva busqueda----------")
    /* for (let j = 0; j < 240; j++) {
      this.solicitudes.pop();
      this.filSols.pop();
    } */
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
