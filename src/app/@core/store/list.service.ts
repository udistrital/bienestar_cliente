import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from './app.state';
import { REDUCER_LIST } from './reducer.constants';
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
import { ImplicitAutenticationService } from '../utils/implicit_autentication.service';
import { Tercero } from '../data/models/terceros/tercero';
import { ReferenciaSolicitud } from "../data/models/solicitud/referencia-solicitud";
import { DatosIdentificacion } from '../data/models/terceros/datos_identificacion';
import { OikosService } from "../data/oikos.service"
import { AcademicaService } from '../data/academica.service';

@Injectable()

export class ListService {
  constructor(
    private parametrosService: ParametrosService,
    private solicitudService: SolicitudService,
    private tercerosService: TercerosService,
    private oikosService: OikosService,
    private academicaService: AcademicaService,
    private store: Store<IAppState>
  ) { }

  public findPeriodosAcademico() {
    this.store.select(REDUCER_LIST.PeriodoAcademico).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.parametrosService.get('periodo/?query=CodigoAbreviacion:PA&sortby=Id&order=desc&limit=-1')
            .subscribe(
              (result: any[]) => {
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

  public inciarParametroPeriodo(periodo: Periodo, idParam: number) {
    const paramPeriodo: ParametroPeriodo = new ParametroPeriodo();
    paramPeriodo.PeriodoId = periodo;

    this.parametrosService.get(`parametro?query=id:${idParam}`)
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          const parametro = <Parametro>res['Data'][0];
          paramPeriodo.ParametroId = parametro
          this.parametrosService.post('parametro_periodo', JSON.stringify(paramPeriodo))
            .subscribe(res => {
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
    this.parametrosService.put('parametro_periodo', JSON.stringify(parametro), id).subscribe();
  }

  /*  public findParametros() {
     this.store.select(REDUCER_LIST.Parametros).subscribe(
       (list: any) => {
         if (!list || list.length === 0) {
           this.parametrosService.get('parametro_periodo?query=ParametroId.TipoParametroId.id:21')
             .subscribe(
               (result: any[]) => {
                 if (Object.keys(result['Data'][0]).length > 0) {
                   this.addList(REDUCER_LIST.Parametros, result);
                 } else {
                   this.addList(REDUCER_LIST.Parametros, []);
                 }
               },
               error => {
                 this.addList(REDUCER_LIST.Parametros, []);
               },
             );
         }
       },
     );
   } */

  findParametros() {
    this.store.select(REDUCER_LIST.Parametros).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.parametrosService.get(`parametro_periodo?query=ParametroId.TipoParametroId.Id:${environment.IDS.IDTIPOPARAMETRO}&sortby=id&order=desc&limit=-1`)
            .subscribe(
              (result: any[]) => {
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

  findParametrosSp(idNumber: number) {
    return this.parametrosService.get(`parametro_periodo?query=ParametroId.TipoParametroId.Id:${idNumber}&sortby=id&order=desc&limit=-1`)
  }

  findParametrosByPeriodoTipoEstado(idPeriodo: number, idTipo: number, estado: boolean): Promise<ParametroPeriodo[]> {
    return new Promise((resolve, reject) => {
      let query = [];
      idTipo != null ? query.push(`ParametroId.id:${idTipo}`) : "";
      estado != null ? query.push(`Activo:${estado}`) : "";
      idPeriodo != null ? query.push(`PeriodoId.Id:${idPeriodo}`) : "";
      let consulta = "";
      for (let i = 0; i < query.length; i++) {
        consulta += query[i] + (i + 1 == query.length ? "&" : ",");
      }
      this.parametrosService.get(`parametro_periodo?query=${consulta}sortby=id&order=desc&limit=-1`).subscribe(
        (result: any[]) => {
          console.log(result['Data']);
          if (Object.keys(result['Data']).length > 0) {
            resolve(result['Data']);
          } else {
            resolve([]);
          }
        },
        error => {
          reject(error);
        },
      );

    });
  }


  findParametroPeriodo(idNumber: number) {
    this.store.select(REDUCER_LIST.Parametros).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          /* this.parametrosService.get(`parametro_periodo?query=ParametroId.id:${idNumber},Activo:true&sortby=id&order=desc&limit=-1`) */
          this.parametrosService.get(`parametro_periodo?query=ParametroId.id:${idNumber}&sortby=id&order=desc&limit=1`)
            .subscribe(
              (result: any[]) => {
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

  findParametroPeriodoSp(idNumber: number): Observable<any[]> {
    return this.parametrosService.get(`parametro_periodo?query=ParametroId.id:${idNumber},Activo:true&sortby=id&order=desc&limit=1`)
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
  crearSolicitudApoyoAlimentario(idTercero: number, referenciaSol: ReferenciaSolicitud) {
    const solicitud: Solicitud = new Solicitud();
    solicitud.EstadoTipoSolicitudId = null;
    this.solicitudService.get(`estado_tipo_solicitud?query=Id:${environment.IDS.IDSOLICITUDRADICADA}`)
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          const estadoTipoSol = <EstadoTipoSolicitud>res['Data'][0];
          solicitud.EstadoTipoSolicitudId = estadoTipoSol;
          solicitud.setReferencia(referenciaSol);
          this.solicitudService.post('solicitud', JSON.stringify(solicitud))
            .subscribe(res => {
              solicitud.Id = res['Data']['Id']
              const solicitante: Solicitante = new Solicitante();
              solicitante.TerceroId = idTercero;
              solicitante.SolicitudId = solicitud;
              this.solicitudService.post('solicitante', JSON.stringify(solicitante))
                .subscribe(res => {
                  window.location.reload();
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


  loadSolicitud(idSolicitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.solicitudService.get(`solicitud?query=Id:${idSolicitud}`)
        .subscribe(
          (result: any[]) => {
            console.log(result);
            if (result.length > 0) {
              resolve(result[0]);
            }
            else {
              resolve(undefined);
            }
          },
          error => {
            reject(error)
          },
        );

    });
  }

  loadSolicitanteBySolicitud(idSolicitud: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.solicitudService.get(`solicitante?query=SolicitudId.Id:${idSolicitud}`)
        .subscribe(
          (result: any[]) => {
            if (result.length > 0) {
              resolve(result[0]);
            }
            else {
              resolve(undefined);
            }
          },
          error => {
            reject(error);
          },
        );
    });

  }

  findSolicitudTercero(idTercero: number) {
    this.store.select(REDUCER_LIST.SolicitudTercero).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.solicitudService.get(`solicitante?query=TerceroId:${idTercero}`)
            .subscribe(
              (result: any[]) => {
                let solicitante: Solicitante;
                for (solicitante of result) {
                  const solicitud: Solicitud = solicitante.SolicitudId;
                  if (solicitud.EstadoTipoSolicitudId.Id === environment.IDS.IDSOLICITUDRADICADA) {
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

  findSolicitudTerceroSp(idTercero: number): any {
    this.solicitudService.get(`solicitante?query=TerceroId:${idTercero}`)
      .subscribe(
        (result: any[]) => {
          let solicitante: Solicitante;
          for (solicitante of result) {
            const solicitud: Solicitud = solicitante.SolicitudId;
            if (solicitud.EstadoTipoSolicitudId.Id === environment.IDS.IDSOLICITUDRADICADA) {
              return solicitud;
            }
          }
          return null;
        },
        error => {
          this.addList(REDUCER_LIST.SolicitudTercero, []);
        },
      );
  }


  findEstadoTipoSolicitud(idTipoSol: number) {
    return this.solicitudService.get(`estado_tipo_solicitud?query=TipoSolicitud.Id:${idTipoSol}`);
  }


  loadSolicitanteByIdTercero(IdTercero: number, tipoSolicitud: number, nomPeriodo: String, estado: boolean): Promise<Solicitante[]> {
    return new Promise((resolve, reject) => {
      this.solicitudService
        .get(`solicitante?query=TerceroId:${IdTercero}`)
        .subscribe(
          (result: any[]) => {
            let solicitante: Solicitante;
            if (Object.keys(result[0]).length > 0) {
              /* Consultamos las solicitudes de un solicitante */
              let listSolicitantes = [];
              for (solicitante of result) {
                const sol: Solicitud = solicitante.SolicitudId;
                if (sol.EstadoTipoSolicitudId.TipoSolicitud.Id == environment.IDS.IDTIPOSOLICITUD) {
                  /* Se busca una solicitud radicada */
                  if (tipoSolicitud == null ||
                    sol.EstadoTipoSolicitudId.Id ==
                    tipoSolicitud
                  ) {
                    /* Se busca una referencia correspondiente al periodo actual */
                    let refSol: ReferenciaSolicitud;
                    try {
                      refSol = JSON.parse(sol.Referencia);
                      if (refSol != null) {
                        if (nomPeriodo == null || refSol.Periodo === nomPeriodo) {
                          if (estado == null || sol.Activo == estado) {
                            listSolicitantes.push(solicitante);
                          }
                        }
                      }
                    } catch (error) {
                      console.error(error);
                    }
                  }
                }
              }
              if (listSolicitantes.length > 0) {
                resolve(listSolicitantes);
              }
              resolve([]);
            } else {
              resolve([]);
            }
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  loadSolicitudSolicitante_Periodo(terceroId: number, nomPeriodo: String): Promise<any> {
    return new Promise((resolve, reject) => {
      /* Cargamos solicitud */
      this.solicitudService
        .get(`solicitante?query=TerceroId:${terceroId}`)
        .subscribe(
          (result: any[]) => {
            let solicitante: Solicitante;
            if (Object.keys(result[0]).length > 0) {
              /* Consultamos las solicitudes de un solicitante */
              for (solicitante of result) {
                const sol: Solicitud = solicitante.SolicitudId;
                /* Se busca una solicitud radicada */
                if (sol.EstadoTipoSolicitudId.TipoSolicitud.Id === environment.IDS.IDTIPOSOLICITUD) {
                  /* Se busca una referencia correspondiente al periodo actual */
                  let refSol: ReferenciaSolicitud;
                  try {
                    refSol = JSON.parse(sol.Referencia);
                    if (refSol != null) {
                      if (refSol.Periodo === nomPeriodo) {
                        resolve(sol);
                      }
                    }
                  } catch (error) {
                    reject(error);
                  }
                }

              }
              reject("No se encontro ningunas solicitud asociada al " + nomPeriodo);

            } else {
              reject("El usuario no tiene solicitudes");
            }
          });
    });
  }


  loadTercero(TerceroId: number): Promise<Tercero> {
    return new Promise((resolve, reject) => {
      this.tercerosService.get(`tercero?query=Id:${TerceroId}`)
        .subscribe(
          (result: any[]) => {
            console.log(result)
            if (result.length > 0) {
              resolve(result[0]);
            }
            else {
              resolve(undefined);
            }
          },
          error => {
            reject(error);
          },
        );
    });

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

  findTerceroEmail() {
    let autenticacion = new ImplicitAutenticationService;
    if (autenticacion.live()) {
      const usuarioWSO2 = (autenticacion.getPayload()).email
        ? ((autenticacion.getPayload()).email.split('@')).shift()
        : (autenticacion.getPayload()).sub;

      this.store.select(REDUCER_LIST.TerceroLog).subscribe(
        (list: any) => {
          if (!list || list.length === 0) {
            this.tercerosService.get(`tercero?query=UsuarioWSO2:${usuarioWSO2}`)
              .subscribe(
                (result: any[]) => {
                  let tercero: Tercero;
                  for (tercero of result) {
                    this.addList(REDUCER_LIST.TerceroLog, [tercero]);
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
  }

  findDocumentoTercero(idTercero: number): any {
    this.tercerosService.get(`datos_identificacion?query=TerceroId.Id:${idTercero}`)
      .subscribe(
        (result: any[]) => {
          let documento: DatosIdentificacion;
          for (documento of result) {
            this.addList(REDUCER_LIST.DatosIdentificacionTercero, [documento]);
            /* const solicitud: Solicitud = documento.SolicitudId;
            if (solicitud.EstadoTipoSolicitudId.Id === environment.IDS.IDSOLICITUDRADICADA) {
              return solicitud;
            } */
          }
          return null;
        },
        error => {
          this.addList(REDUCER_LIST.DatosIdentificacionTercero, []);
        },
      );

  }

  /* Carga informacion un tercero */
  loadTerceroByDocumento(documento: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tercerosService
        .get(`datos_identificacion?query=Numero:${documento}`)
        .subscribe(
          (result) => {
            resolve(result[0].TerceroId);
          },
          (error: HttpErrorResponse) => {
            reject(error);
          }
        );
    });
  }

  loadFacultadTercero(Id: number) {
    return new Promise((resolve, reject) => {
      /* Cargamos vinculacion*/
      this.tercerosService
        .get(
          `vinculacion?query=TerceroPrincipalId.Id:${Id}&sortby=Id&order=desc&limit=-1`
        )
        .subscribe(
          (result) => {
            let vinculacionDep = 0;
            for (let i = 0; i < result.length; i++) {
              if (Object.keys(result[i]).length > 0) {
                if (result[i].TipoVinculacionId == 346) {
                  vinculacionDep = result[i].DependenciaId;
                  break;
                }
              }
            }
            /* Si se encuenta vinculacion como estudiante a un departamento */
            if (vinculacionDep != 0) {
              /* Cargamos facultad y proyecto */
              this.oikosService.get(`dependencia_padre?query=HijaId.Id:${vinculacionDep}`)
                .subscribe((resp) => {
                  if (Object.keys(resp[0]).length > 0) {
                    resolve(resp[0].PadreId.Nombre);
                  } else {
                    reject("Dependencia padre no encontrada");
                  }
                },
                  error => {
                    reject(error);
                  });
            } else {
              reject("Vinculacion del estudiante no encontrada");
            }
          }, err => {
            reject(err);
          });
    });
  }

  cargarCarnetTecero(Idtercero: number, CodAbreviacion: String) {
    return new Promise((resolve, reject) => {
      this.tercerosService
        .get(
          `datos_identificacion?query=TerceroId.Id:${Idtercero},TipoDocumentoId.CodigoAbreviacion:${CodAbreviacion}&sortby=id&order=desc`
        )
        .subscribe(
          (result) => {
            if (Object.keys(result[0]).length > 0) {
              resolve(result[0]);
            } else {
              resolve(undefined);
            }
          },
          (error: HttpErrorResponse) => {
            reject(error);
          }
        );
    });
  }

  buscarSolicitudTercero(Id: number) {
    throw new Error("Method not implemented.");
  }

  cargarEstadoTercero(Idtercero: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cargarCarnetTecero(Idtercero, 'CODE').then((carnet) => {
        if (carnet != undefined) {
          this.academicaService.get(`datos_basicos_estudiante/${carnet['Numero']}`).subscribe((result) => {
            /* Cambiar por A */
            resolve(result.datosEstudianteCollection.datosBasicosEstudiante[0].estado);
          });
        } else {
          reject("No se encuentra carnet asociado");
        }
      }).catch((error) => reject(error));


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

