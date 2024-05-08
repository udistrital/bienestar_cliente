import { Injectable, Output, EventEmitter } from '@angular/core';
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
import { Tercero } from '../data/models/terceros/tercero';
import { ReferenciaSolicitud } from "../data/models/solicitud/referencia-solicitud";
import { DatosIdentificacion } from '../data/models/terceros/datos_identificacion';
import { OikosService } from "../data/oikos.service"
import { AcademicaService } from '../data/academica.service';
import { ApoyoAlimentarioService } from '../data/apoyo-alimentario.service';
import { SolicitudEvolucionEstado } from '../data/models/solicitud/solicitud-evolucion-estado';
import { formatDate } from '@angular/common';
import { Observacion } from '../data/models/solicitud/observacion';
import { InfoComplementariaTercero } from '../data/models/terceros/info_complementaria_tercero';
import { ApoyoAlimentario } from '../data/models/apoyo-alimentario';
import { InfoComplementaria } from '../data/models/terceros/info_complementaria';
import { UbicacionesService } from '../data/ubicaciones.service';
import { Lugar } from '../data/models/lugar/lugar';
import { UtilService } from '../../shared/services/utilService';
import { Paquete } from '../data/models/solicitud/paquete';
import { PaqueteSolicitud } from '../data/models/solicitud/paquete-solicitud';
import { SoportePaquete } from '../data/models/solicitud/soporte-paquete';
import { DocumentoService } from '../data/documento.service';
import Swal from 'sweetalert2';
import { AutenticacionMidService } from '../data/autenticacion_mid.service';
import { UserRol } from '../data/models/userRol';
import { range } from 'rxjs';


@Injectable()

export class ListService {


  @Output() disparadorDeDocumentos: EventEmitter<any> = new EventEmitter();

  constructor(
    private parametrosService: ParametrosService,
    private documentoService: DocumentoService,
    private solicitudService: SolicitudService,
    private tercerosService: TercerosService,
    private oikosService: OikosService,
    private academicaService: AcademicaService,
    private apoyoAlimentarioService: ApoyoAlimentarioService,
    private ubicacionesService: UbicacionesService,
    private utilsService: UtilService,
    private autenticationMidService: AutenticacionMidService
  ) { }

  /*  ****APOYO ALIMENTARIO SERVICE ********** */


  /**
   *Consulta los registro de apoyo alimentario con algunos parametros opcionales
   *
   * @param {number} terceroId
   * @param {number} solicitudId
   * @param {number} espacioFisicoId
   * @param {number} periodoId
   * @param {boolean} activo
   * @param {number} limite
   * @return {*}  {Promise<ApoyoAlimentario[]>}
   * @memberof ListService
   */

  consutarRegitroApoyo(terceroId: number, solicitudId: number, espacioFisicoId: number, periodoId: number, fechaRegistro: string, activo: boolean, limite: number, offset: number): Promise<ApoyoAlimentario[]> {
    return new Promise((resolve, reject) => {

      let queryArr = []
      if (terceroId != null) {
        queryArr.push(`terceroId:${terceroId}`)
      }
      if (solicitudId != null) {
        queryArr.push(`solicitudId:${solicitudId}`)
      }
      if (espacioFisicoId != null) {
        queryArr.push(`espacioFisicoId:${espacioFisicoId}`)
      }
      if (periodoId != null) {
        queryArr.push(`periodoId:${periodoId}`)
      }
      if (activo != null) {
        queryArr.push(`activo:${activo}`)
      }
      if (fechaRegistro != null) {
        if (fechaRegistro != "") {
          queryArr.push(`fechaRegistro:${fechaRegistro}`)
        }
      }

      let query = "";

      if (queryArr.length > 0) {
        query = "?query="
        for (let i = 0; i < queryArr.length; i++) {
          query += queryArr[i]
          if (i + 1 < queryArr.length) {
            query += ','
          }
        }
      }


      this.apoyoAlimentarioService.get(`apoyo_alimentario${query}${(query != "" ? "&" : "?")}sortby=_id&order=desc${limite != null && limite > 0 ? `&limit=${limite}` : ''}${offset != null ? `&offset=${offset}` : ''}`)
        .subscribe(
          (result: any[]) => {
            resolve(result['Data'])
          },
          error => {
            reject(error);
          },
        );
    });
  }

