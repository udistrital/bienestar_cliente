import { Component, OnInit } from '@angular/core';

import { NgControlStatusGroup, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable, range } from 'rxjs';
import { PeriodosService } from '../../servicios/periodos.service'
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo'
import { IAppState } from '../../../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';


@Component({
  selector: 'ngx-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.scss']
})
export class PeriodosComponent implements OnInit {
  idInscripciones = 347
  idServicio = 348
  periodos: Periodo[] = []
  parametros: ParametroPeriodo[] = []
  constructor(private periodosService: PeriodosService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<IAppState>,
    private listService: ListService) {
    this.listService.findPeriodosAcademico();
    this.listService.findParametros();
    this.loadLists();
    this.loadParametros();
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
          parametros.forEach(element => {
            this.parametros.push(element);
          })
        }
      },
    );

  }
 

  ngOnInit(): void {

  }
  public iniciarParametro(i: number,parametro: string) {
    let periodo= this.periodos[i];
    Swal.fire({
      title: 'Está seguro?',
      text: `Está seguro que desea iniciar ${parametro} de ${periodo.Nombre}`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }
    ).then(resp => {
      if (resp.value) {
        if(parametro==="inscripciones"){
          this.listService.inciarParametroPeriodo(periodo,this.idInscripciones);             
        }else if(parametro==="servicio"){
          this.listService.inciarParametroPeriodo(periodo,this.idServicio);             
        }
      }
    });
  }
  public detenerParametro(i: number,parametro: string) {
    let periodo= this.periodos[i]
    Swal.fire({
      title: 'Está seguro?',
      text: `Está seguro que desea detener ${parametro} de ${periodo.Nombre}`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }
    ).then(resp => {
      let idParametro=0
      if(parametro==="inscripciones"){
        idParametro=this.idInscripciones;       
      }else if(parametro==="servicio"){
        idParametro=this.idServicio;            
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
  public reactivarParametro(i: number,parametro: string) {
    let periodo= this.periodos[i]
    Swal.fire({
      title: 'Está seguro?',
      text: `Está seguro que desea reactivar ${parametro} de ${periodo.Nombre}`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }
    ).then(resp => {
      let idParametro=0
      if(parametro==="inscripciones"){
        idParametro=this.idInscripciones;       
      }else if(parametro==="servicio"){
        idParametro=this.idServicio;            
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
      if (this.parametros.length > 0) {
        for (let parametro of this.parametros) {
          if (parametro.PeriodoId.Id === this.periodos[index].Id) {
            if (parametro.ParametroId.Id == this.idInscripciones) {
              return false;
            }
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
        if (parametro.ParametroId.Id == this.idInscripciones) {
          if (parametro.Activo)
            return true
        }
      }
    }

    return false;
  }

  public mostrarReactivarInscripcion(index) {
    for (let parametro of this.parametros) {
      if (parametro.PeriodoId.Id === this.periodos[index].Id) {
        if (parametro.ParametroId.Id == this.idInscripciones) {
          if (!parametro.Activo)
            return true
        }
      }
    }

    return false;
  }
  public mostrarIniciarServicio(index) {
    if (this.periodos[index].Activo) {
      if (this.parametros.length > 0) {
        for (let parametro of this.parametros) {
          if (parametro.PeriodoId.Id === this.periodos[index].Id) {
            if (parametro.ParametroId.Id == this.idServicio) {
              return false;
            }
          }
        }
      }
      return true;
    }
    return false;
  }


}
