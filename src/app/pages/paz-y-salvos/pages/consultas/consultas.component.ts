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
import Swal from 'sweetalert2';
import { Solicitante } from '../../../../@core/data/models/solicitud_docente/solicitante';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';




class SolicitudExt {
  Solicitud: Solicitud;
  Periodo: string;
  Puntaje: number;
  constructor(sol: Solicitud) {
    this.Solicitud = sol;
    const refSol: ReferenciaSolicitud = JSON.parse(sol.Referencia);
    this.Periodo = refSol.Periodo;
    this.Puntaje = refSol.Puntaje;
  };
  terceros: Tercero[] = [];

}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
];


@Component({
  selector: 'ngx-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss']
})


export class ConsultasComponent implements OnInit {
//para solicitud

  solicitudesExt: SolicitudExt[] = [];
  solicitudes: Solicitud[] = [];
  filSols: Solicitud[] = [];
  periodos: Periodo[] = [];
  estadosTipoSolicitud: EstadoTipoSolicitud[] = [];
  estados: Estado[] = [];
  estadoNum: number = null;
  periodo: number = null;
  estadoTipo: number = null;
  busqueda: string;
  pagActual: number = 1;
  contPag: number = 0;
  itemsPag: number[] = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500];
  itemSelect: number = 10;
  itemOffSet: number = 0;
  itemTipoSol: string = "activa";
  paginacion: number = 10;
  //prueba para sacar datos del solicitante
  solicitante: Solicitante = null;
  terceros: Tercero[] = [];
  idSolicitud = 0;
  constructor(
    private listService: ListService,
    private utilService: UtilService,
  ) {
    this.loadPeriodo();
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
  this.cargarSol();
    
  }

  cargarSol(){
    Swal.fire({
      title: "Por favor espere",
      html: `Se estan cargando las solicitudes`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    let finalizada:boolean=null;
    if(this.itemTipoSol!="null"){
      finalizada = this.itemTipoSol=="finalizada" ? true : false;
    }
    this.listService.findSolicitudes(this.estadoTipo, this.itemSelect,this.itemOffSet,finalizada).then((result) => {
      if (result != []) {
        this.solicitudesExt = [];
        for (let solicitud of result) {
          const solext:any = new SolicitudExt(solicitud);
          if (this.periodo == null || this.periodos[this.periodo].Nombre == solext.Periodo) {
            //cargar datos de terceros de las solicitudes
            this.idSolicitud=solicitud.Id

            this.listService.loadSolicitanteBySolicitud(this.idSolicitud).then((respSolicitante) => {
              this.solicitante = respSolicitante;
              if (this.solicitante != undefined) {
                  this.listService.loadTercero(this.solicitante.TerceroId).then((respTerc) => {
                      this.terceros.push(respTerc);
                      //console.log("esta es la info del tercero:",respTerc);
                      this.solicitudesExt.push({...solext,...respTerc});
                  }).catch((errT) => this.utilService.showSwAlertError("Estudiante(tercero) no encontrado", errT));



              } else {
                  this.utilService.showSwAlertError("Solicitante no encontrado", "No se encontro un solicitante para la solicitud");
              }
          })
          //console.log("esta es la info de la solictud :",this.solicitudesExt);
          }
        }
        
        if(this.solicitudesExt.length==0 && (this.itemOffSet<=0 || this.itemOffSet==null)){
          Swal.close();
          this.utilService.showSwAlertError('Solicitudes no encontradas','No se encontro ninguna solicitud con los parametros seleccionados.');
        }else if(this.solicitudesExt.length==0 && this.itemOffSet>0){
          Swal.close();
          this.utilService.showSwAlertError('Solicitudes no encontradas',
          'No se encontro ninguna solicitud con los parametros seleccionados <br> <b> (Puede probar dejando el punto de partida en 0 para comprobar si existen solicitudes).</b>');
        }else{
          Swal.close();
        }
        
      } else {
        this.utilService.showSwAlertError("Solicitudes no encontrados", "No se encontraron solicitudes para ningun periodo");
      }
    })
    .catch((err) => this.utilService.showSwAlertError("Error", err));
  }

}