  /* *******TERCEROS SERVICE**************  */

  /**
   *Cargamos un tercero por su ID
   *
   * @param {number} TerceroId
   * @return {*}  {Promise<Tercero>}
   * @memberof ListService
   */
  loadTercero(TerceroId: number): Promise<Tercero> {
    return new Promise((resolve, reject) => {
      if (TerceroId != undefined && TerceroId > 0) {
        this.tercerosService.get(`tercero?query=Id:${TerceroId}`)
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
      } else {
        reject("No se tiene la referencia del tercero");
      }
    });
  }

  /**
   *Cargamos un tercero por su Usuario WSO2
   *
   * @param {string} usuarioWSO2
   * @return {*}  {Promise<Tercero>}
   * @memberof ListService
   */
  loadTerceroByWSO2(usuarioWSO2: string): Promise<Tercero> {
    return new Promise((resolve, reject) => {
      this.tercerosService.get(`tercero?query=UsuarioWSO2:${usuarioWSO2}`)
        .subscribe(
          (res) => {
            if (Object.keys(res[0]).length > 0) {
              resolve(<Tercero>res[0]);
            } else {
              reject("Datos personales no encontrados");
            }
          }, (error) => reject(error));

    });
  }

  /**
   * Carga tercero por numero de Documento 
   *
   * @param {string} documento
   * @return {*}  {Promise<any>}
   * @memberof ListService
   */
  loadTerceroByDocumento(documento: string): Promise<Tercero> {
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


  /* Buscamos documentos asociados a un tercero por la ID  */
  /**
   * Buscamos datos de identificacion por la ID del tercero
   * y el codigo abreviacion del documento (opcional)A
   *
   * @param {number} idTercero
   * @param {String} codAbreviacion
   * @return {*}  {Promise<DatosIdentificacion[]>}
   * @memberof ListService
   */
  findDocumentosTercero(idTercero: number, codAbreviacion: String): Promise<DatosIdentificacion[]> {
    return new Promise((resolve, reject) => {
      this.tercerosService.get(`datos_identificacion?query=TerceroId.Id:${idTercero}${codAbreviacion == null ? "" : ",TipoDocumentoId.CodigoAbreviacion:" + codAbreviacion}`)
        .subscribe(
          (result: any[]) => {
            if (Object.keys(result[0]).length > 0) {
              let documentos: DatosIdentificacion[] = [];
              for (const documento of result) {
                documentos.push(documento);
              }
              resolve(documentos);
            } else {
              reject("No se encuentran datos de identificacion");
            }
          },
          error => {
            reject(error);
          },
        );
    });
  }

  /* Cargamos la vinculacion de un tercero */
  /**
   *Cargamos facultad y proyecto curricular de un tercero por su ID
   *
   * @param {number} terceroId
   * @return {*}  {Promise<string[]>}
   * [facultad, proyecto]
   * @memberof ListService
   */
  loadFacultadProyectoTercero(terceroId: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      /* Cargamos vinculacion*/
      this.tercerosService
        .get(
          `vinculacion?query=TerceroPrincipalId.Id:${terceroId}&sortby=Id&order=desc&limit=-1`
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
                    if (resp[0].Padre && resp[0].Hija) {
                      resolve([resp[0].Padre.Nombre, resp[0].Hija.Nombre]);
                    } else {
                      reject("Problemas de formato en la facultad");
                    }
                  } else {
                    reject("Facultad no encontrada");
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

  /* Cargamos la vinculacion de un tercero */
  /**
   *Cargamos facultad de un tercero por su ID
   *
   * @param {number} terceroId
   * @return {*}  {Promise<string[]>}
   * [facultad]
   * @memberof ListService
   */
   loadFacultadTercero(terceroId: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      /* Cargamos vinculacion*/
      this.tercerosService.get(`vinculacion?query=TerceroPrincipalId.Id:${terceroId}&sortby=Id&order=desc&limit=-1`)
       .subscribe(
          (result) => {
            const dependencia=result[0].DependenciaId;
            this.oikosService.get(`dependencia_padre?query=HijaId.Id:${dependencia}`)
                .subscribe((resp) => {
                  if (Object.keys(resp[0]).length > 0) {
                    if (resp[0].Padre && resp[0].Hija) {
                      resolve(resp[0].Hija.Nombre);
                    } else {
                      reject("Problemas de formato en la facultad");
                    }
                  } else {
                    reject("Facultad no encontrada");
                  }
                },
                  error => {
                    reject(error);
                  });
          }, err => {
            reject(err);
          });
    });
  }

  /* Cargamos las facultades de oikos */
  /**
   *
   * @return {*}  {Promise<string[]>}
   * [facultad]
   * @memberof ListService
   */
   getFacultades(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.oikosService.get(`dependencia?query=DependenciaTipoDependencia.TipoDependenciaId.Nombre:FACULTAD`)
          .subscribe((resp) => {
            let facultades: any[]=[];
            resp.forEach(facultad =>{
              facultades.push(facultad.Nombre);
            })
            resolve(facultades);
          });
    });
}

  /**
   *Busca la informacion de un tercero por su ID
   *
   * @param {number} idTercero
   * @return {*}  {Promise<InfoComplementariaTercero[]>}
   * @memberof ListService
   */
  findInfoComplementariaTercero(idTercero: number): Promise<InfoComplementariaTercero[]> {
    return new Promise((resolve, reject) => {
      if (idTercero != null && idTercero > 0) {
        this.tercerosService.get(`info_complementaria_tercero?query=TerceroId.Id:${idTercero}&limit=-1`).subscribe(
          (result: any[]) => {
            if (Object.keys(result[0]).length > 0) {
              resolve(result);
            }
          },
          error => {
            reject(error);
          },
        );

      } else {
        reject("Id del tercero erronea")
      }
    });
  }

  /**
   *Crear u registro informacion complemantaria tercero
   *
   * @param {InfoComplementariaTercero} infoComp
   * @memberof ListService
   */
  crearInfoComplementariaTercero(infoComp: InfoComplementariaTercero) {
    this.tercerosService.post('info_complementaria_tercero', JSON.stringify(infoComp))
      .subscribe();
  }

  /**
   *Actualiza una informacion complementaria
   *
   * @param {InfoComplementariaTercero} infoComp
   * @memberof ListService
   */
  actualizarInfoComplementaria(infoComp: InfoComplementariaTercero) {
    let id = infoComp.Id;
    this.tercerosService.put('info_complementaria_tercero', JSON.stringify(infoComp), id).subscribe();
  }

  /**
   *Busca la informacion complementaria
   *
   * @param {string} nombreInfoComp
   * @return {*}  {Promise<InfoComplementaria>}
   * @memberof ListService
   */
  findInfoComplementaria(nombreInfoComp: string): Promise<InfoComplementaria> {
    return new Promise((resolve, reject) => {
      this.tercerosService.get(`info_complementaria?query=Nombre:${nombreInfoComp}`).subscribe((resp) => {
        if (Object.keys(resp[0]).length > 0) {
          resolve(resp[0]);
        } else {
          resolve(undefined);
        }
        //resolve(resp[0]);
      }, (error) => reject(error));
    });
  }


  /* ************PARAMETOS SERVICE ********************* */

  /**
   *Carga los periodos academicos
   *
   * @memberof ListService
   */
  public findPeriodosAcademico(): Promise<Periodo[]> {
    return new Promise((resolve, reject) => {
      this.parametrosService.get('periodo/?query=CodigoAbreviacion:PA&sortby=Id&order=desc&limit=-1')
        .subscribe(
          (result: any[]) => {
            if (result['Data'].length > 0)
              resolve(result['Data']);
            else {
              resolve([]);
            }
          },
          error => {
            reject(error);
          });
    });
  }

  /**
   *Carga un periodo academico por su ID
   *
   * @param {number} idPeriodo
   * @return {*}  {Promise<Periodo[]>}
   * @memberof ListService
   */
  findPeriodoAcademico(idPeriodo: number): Promise<Periodo> {
    return new Promise((resolve, reject) => {
      this.parametrosService.get(`periodo/?query=Id:${idPeriodo}&limit=1`)
        .subscribe(
          (result: any) => {
            if (result['Data'].length > 0)
              resolve(result['Data']);
            else {
              resolve(undefined);
            }
          },
          error => {
            reject(error);
          });
    });
  }
  /**
   *Creamos un parametro asociado a un periodo
   *
   * @param {Periodo} periodo
   * @param {number} idParam
   * @return {*}  {Promise<any>}
   * @memberof ListService
   */
  public inciarParametroPeriodo(periodo: Periodo, idParam: number): Promise<any> {
    return new Promise((resolve, reject) => {
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
                resolve(res['Data']);
                /* window.location.reload(); */
              });
          } else {
            reject("Error al cargar el parametro asociado");
          }
        },
          (error: HttpErrorResponse) => {
            reject(error);
          });
    });
  }

  /**
   *Hacemos un update a un Parametro_periodo
   *
   * @param {ParametroPeriodo} parametro
   * @memberof ListService
   */
  public actualizarInscripcionesPeriodo(parametro: ParametroPeriodo) {
    let id = parametro.Id;
    this.parametrosService.put('parametro_periodo', JSON.stringify(parametro), id).subscribe();
  }

  /**
   *Busca parametros
   *
   * @param {number} idNumber
   * @return {*} 
   * @memberof ListService
   */
  findParametrosSp(idNumber: number): Promise<ParametroPeriodo[]> {
    return new Promise((resolve, reject) => {
      this.parametrosService.get(`parametro_periodo?query=ParametroId.TipoParametroId.Id:${idNumber}&sortby=id&order=desc&limit=-1`)
        .subscribe((result: any[]) => {
          if (Object.keys(result['Data'][0]).length > 0) {
            let parametros = <Array<ParametroPeriodo>>result['Data'];
            resolve(result['Data']);
          } else {
            resolve([]);
          }
        },
          error => {
            console.error(error);
            reject(error);
          }
        );
    });
  }

  /**
   *Busca Parametos de apoyo alimentario 
   * Los parametos son opcionales
   * @param {number} idPeriodo
   * @param {number} idTipo
   * @param {boolean} estado
   * @return {*}  {Promise<ParametroPeriodo[]>}
   * @memberof ListService
   */
  findParametrosByPeriodoTipoEstado(idPeriodo: number, idTipo: number, estado: boolean): Promise<ParametroPeriodo[]> {
    return new Promise((resolve, reject) => {
      let query = [];
      if (idTipo == null) {
        query.push(`?query=ParametroId.TipoParametroId.Id:${environment.IDS.IDTIPOPARAMETRO}`)
      } else {
        query.push(`?query=ParametroId.id:${idTipo}`)
      }
      estado != null ? query.push(`Activo:${estado}`) : "";
      idPeriodo != null ? query.push(`PeriodoId.Id:${idPeriodo}`) : "";
      let consulta = "";
      for (let i = 0; i < query.length; i++) {
        consulta += query[i] + (i + 1 == query.length ? "&" : ",");
      }
      this.parametrosService.get(`parametro_periodo${consulta}sortby=id&order=desc&limit=-1`).subscribe(
        (result: any[]) => {
          if (Object.keys(result['Data'][0]).length > 0) {
            resolve(result['Data']);
          } else {
            resolve([]);
          }
        },
        error => {
          reject(`${error.status}. ${error.statusText}`);
        },
      );

    });
  }

  /* ********SOLICITUDES SERVICE*************** */

  /**
   *Crea una solicitud Apoyo Alimentario
   *
   * @param {number} idTercero
   * @param {ReferenciaSolicitud} referenciaSol
   * @memberof ListService
   */
  crearSolicitudApoyoAlimentario(idTercero: number, referenciaSol: ReferenciaSolicitud) {
    Swal.fire({
      title: "Espere",
      html: `Se esta procesando su solicitud`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    const solicitud: Solicitud = new Solicitud();
    solicitud.EstadoTipoSolicitudId = null;
    solicitud.FechaRadicacion = formatDate(new Date(), 'yyyy-MM-dd', 'en');
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
              /* No se si funciona */
              this.crearEvolucionEstado(idTercero, solicitud, null);

              this.loadTiposObservacion(1).then((resp) => {
                /*  Agregar observacion*/

                let observacionObj = new Observacion();
                observacionObj.SolicitudId = solicitud;
                observacionObj.TerceroId = idTercero;
                observacionObj.Titulo = "Nueva Solicitud Creada";
                observacionObj.Valor = "Se crea una nueva solicitud para apoyo alimentario con estado Radicada";
                observacionObj.TipoObservacionId = resp['Data'][0];
                this.crearObservacion(observacionObj).then((resp) => {

                  /** Agregando solicitante */
                  const solicitante: Solicitante = new Solicitante();
                  solicitante.TerceroId = idTercero;
                  solicitante.SolicitudId = solicitud;
                  this.solicitudService.post('solicitante', JSON.stringify(solicitante))
                    .subscribe(res => {
                      //window.location.reload();
                      Swal.close();
                      this.utilsService.showSwAlertSuccess(" Solicitud procesada ", " Se estan cargando los documentos.");
                      /** Disparador para cargar documentos del solicitante */
                      this.disparadorDeDocumentos.emit({
                        data: "carga",
                        newSol: solicitud
                      });
                    });

                }).catch((error) => this.utilsService.showSwAlertError("No se creo la Observación", error));
              }).catch((err) => this.utilsService.showSwAlertError("Observaciones no encontradas", err));



            });
        }
      },
        (error: HttpErrorResponse) => {
          reject(error);
        });
  }

  /**
   *Actualiza una solicitud Apoyo Alimentario
   *
   * @param {number} idTercero
   * @param {Solicitud} solicitud
   * @memberof ListService
   */
  editarSolicitudApoyoAlimentario(idTercero: number, solicitud: Solicitud) {
    Swal.fire({
      title: "Espere",
      html: `Se esta procesando su solicitud`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    this.solicitudService.put('solicitud', JSON.stringify(solicitud), solicitud.Id)
      .subscribe(res => {
        solicitud.Id = res['Data']['Id'];
        /* No se si funciona */
        this.crearEvolucionEstado(idTercero, solicitud, null);

        this.loadTiposObservacion(1).then((resp) => {
          /*  Agregar observacion*/

          let observacionObj = new Observacion();
          observacionObj.SolicitudId = solicitud;
          observacionObj.TerceroId = idTercero;
          observacionObj.Titulo = "Solicitud Actualizada";
          observacionObj.Valor = "Se editaron los datos de la solicitud para apoyo alimentario con estado Radicada";
          observacionObj.TipoObservacionId = resp['Data'][0];
          this.crearObservacion(observacionObj).then((resp) => {

            //window.location.reload();
            Swal.close();
            this.utilsService.showSwAlertSuccess("Edición de Solicitud procesada ", " Se estan actualizando los documentos.");
            /** Disparador para cargar documentos del solicitante */
            this.disparadorDeDocumentos.emit({
              data: "carga",
              newSol: solicitud
            });

          }).catch((error) => this.utilsService.showSwAlertError("No se creo la Observación", error));
        }).catch((err) => this.utilsService.showSwAlertError("Observaciones no encontradas", err));

      });
  }

  /**
   *Busca solicitudes relacionadas a apoyo alimentario
   *
   * @memberof ListService
   */
  findSolicitudes(idEstadoTipo, limite, offSet?, finalizada?: boolean): Promise<Solicitud[]> {
    return new Promise((resolve, reject) => {
      let url = "solicitud"
      if (idEstadoTipo != null) {
        url += "?query=EstadoTipoSolicitudId.Id:" + idEstadoTipo
      } else {
        url += "?query=EstadoTipoSolicitudId.TipoSolicitud.Id:" + environment.IDS.IDTIPOSOLICITUD
      }
      if (finalizada != null) {
        url += ',SolicitudFinalizada:';
        url += finalizada ? 'true' : 'false';
      }
      url += "&sortby=Id&order=desc"
      if (limite > 0 || limite == -1) {
        url += "&limit=" + limite;
      }


      if (offSet != null && offSet > 0) {
        url += "&offset=" + offSet;
      }
      this.solicitudService.get(url)
        .subscribe(
          (result: any[]) => {
            if (Object.keys(result[0]).length > 0) {
              resolve(result);
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

  findSolicitudesbyEstado(): Promise<Solicitud[]> {
    return new Promise((resolve, reject) => {
      this.solicitudService.get(`solicitud?query=EstadoTipoSolicitudId.TipoSolicitud.Id:${environment.IDS.IDTIPOSOLICITUD}`)
        .subscribe(
          (result: any[]) => {
            if (Object.keys(result[0]).length > 0) {
              resolve(result);
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

  /**
   *Carga solicitud por la ID
   *
   * @param {number} idSolicitud
   * @return {*}  {Promise<Solicitud>}
   * @memberof ListService
   */
  loadSolicitud(idSolicitud: number): Promise<Solicitud> {
    return new Promise((resolve, reject) => {
      this.solicitudService.get(`solicitud?query=Id:${idSolicitud}`)
        .subscribe(
          (result: any[]) => {
            if (Object.keys(result[0]).length > 0) {
              resolve(result[0]);
            }
            else {
              reject('No existe una solicitud con este ID');
            }
          },
          error => {
            reject(error)
          },
        );

    });
  }

  /**
   *Carga el solicitante de una solicitud
   *
   * @param {number} idSolicitud
   * @return {*}  {Promise<any>}
   * @memberof ListService
   */
  loadSolicitanteBySolicitud(idSolicitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.solicitudService.get(`solicitante?query=SolicitudId.Id:${idSolicitud}`)
        .subscribe(
          (result: any[]) => {
            if (Object.keys(result[0]).length > 0) {
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

  /**
   *Carga el estado_tipo_solicitud por su ID
   *
   * @param {number} idTipoSol
   * @return {*} 
   * @memberof ListService
   */
  findEstadoTipoSolicitud(idTipoSol: number) {
    return this.solicitudService.get(`estado_tipo_solicitud?query=TipoSolicitud.Id:${idTipoSol}`);
  }

  /**
   *Carga lista de solicitantes  basado en el ID del tercero
   *Se pueden agregar filtros de tipo, periodo y estado
   * 
   * @param {number} IdTercero
   * @param {number} tipoSolicitud
   * @param {String} nomPeriodo
   * @param {boolean} estado
   * @return {*}  {Promise<Solicitante[]>}
   * @memberof ListService
   */
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


  /**
   *Cambia el estado de una solicitud y registra la evolucion
   *
   * @param {Solicitud} solicitud
   * @param {EstadoTipoSolicitud} nuevoEstadoTipo
   * @param {number} idTercero
   * @return {*}  {Promise<EstadoTipoSolicitud>}
   * @memberof ListService
   */
  cambiarEstadoSolicitud(solicitud: Solicitud, nuevoEstadoTipo: EstadoTipoSolicitud, idTercero: number): Promise<EstadoTipoSolicitud> {
    return new Promise((resolve, reject) => {
      let estadoTipoAnterior = solicitud.EstadoTipoSolicitudId;
      solicitud.EstadoTipoSolicitudId = nuevoEstadoTipo;
      this.solicitudService.put('solicitud', JSON.stringify(solicitud), solicitud.Id)
        .subscribe(res => {
          this.crearEvolucionEstado(idTercero, solicitud, estadoTipoAnterior).then((resp) => {
            resolve(nuevoEstadoTipo);
          }).catch((error) => reject(error));
        }, (err => reject(err)));
    });
  }

  /**
   *Actualizar una solicitud
   *
   * @param {Solicitud} solicitud
   * @return {*}  {Promise<any>}
   * @memberof ListService
   */
  actualizarSolicitud(solicitud: Solicitud): Promise<any> {
    return new Promise((resolve, reject) => {
      this.solicitudService.put('solicitud', JSON.stringify(solicitud), solicitud.Id)
        .subscribe(res => {
          resolve(res);
        }, (err => reject(err)));
    });
  }

  /**
   *Crea la evolucion de los estados de una solicitud
   *
   * @private
   * @param {number} idTercero
   * @param {Solicitud} solicitud
   * @param {EstadoTipoSolicitud} anteriorEstado
   * @return {*}  {Promise<any>}
   * @memberof ListService
   */
  private crearEvolucionEstado(idTercero: number, solicitud: Solicitud, anteriorEstado: EstadoTipoSolicitud): Promise<any> {
    return new Promise((resolve, reject) => {
      let see = new SolicitudEvolucionEstado();
      see.TerceroId = idTercero;
      see.SolicitudId = solicitud;
      see.EstadoTipoSolicitudIdAnterior = anteriorEstado;
      see.EstadoTipoSolicitudId = solicitud.EstadoTipoSolicitudId;
      this.solicitudService.post('solicitud_evolucion_estado', JSON.stringify(see))
        .subscribe(res => {
          resolve(true);
        }, error => { reject(error) });
    });
  }

  /**
   *Crea una observacion asociada a una solicitud
   *
   * @param {Observacion} observacion
   * @return {*} 
   * @memberof ListService
   */
  crearObservacion(observacion: Observacion): Promise<Observacion> {
    return new Promise((resolve, reject) => {
      this.solicitudService.post('observacion', JSON.stringify(observacion))
        .subscribe(res => {
          resolve(res['Data']);
        }, error => { reject(error) });
    });

  }

  crearPaquete(paq: Paquete): Promise<number> {
    return new Promise((resolve, reject) => {
      this.solicitudService.post('paquete', JSON.stringify(paq))
        .subscribe(res => {
          resolve(res['Data'].Id);
        }, error => { reject(error) });
    });
  }

  crearPaqueteSolicitud(paqSol: PaqueteSolicitud): Promise<any> {
    return new Promise((resolve, reject) => {
      this.solicitudService.post('paquete_solicitud', JSON.stringify(paqSol))
        .subscribe(res => {
          resolve(true);
        }, error => { reject(error) });
    });
  }

  findPaqueteSolicitudBySolicitud(idSolicitud: number): Promise<PaqueteSolicitud> {
    return new Promise((resolve, reject) => {
      this.solicitudService.get(`paquete_solicitud?query=SolicitudId.Id:${idSolicitud}&sortby=Id&order=desc&limit=1`)
        .subscribe(res => {
          if (Object.keys(res['Data']).length == 0) {
            resolve(undefined);
          }
          resolve(res['Data'][0]);
        }, error => { reject(error) });
    });
  }

  findSoportePaqueteByIdPaquete(idPaquete: number): Promise<SoportePaquete> {
    return new Promise((resolve, reject) => {
      this.solicitudService.get(`soporte_paquete?query=PaqueteId.Id:${idPaquete}&limit=-1`)
        .subscribe(res => {
          if (res['Data'][0] == {}) {
            resolve(undefined);
          }
          resolve(res['Data']);
        }, error => { reject(error) });
    });
  }


  //https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/

  crearSoportePaquete(SopPaq: SoportePaquete): Promise<any> {
    return new Promise((resolve, reject) => {
      this.solicitudService.post('soporte_paquete', JSON.stringify(SopPaq))
        .subscribe(res => {
          resolve(true);
        }, error => { reject(error) });
    });
  }

  /**
   *Carga los tipos de observacion
   *
   * @param {number} idTipo
   * @return {*}  {Promise<any[]>}
   * @memberof ListService
   */
  loadTiposObservacion(idTipo: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let query = "";
      if (idTipo != null) {
        query = `?query=Id:${idTipo}`
      }
      this.solicitudService.get(`tipo_observacion${query}`)
        .subscribe(
          (result: any[]) => {
            resolve(result);
          },
          error => {
            reject(error);
          },
        );
    });
  }

  /**
   *Busca observaciones de una solicitud
   *
   * @param {number} idSolicitud
   * @return {*}  {Promise<Observacion[]>}
   * @memberof ListService
   */
  findObservacion(idSolicitud: number, idTipoObservacion: number): Promise<Observacion[]> {
    return new Promise((resolve, reject) => {
      this.solicitudService.get(`observacion?query=SolicitudId.Id:${idSolicitud},TipoObservacionId.Id:${idTipoObservacion}&sortby=Id&order=asc&limit=-1`)
        .subscribe(
          (result: any[]) => {
            if (Object.keys(result[0]).length == 0) {
              resolve([])
            } else {
              resolve(result)
            }
          },
          error => {
            reject(error)
          },
        );
    });
  }
  /**
   *Busca Evolucion Estado de una solicitud
   *
   * @param {number} idSolicitud
   * @return {*}  {Promise<Observacion[]>}
   * @memberof ListService
   */
  findEvolucionEstado(idSolicitud: number): Promise<SolicitudEvolucionEstado[]> {
    return new Promise((resolve, reject) => {
      this.solicitudService.get(`solicitud_evolucion_estado?query=SolicitudId.Id:${idSolicitud}&sortby=Id&order=asc`)
        .subscribe(
          (result: any[]) => {
            if (Object.keys(result[0]).length == 0) {
              resolve([])
            } else {
              resolve(result)
            }
          },
          error => {
            reject(error)
          },
        );
    });
  }

  /* ******** ACADEMICA SERVICE *********** */

  /**
   *Carga los datos basicos de un tercero
   *
   * @param {number} Idtercero
   * @return {*}  {Promise<any>}
   * @memberof ListService
   */
  cargarEstadoTercero(Idtercero: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.findDocumentosTercero(Idtercero, 'CODE').then((carnet) => {
        if (carnet.length > 0) {
          this.academicaService.get(`datos_basicos_estudiante/${carnet[0]['Numero']}`).subscribe((result) => {
            if (result) {
              if (result.datosEstudianteCollection) {
                resolve(result.datosEstudianteCollection.datosBasicosEstudiante[0].estado);
              }
            }
            reject('No se puede encontrar el estado del estudiante');
          }, (error) => reject(error));
        } else {
          reject("No se encuentra carnet asociado");
        }
      }).catch((error) => reject(error));
    });
  }

  /* ******** DOCUMENTOS SERVICE *********** */

  /**
   *Busca un documento en especifico de un paquete
   *
   * @param {number} idDocumento
   * @return {*}  {Promise<any>}
   * @memberof ListService
   */
  findDocumentoBySoporte(idDocumento): Promise<any> {
    return new Promise((resolve, reject) => {
      this.documentoService.get(`documento?query=Id:${idDocumento}`).subscribe(
        (result) => {
          if (Object.keys(result[0]).length !== 0) {
            resolve(result[0]);
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

  /* ******** UBICACIONES SERVICE *********** */

  /**
   *Carga los datos basicos de un lugar
   *
   * @param {number} Idlugar
   * @return {*}  {Promise<any>}
   * @memberof ListService
   */
  cargarLugar(Idlugar: number): Promise<Lugar> {
    return new Promise((resolve, reject) => {
      this.ubicacionesService.get(`lugar/${Idlugar}`).subscribe((result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })

  }

  /* ***OIRKOS SERVICE ****** */
  cargarSedesApoyo(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.oikosService
        .get(
          `tipo_uso_espacio_fisico?query=TipoUsoId.Nombre:Apoyo,Activo:true&limit=-1`
        )
        .subscribe(
          (result) => {
            if (Object.keys(result[0]).length > 0) {
              let sedesAcceso = []
              for (let i = 0; i < result.length; i++) {
                sedesAcceso.push(result[i].EspacioFisicoId);
              }
              if (sedesAcceso.length > 0) {
                resolve(sedesAcceso)
              } else {
                reject('No se encontraron sedes para apoyo alimentario')
              }
            }
            reject('No se encontraron sedes para apoyo alimentario')
          }, (error) => reject(error));
    });
  }

  /* ****autenticacion_mid ***** */
  getInfoEstudiante(): Promise<UserRol> {
    return new Promise((resolve, reject) => {
      let usuarioWSO2 = this.utilsService.getEmailEstudiante();
      if (usuarioWSO2 != undefined) {
        var user = { "user": usuarioWSO2 };
        var userRol: UserRol;
        this.autenticationMidService.post('/token/userRol', user).subscribe(
          (result) => {
            userRol = result;
            resolve(userRol);
          }, (err) => reject(err)
        )
      } else {
        var err = {
          status: 412,
          msj: "No se encontro el correo"
        }
        reject(err)

      }

    });
  }
}





function reject(error: HttpErrorResponse) {
  throw new Error('Function not implemented.');
}

