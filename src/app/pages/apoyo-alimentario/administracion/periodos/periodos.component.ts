import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo'
import { IAppState } from '../../../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { environment } from '../../../../../environments/environment';


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
    private store: Store<IAppState>,
    private listService: ListService) {
    this.listService.findPeriodosAcademico();
    this.listService.findParametros();
    this.loadLists();
    this.loadParametros();
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


  public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listPA = list.listPeriodoAcademico
        if (listPA.length > 0 && this.periodos.length === 0) {
          const periodos = <Array<Periodo>>listPA[0]['Data'];
          periodos.forEach(element => {
            this.periodos.push(element);
            let vacio = ["", "", ""];
            this.estadoPeriodo.push(vacio);
          })
        }
      },
    );
  }

  public loadParametros() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listaParam = list.listParametros;
        if (listaParam.length > 0 && this.parametros.length === 0) {
          const parametros = <Array<ParametroPeriodo>>listaParam[0]['Data'];
          if (parametros != undefined) {
            parametros.forEach(element => {
              this.parametros.push(element);
            });
            this.cargarEstadoPeriodos();
          }
        }
      },
    );
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
    this.mensajeConfirmacion(`iniciar ${nombreParam} de ${periodo.Nombre}`).then(resp => {
      if (resp.value) {
        const idParametro = this.getIdParametro(nombreParam);
        if (idParametro != 0 && this.getParametroByPerido_Tipo(this.periodos[i].Id, idParametro, null) == undefined) {
          this.listService.inciarParametroPeriodo(periodo, idParametro);
        } else {
          this.ventanaError(`Ya existe ${nombreParam} en el ${periodo.Nombre}`);
        }
      }
    });
  }

  public detenerParametro(i: number, nombreParam: string) {
    let periodo = this.periodos[i];
    this.mensajeConfirmacion(`detener ${nombreParam} de ${periodo.Nombre}`)
      .then(resp => {
        let idParametro = this.getIdParametro(nombreParam);
        if (resp.value && idParametro != 0) {
          let parametro: ParametroPeriodo = this.getParametroByPerido_Tipo(this.periodos[i].Id, idParametro, true);
          if (parametro != undefined) {
            parametro.Activo = false
            this.listService.actualizarInscripcionesPeriodo(parametro);
            this.cargarEstadoPeriodos();
          } else {
            this.ventanaError(`No se encontro ${nombreParam} activo en el ${periodo.Nombre}`);
          }
        }
      });
  }


  public reactivarParametro(i: number, nombreParam: string) {
    let periodo = this.periodos[i]
    this.mensajeConfirmacion(`Reactivar ${nombreParam} de ${periodo.Nombre}`)
      .then(resp => {
        let idParametro = this.getIdParametro(nombreParam);
        if (resp.value && idParametro != 0) {
          let parametro: ParametroPeriodo = this.getParametroByPerido_Tipo(this.periodos[i].Id, idParametro, false);
          if (parametro != undefined) {
            parametro.Activo = true;
            this.listService.actualizarInscripcionesPeriodo(parametro);
            this.cargarEstadoPeriodos();
          } else {
            this.ventanaError(`No se encontro ${nombreParam} activo en el ${periodo.Nombre}`);
          }
        }
      });
  }

  private mensajeConfirmacion(msj: String): Promise<any> {
    return new Promise((resolve) => {
      Swal.fire({
        title: '¿Está seguro?',
        text: '' + msj,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then((result) => resolve(result)).catch(() => resolve(false));
    });
  }
  private ventanaError(msj: String) {
    Swal.fire("Error",
      `<p>${msj}</p>`, "error");
  }
}
