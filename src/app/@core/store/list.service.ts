import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from './app.state';
import { REDUCER_LIST } from './reducer.constants';
import { CoreService } from '../data/core.service';
import { ParametrosService } from '../data/parametros.service';
import { TercerosService } from '../data/terceros.service';
import { Periodo } from '../data/models/parametro/periodo';
import { Parametro } from '../data/models/parametro/parametro';
import { ParametroPeriodo } from '../data/models/parametro/parametro_periodo';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()

export class ListService {

  constructor(
    private coreService: CoreService,
    private parametrosService: ParametrosService,
    private tercerosService: TercerosService,
    private store: Store<IAppState>
  ) { }

  public findPeriodosAcademico() {
    this.store.select(REDUCER_LIST.PeriodoAcademico).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.parametrosService.get('periodo/?query=CodigoAbreviacion:PA&sortby=Id&order=desc&limit=-1')
            .subscribe(
              (result: any[]) => {
                console.info('Entro')
                console.info(result)
                this.addList(REDUCER_LIST.PeriodoAcademico, result);
              },
              error => {
                this.addList(REDUCER_LIST.PeriodoAcademico, []);
              },
            );
        }
      },
    );
  }
  public findTerceroInfo() {
    this.store.select(REDUCER_LIST.EstadoCivil).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:2')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.EstadoCivil, result);
              },
              error => {
                this.addList(REDUCER_LIST.EstadoCivil, []);
              },
            );
        }
      },
    );
  }
  public inciarInscripcionesPeriodo(periodo: Periodo) {
    const paramPeriodo: ParametroPeriodo = new ParametroPeriodo();
    paramPeriodo.PeriodoId = periodo;

    this.parametrosService.get('parametro?query=id:347')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          console.info(res);
          const parametro = <Parametro>res['Data'][0];
          console.info(parametro);
          console.info(parametro.TipoParametroId);
          paramPeriodo.ParametroId = parametro
          this.parametrosService.post('parametro_periodo', JSON.stringify(paramPeriodo))
            .subscribe(res => {
              console.info(res);
            });
        }
      },
        (error: HttpErrorResponse) => {
          reject(error);
        });




  }






  private addList(type: string, object: Array<any>) {
    this.store.dispatch({
      type: type,
      payload: object,
    });
  }
}
function reject(error: HttpErrorResponse) {
  throw new Error('Function not implemented.');
}

