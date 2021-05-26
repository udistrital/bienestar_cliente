import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo'
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { environment } from '../../../../../environments/environment';
import { UtilService } from '../../../../shared/services/utilService';


@Component({
  selector: 'ngx-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.scss']
})
export class PeriodosComponent implements OnInit {
  periodos: Periodo[] = [];
  estadoPeriodo: String[][] = [];
  parametros: ParametroPeriodo[] = [];


  constructor(
    private listService: ListService,
    private utilService: UtilService,
    ) {
    this.listService.findPeriodosAcademico().then((resp)=>{
      if(resp.length>0){
        resp.forEach(element => {
          this.periodos.push(element);
          let vacio = ["", "", ""];
          this.estadoPeriodo.push(vacio);
        })
        this.listService.findParametrosByPeriodoTipoEstado(null,null,null).then((resp)=>{
          this.parametros=resp;
          this.cargarEstadoPeriodos();
        });
      }else{
        this.utilService.showSwAlertError("Buscando periodos","No se encontraron periodos");
      }
    }).catch((err)=>this.utilService.showSwAlertError("Buscando periodos",err));
  }

  ngOnInit(): void {
    
  }

  cargarEstadoPeriodos(): void {
    for (let i = 0; i < this.periodos.length; i++) {
      const periodo = this.periodos[i];
      this.estadoPeriodo[i] = ["", "", ""];
      /* Para inscripciones */
      let parametro = this.getParametroByPerido_Tipo(periodo.Id, environment.IDS.IDINSCRIPCIONES, null);
      if (parametro == undefined) {
        if (periodo.Activo) {
          this.estadoPeriodo[i][0] = "iniciar";
        }
      } else if (parametro.Activo) {
        this.estadoPeriodo[i][0] = "detener";
      } else {
        this.estadoPeriodo[i][0] = "reiniciar";
      }
      /* Para servicio */
      parametro = this.getParametroByPerido_Tipo(periodo.Id, environment.IDS.IDSERVICIOAPOYO, null);
      if (parametro == undefined) {
        if (periodo.Activo) {
          this.estadoPeriodo[i][1] = "iniciar";
        }
      } else if (parametro.Activo) {
        this.estadoPeriodo[i][1] = "detener";
      } else {
        this.estadoPeriodo[i][1] = "reiniciar";
      }

      /* Para cierre */
      parametro = this.getParametroByPerido_Tipo(periodo.Id, environment.IDS.IDCIERREPERIODO, null);
      if (parametro == undefined) {
        if (this.estadoPeriodo[i][1] == "reiniciar" && this.estadoPeriodo[i][0] == "reiniciar") {
          this.estadoPeriodo[i][2] = "iniciar";
        }
      } else if (parametro.Activo) {
        if (periodo.Activo) {
          this.estadoPeriodo[i][2] = "detener";
        } else {
          this.estadoPeriodo[i][2] = "cerrado";
        }
        this.estadoPeriodo[i][1] = "";
        this.estadoPeriodo[i][0] = "";
      } else {
        if (this.estadoPeriodo[i][1] == "reiniciar" && this.estadoPeriodo[i][0] == "reiniciar") {
          this.estadoPeriodo[i][2] = "reiniciar";
        }
      }
    }
  }
  
   private getParametroByPerido_Tipo(idPeriodo: number, idParametro: number, activo: boolean): ParametroPeriodo {
    for (let parametro of this.parametros) {
      if (Object.keys(parametro).length > 0) {
        if (idPeriodo === parametro.PeriodoId.Id) {
          if (parametro.ParametroId.Id == idParametro) {
            if (activo == null || activo == parametro.Activo) {
              return parametro;
            }
          }
        }
      }
    }
    return undefined;
  }

  private getIdParametro(nombreParam: String): number {
    switch (nombreParam) {
      case "inscripciones":
        return environment.IDS.IDINSCRIPCIONES;
      case "servicio":
        return environment.IDS.IDSERVICIOAPOYO;
      case "cierre":
        return environment.IDS.IDCIERREPERIODO;
      default:
        return 0;
    }
  }


  public iniciarParametro(i: number, nombreParam: string) {
    let periodo = this.periodos[i];
    this.utilService.showSwAlertQuery('¿Está seguro?','' + `desea iniciar ${nombreParam} de ${periodo.Nombre}`,"Aceptar","question")
    .then(resp => {
      if (resp) {
        const idParametro = this.getIdParametro(nombreParam);
        if (idParametro != 0 && this.getParametroByPerido_Tipo(this.periodos[i].Id, idParametro, null) == undefined) {
          this.listService.inciarParametroPeriodo(periodo, idParametro).then((resp)=>{
            this.parametros.push(resp);
            this.cargarEstadoPeriodos();
            Swal.fire(`Creacion exitosa`,`${nombreParam} de ${periodo.Nombre}`,"success");
          }).catch((error)=>this.utilService.showSwAlertError("Cargando parametros de periodos",error));
        } else {
          this.utilService.showSwAlertError("Cargando parametro",`Ya existe ${nombreParam} en el ${periodo.Nombre}`);
        }
      }
    });
  }

  public detenerParametro(i: number, nombreParam: string) {
    let periodo = this.periodos[i];
    this.utilService.showSwAlertQuery('¿Está seguro?','' + `desea detener ${nombreParam} de ${periodo.Nombre}`,"Aceptar","question")
      .then(resp => {
        let idParametro = this.getIdParametro(nombreParam);
        if (resp && idParametro != 0) {
          let parametro: ParametroPeriodo = this.getParametroByPerido_Tipo(this.periodos[i].Id, idParametro, true);
          if (parametro != undefined) {
            parametro.Activo = false
            this.listService.actualizarInscripcionesPeriodo(parametro);
            this.cargarEstadoPeriodos();
          } else {
            this.utilService.showSwAlertError("Parametro no encontrado",`No se encontro ${nombreParam} activo en el ${periodo.Nombre}`);
          }
        }
      });
  }


  public reactivarParametro(i: number, nombreParam: string) {
    let periodo = this.periodos[i]
    this.utilService.showSwAlertQuery('¿Está seguro?','' + `desea reactivar ${nombreParam} de ${periodo.Nombre}`,"Aceptar","question")
      .then(resp => {
        let idParametro = this.getIdParametro(nombreParam);
        if (resp && idParametro != 0) {
          let parametro: ParametroPeriodo = this.getParametroByPerido_Tipo(this.periodos[i].Id, idParametro, false);
          if (parametro != undefined) {
            parametro.Activo = true;
            this.listService.actualizarInscripcionesPeriodo(parametro);
            this.cargarEstadoPeriodos();
          } else {
            this.utilService.showSwAlertError("Parametro no encontrado",`No se encontro ${nombreParam} activo en el ${periodo.Nombre}`);
          }
        }
      });
  }
}
