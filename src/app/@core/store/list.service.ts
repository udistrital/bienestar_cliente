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
import { Solicitante } from '../data/models/solicitud/solicitante';
import { HttpErrorResponse } from '@angular/common/http';
import { Solicitud } from '../data/models/solicitud/solicitud';
import { SolicitudService } from '../data/solicitud.service';
import { EstadoTipoSolicitud } from '../data/models/solicitud/estado-tipo-solicitud';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()

export class ListService {
  constructor(
    private coreService: CoreService,
    private parametrosService: ParametrosService,
    private solicitudService: SolicitudService,
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
  public inciarParametroPeriodo(periodo: Periodo, idParam: number) {
    const paramPeriodo: ParametroPeriodo = new ParametroPeriodo();
    paramPeriodo.PeriodoId = periodo;

    this.parametrosService.get(`parametro?query=id:${idParam}`)
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
              window.location.reload();
            });
        }
      },
        (error: HttpErrorResponse) => {
          reject(error);
        });
  }

  public actualizarInscripcionesPeriodo(parametro: ParametroPeriodo) {
    let id = parametro.Id;
    this.parametrosService.put('parametro_periodo', JSON.stringify(parametro), id)
      .subscribe(res => {
        console.info(res);
      });
  }

  public findParametros() {
    this.store.select(REDUCER_LIST.Parametros).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.parametrosService.get('parametro_periodo?query=ParametroId.TipoParametroId.id:21')
            .subscribe(
              (result: any[]) => {
                console.info('Entro')
                console.info(result)
                this.addList(REDUCER_LIST.Parametros, result);
              },
              error => {
                this.addList(REDUCER_LIST.Parametros, []);
              },
            );
        }
      },
    );
  }

  findParametroPeriodo(idNumber: number) {
    console.info(idNumber);
    this.store.select(REDUCER_LIST.Parametros).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.parametrosService.get(`parametro_periodo?query=ParametroId.id:${idNumber}&sortby=id&order=desc&limit=1`)
            .subscribe(
              (result: any[]) => {
                console.info('Entro')
                console.info(result)
                this.addList(REDUCER_LIST.Parametros, result);
              },
              error => {
                this.addList(REDUCER_LIST.Parametros, []);
              },
            );
        }
      },
    );
  }


  /* findServicioApoyo() {
    this.store.select(REDUCER_LIST.ServicioApoyo).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.parametrosService.get('parametro_periodo?query=ParametroId.id%3A348%2Cactivo%3Atrue&sortby=Id&order=desc&limit=1')
            .subscribe(
              (result: any[]) => {
                console.info('Entro')
                console.info(result)
                this.addList(REDUCER_LIST.ServicioApoyo, result);
              },
              error => {
                this.addList(REDUCER_LIST.ServicioApoyo, []);
              },
            );
        }
      },
    );
  } */
  async crearSolicitudApoyoAlimentario(idTercero: number) {
    const solicitud: Solicitud = new Solicitud();
    const idSolicitud = 23;
    solicitud.EstadoTipoSolicitudId = null;
    this.solicitudService.get(`estado_tipo_solicitud?query=Id:${idSolicitud}`)
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          console.info(res);
          const estadoTipoSol = <EstadoTipoSolicitud>res['Data'][0];
          console.info(estadoTipoSol);
          solicitud.EstadoTipoSolicitudId = estadoTipoSol
          this.solicitudService.post('solicitud', JSON.stringify(solicitud))
            .subscribe(res => {
              solicitud.Id = res['Data']['Id']
              const solicitante: Solicitante = new Solicitante();
              solicitante.TerceroId = idTercero;
              solicitante.SolicitudId = solicitud;
              this.solicitudService.post('solicitante', JSON.stringify(solicitante))
                .subscribe(res => {
                  console.info(res)
                })

            });
        }
      },
        (error: HttpErrorResponse) => {
          reject(error);
        });
  }
  findSolicitudesRadicadas() {
    this.store.select(REDUCER_LIST.SolicitudesRadicadas).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.solicitudService.get(`solicitud?query=EstadoTipoSolicitudId.Id:${environment.IDS.IDSOLICITUDRADICADA}`)
            .subscribe(
              (result: any[]) => {
                console.info('Entro')
                console.info(result)
                this.addList(REDUCER_LIST.SolicitudesRadicadas, result);
              },
              error => {
                this.addList(REDUCER_LIST.SolicitudesRadicadas, []);
              },
            );
        }
      },
    );
  }
  findSolicitudTercero(idTercero: number) {
    this.store.select(REDUCER_LIST.SolicitudTercero).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.solicitudService.get(`solicitante?query=TerceroId:${idTercero}`)
            .subscribe(
              (result: any[]) => {
                console.info('Entro solicitante')
                console.info(result)
                let solicitante: Solicitante;
                for (solicitante of result) {
                  console.info(solicitante);
                  const solicitud: Solicitud =solicitante.SolicitudId;
                  if(solicitud.EstadoTipoSolicitudId.Id===environment.IDS.IDSOLICITUDRADICADA){
                    this.addList(REDUCER_LIST.SolicitudTercero, [solicitud]); 
                    break;   
                  }
                }
              },
              error => {
                this.addList(REDUCER_LIST.SolicitudTercero, []);
              },
            );
        }
      },
    );
  }

  findSolicitudTerceroSync(idTercero: number) {
    let returnGet: any[];
   this.solicitudService.get(`solicitante?query=TerceroId:${idTercero}`)
    console.info('Entro solicitante Sync')
    console.info(returnGet)
            /* .subscribe(
              (result: any[]) => {
                console.info('Entro solicitante')
                console.info(result)
                let solicitante: Solicitante;
                for (solicitante of result) {
                  console.info(solicitante);
                  const solicitud: Solicitud =solicitante.SolicitudId;
                  if(solicitud.EstadoTipoSolicitudId.Id===environment.IDS.IDSOLICITUDRADICADA){
                    this.addList(REDUCER_LIST.SolicitudTercero, [solicitud]); 
                    break;   
                  }
                }
              },
              error => {
                this.addList(REDUCER_LIST.SolicitudTercero, []);
              },
            );  */
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

