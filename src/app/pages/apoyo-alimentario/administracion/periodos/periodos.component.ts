import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { PeriodosService } from '../../servicios/periodos.service'
import { ActivatedRoute, Router } from '@angular/router';
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

  public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listPA = list.listPeriodoAcademico
        if (listPA.length > 0 && this.periodos.length === 0) {
          const periodos = <Array<Periodo>>listPA[0]['Data'];
          periodos.forEach(element => {
            this.periodos.push(element);
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
          }
        }
      },
    );
  }

  public iniciarParametro(i: number, parametro: string) {
    console.log("Desde iniciar parametro",parametro);
    let periodo = this.periodos[i];
    console.log(i);
    Swal.fire({
      title: 'Está seguro?',
      text: `Está seguro que desea iniciar ${parametro} de ${periodo.Nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }
    ).then(resp => {
      if (resp.value) {
        if (parametro === "inscripciones") {
          this.listService.inciarParametroPeriodo(periodo, environment.IDS.IDINSCRIPCIONES);
        } else if (parametro === "servicio") {
          this.listService.inciarParametroPeriodo(periodo, environment.IDS.IDSERVICIOAPOYO);
        } else if (parametro === "cierre"){
          this.listService.inciarParametroPeriodo(periodo, environment.IDS.IDCIERREPERIODO);
        }
      }
    });
  }
  public detenerParametro(i: number, parametro: string) {
    let periodo = this.periodos[i]
    Swal.fire({
      title: 'Está seguro?',
      text: `Está seguro que desea detener ${parametro} de ${periodo.Nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }
    ).then(resp => {
      let idParametro = 0
      if (parametro === "inscripciones") {
        idParametro = environment.IDS.IDINSCRIPCIONES;
      } else if (parametro === "servicio") {
        idParametro = environment.IDS.IDSERVICIOAPOYO;
      }
      if (resp.value) {
        let parametro: ParametroPeriodo;
        for (parametro of this.parametros) {
          if (this.periodos[i].Id === parametro.PeriodoId.Id) {
            if (parametro.ParametroId.Id == idParametro) {
              if (parametro.Activo) {
                parametro.Activo = false
                this.listService.actualizarInscripcionesPeriodo(parametro);
                break;
              }
            }
          }
        }
      }
    });
  }
  public reactivarParametro(i: number, parametro: string) {
    let periodo = this.periodos[i]
    Swal.fire({
      title: 'Está seguro?',
      text: `Está seguro que desea reactivar ${parametro} de ${periodo.Nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }
    ).then(resp => {
      let idParametro = 0
      if (parametro === "inscripciones") {
        idParametro = environment.IDS.IDINSCRIPCIONES;
      } else if (parametro === "servicio") {
        idParametro = environment.IDS.IDSERVICIOAPOYO;
      }
      if (resp.value) {
        let parametro: ParametroPeriodo;
        for (parametro of this.parametros) {
          if (this.periodos[i].Id === parametro.PeriodoId.Id) {
            if (parametro.ParametroId.Id == idParametro) {
              if (!parametro.Activo) {
                parametro.Activo = true
                this.listService.actualizarInscripcionesPeriodo(parametro);
                break;
              }
            }
          }
        }
      }
    });
  }

  public mostrarIniciarInscripcion(index) {
    if (this.periodos[index].Activo) {
      for (let parametro of this.parametros) {
        if (parametro.PeriodoId.Id === this.periodos[index].Id) {
          if (parametro.ParametroId.Id == environment.IDS.IDINSCRIPCIONES) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }
  public mostrarDetenerInscripcion(index) {
    for (let parametro of this.parametros) {
      if (parametro.PeriodoId.Id === this.periodos[index].Id) {
        if (parametro.ParametroId.Id == environment.IDS.IDINSCRIPCIONES) {
          if (parametro.Activo)
            return true
        }
      }
    }
    return false;
  }

  public mostrarReactivarInscripcion(index) {
    if(this.periodoCerrado(index)){
      return false;
    }else{
    for (let parametro of this.parametros) {
      if (parametro.PeriodoId.Id === this.periodos[index].Id) {
        if (parametro.ParametroId.Id == environment.IDS.IDINSCRIPCIONES) {
          if (!parametro.Activo)
            return true
        }
      }
    }}

    return false;
  }
  public mostrarIniciarServicio(index) {
    if (this.periodos[index].Activo) {
      console.log(this.periodos[index]);
      for (let parametro of this.parametros) {
        if (parametro.PeriodoId.Id === this.periodos[index].Id) {
          if (parametro.ParametroId.Id == environment.IDS.IDSERVICIOAPOYO) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }
  public mostrarDetenerServicio(index) {
    for (let parametro of this.parametros) {
      if (parametro.PeriodoId.Id === this.periodos[index].Id) {
        if (parametro.ParametroId.Id == environment.IDS.IDSERVICIOAPOYO) {
          if (parametro.Activo)
            return true
        }
      }
    }
    return false;
  }
  public mostrarReactivarServicio(index) {
    if(this.periodoCerrado(index)){
      return false;
    }else{

    for (let parametro of this.parametros) {
      if (parametro.PeriodoId.Id === this.periodos[index].Id) {
        if (parametro.ParametroId.Id == environment.IDS.IDSERVICIOAPOYO) {
          if (!parametro.Activo)
            return true
        }
      }
    }}

    return false;
  }
  public mostrarFinalizarPeriodo(index){
    if(this.periodoCerrado(index)){
      return false;
    }else{
      for (let parametro of this.parametros) {
        if (parametro.PeriodoId.Id === this.periodos[index].Id) {
          if (parametro.ParametroId.Id == environment.IDS.IDSERVICIOAPOYO) {
            if (!parametro.Activo)
              return true
          }
        }
      }
    }
    return false;
  }
  public periodoCerrado(index){
    for (let parametro of this.parametros) {
      if (parametro.PeriodoId.Id === this.periodos[index].Id) {
        if (parametro.ParametroId.Id == environment.IDS.IDCIERREPERIODO) {
          if (parametro.Activo)
            return true
        }
      }
    }
    return false;
  }


}
