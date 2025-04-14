import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Util } from 'leaflet';
import { Observable } from 'rxjs/Observable';
import { DocumentoService } from '../../@core/data/documento.service';
import { ReliquidacionHelper } from '../../@core/helpers/reliquidacion/reliquidacionHelper';
import { PopUpManager } from '../../@core/managers/popUpManager';
import { ImplicitAutenticationService } from '../../@core/utils/implicit_autentication.service';
import { NuxeoService } from '../../@core/utils/nuxeo.service';
import { ApiConstanst } from '../../shared/constants/api.constans';
import { RolesConstanst } from '../../shared/constants/roles.constants';
import { DateCustomPipePipe } from '../../shared/pipes/date-custom-pipe.pipe';
import { UtilsService } from '../../shared/services/utils.service';



@Component({
  selector: 'ngx-revision-insc',
  templateUrl: './revision-insc.component.html',
  styleUrls: ['./revision-insc.component.scss']
})
export class RevisionInscComponent implements OnInit {

  @ViewChild('observaciones', { read: null, static: null }) observaciones: TemplateRef<any>;
  @ViewChild('verObservaciones', { read: null, static: null }) verObservaciones: TemplateRef<any>;
  @ViewChild('dialogParametria', { read: null, static: null }) dialogParametria: TemplateRef<any>;

  ROLES_CONSTANTS = RolesConstanst;

  uuidReadFieldName: string;
  uuidDeleteFieldName: string;

  deleteConfirmMessage: string;
  deleteMessage: string;
  loadDataFunction: (...params) => Observable<any>;
  deleteDataFunction: (...params) => Observable<any>;
  formEntity: any;
  formTittle: string;
  updateMessage: string;
  createMessage: string;
  updateConfirmMessage: string;
  createConfirmMessage: string;
  isOnlyCrud: boolean;
  loadFormDataFunction: (...params) => Observable<any>;
  updateEntityFunction: (...params) => Observable<any>;
  createEntityFunction: (...params) => Observable<any>;
  listColumns: object;
  settings: object = {};

  params: any = {};
  terceros: any = {};
  rolesActivos: any = [];
  esRevisionEstudiante: boolean;
  estudiante: any;
  page = 0;
  limit = 10;
  offset = 0;
  recargarTabla: boolean = false;
  registrosPorPagina = 10;
  elementosEncontrados = 0;
  modalObservaciones: any;
  validarObservacion = false;
  idEstadoSolicitud: any;
  observacion: any = {};
  solicitud: any;
  terceroId: any;
  observacionesSolicitud: any = [];
  solicitudAnterior: any;

  constructor(
    private translate: TranslateService,
    private reliquidacionHelper: ReliquidacionHelper,
    private datePipe: DatePipe,
    private route: Router,
    private router: ActivatedRoute,
    private autenticacion: ImplicitAutenticationService,
    private pUpManager: PopUpManager,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    public dialog: MatDialog,
    private dateCustomPipe: DateCustomPipePipe,
  ) {
    this.modalObservaciones = new FormGroup({});
  }

  ngOnInit() {
    this.uuidReadFieldName = '_id';
    this.uuidDeleteFieldName = '_id';
    this.isOnlyCrud = true;
    this.deleteConfirmMessage = 'PRODUCTO.confirmacion_eliminar';
    this.deleteMessage = 'PRODUCTO.mensaje_eliminar';
    this.loadDataFunction = (...evento) => this.obtenerRegistros(evento);
    //this.deleteDataFunction = this.productoHelper.productoDelete;
    //    this.formEntity = FORM_PRODUCTO;
    this.formTittle = 'RUBRO.add-producto';
    this.updateMessage = 'PRODUCTO.mensaje_actualizar';
    this.createMessage = 'PRODUCTO.mensaje_registrar';
    this.updateConfirmMessage = 'PRODUCTO.confirmacion_actualizacion';
    this.createConfirmMessage = 'PRODUCTO.confirmacion_creacion';
    //this.loadFormDataFunction = this.productoHelper.getProductos;
    //this.updateEntityFunction = this.productoHelper.productoUpdate;
    //this.createEntityFunction = this.productoHelper.productoRegister;
    this.listColumns = {
      Codigo: {
        title: 'Código de la solicitud',
        valuePrepareFunction: (cell, dato) => {
          try {
            return dato.SolicitudId.Id;
          } catch (error) {
            console.log(error);
          }
          return '';
        },
      },
      Fecha: {
        title: 'Fecha de radicación',
        valuePrepareFunction: (cell, dato) => {
          try {
            return this.datePipe.transform(UtilsService.parseDate(dato.SolicitudId.FechaRadicacion), 'yyyy-MM-dd');
          } catch (error) {
            console.log(error);
          }
          return '';
        },
      },
      Estado: {
        title: 'Estado',
        type: 'html',
        valuePrepareFunction: (cell, dato) => {
          try {
            let data = '';
            switch (dato.EstadoTipoSolicitudId.EstadoId.Id) {
              case ApiConstanst.ESTADO_SOLICITUD.RECHAZADO:
                data = `<span class="badge badge-danger">${dato.EstadoTipoSolicitudId.EstadoId.Nombre}</span>`;
                break;
              case ApiConstanst.ESTADO_SOLICITUD.REQUIERE_MOD:
                data = `<span class="badge badge-warning">${dato.EstadoTipoSolicitudId.EstadoId.Nombre}</span>`;
                break;
              case ApiConstanst.ESTADO_SOLICITUD.ACEPTADA:
                data = `<span class="badge badge-success">${dato.EstadoTipoSolicitudId.EstadoId.Nombre}</span>`;
                break;
              default:
                data = `<span class="badge badge-info">${dato.EstadoTipoSolicitudId.EstadoId.Nombre}</span>`;
                break;
            }
            return data;
          } catch (error) {
            console.log(error);
          }
          return '';
        },
      },
      Estudiante: {
        title: 'Estudiante',
        // type: 'string;',
        valuePrepareFunction: (cell, dato) => {
          try {
            const dato2 = JSON.parse(dato.SolicitudId.Referencia);
            if (dato2.TerceroId) {
              return dato2.TerceroId.NombreCompleto;
            }
            return 'No se encontro estudiante';
          } catch (error) {
            console.log(error);
          }
          return '';
        },
      },
    };

    this.obtenerRolesYDatos();

  }

  obtenerRolesYDatos() {
    if (this.router.snapshot.data['roles']) {
      for (const rol of this.router.snapshot.data['roles']) {
        this.rolesActivos[rol] = true;
      }
      this.determinarAccionesBotones();
    }
    if (this.router.snapshot.data['esRevisionEstudiante']) {
      this.esRevisionEstudiante = true;
      this.obtenerDatosEstudiante();
    }
  }

  determinarAccionesBotones() {
    if (this.rolesActivos[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE]) {
      this.settings = {
        actions: {
          add: false,
          edit: false,
          delete: false,
          custom: [
            {
              name: 'revisarLiquidacionCustom',
              title: '<i class="nb-search" title="Revisar reliquidación"></i>',
              customFunction: (evento) => this.showReliquidacion(evento)
            },
            {
              name: 'verComentariosCustom',
              title: '<i class="nb-compose" title="Ver comentarios"></i>',
              customFunction: (evento) => this.verObservacionesSolicitud(evento)
            }
          ],
          position: 'right'
        },
        mode: 'external',
        columns: this.listColumns,
      };

    }
    else if (this.rolesActivos[RolesConstanst.ROLES_SISTEMA.ADMIN_BIENESTAR]) {
      this.settings = {
        actions: {
          add: false,
          edit: false,
          delete: false,
          custom: [
            {
              name: 'revisarReliquidacionCustom',
              title: '<i class="nb-search" title="Revisar reliquidación"></i>',
              customFunction: (evento) => this.showReliquidacion(evento)
            },
            {
              name: 'verDocAdjuntosCustom',
              title: '<i class="nb-compose" title="Ver documentos adjuntos reliquidación"></i>',
              customFunction: (evento) => this.obtenerInformacionReliquidacion(evento)
            },
            {
              name: 'estadoCustom',
              title: '<i class="nb-arrow-retweet" title="Cambiar estado reliquidación"></i>',
              customFunction: (evento) => this.updateReliquidacion(evento)
            },
            {
              name: 'deleteCustom',
              title: '<i class="nb-trash" title="Eliminar solicitud reliquidación"></i>',
              customFunction: (evento) => this.deleteReliquidacion(evento)
            }
          ],
          position: 'right'
        },
        mode: 'external',
        columns: this.listColumns,
      };
    }
  }

  obtenerInformacionReliquidacion(evento: any) {
    const data = JSON.parse(evento.SolicitudId.Referencia);
    this.reliquidacionHelper.getSolicitudTercero(data.Id).subscribe((res) => {
      this.descargarArchivos(JSON.parse(res.Dato))
    });
  }

  descargarArchivos(formularioReliquidacion) {
    this.pUpManager.showInfoAlert('Se esta descargando los archivos');
    let archivos: any = [];
    for (const archivo of Object.keys(formularioReliquidacion.documentosCargados)) {
      let aux: any = formularioReliquidacion.documentosCargados[archivo];
      aux.key = archivo;
      archivos.push(aux);
    }
    let terminoDescargar = false;
    this.nuxeoService.getDocumentoById$(archivos, this.documentoService).subscribe((res: Object) => {
      if (Object.keys(res).length === archivos.length && !terminoDescargar) {
        for (const archivo of archivos) {
          window.open(res[archivo.key]);
        }
        terminoDescargar = true;
      }
    });
  }

  nuevaSolicitud() {
    this.route.navigate([`pages/inscripcion`]);
  }

  deleteReliquidacion(evento: any) {
    this.reliquidacionHelper.deleteSolicitud(evento).subscribe((res) => {
      this.recargarTabla = true;
    })
  }

  showReliquidacion(evento?: any) {
    if (evento) {
      const data = JSON.parse(evento.SolicitudId.Referencia);
      if (this.rolesActivos[RolesConstanst.ROLES_SISTEMA.ADMIN_BIENESTAR]) {
        this.route.navigate([`pages/revision/${data.Id}`], { queryParams: { codSolicitud: evento.SolicitudId.Id, codActual: evento.Id } });
      } else if (this.rolesActivos[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE] && evento.EstadoTipoSolicitudId.EstadoId.Id === ApiConstanst.ESTADO_SOLICITUD.RADICADA) {
        this.pUpManager.showInfoToast('Solicitud de reliquidación no puede ser revisada, porque se encuentra en estado RADICADA. Se notificara cuando la solicitud cambie de estado.');
      } else if (this.rolesActivos[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE] && evento.EstadoTipoSolicitudId.EstadoId.Id === ApiConstanst.ESTADO_SOLICITUD.REFORMADA) {
        this.pUpManager.showErrorToast('Solicitud de reliquidación no puede ser revisada, porque se encuentra en estado REFORMADA. Puedes revisar las observaciones');
      } else if (this.rolesActivos[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE] && evento.EstadoTipoSolicitudId.EstadoId.Id === ApiConstanst.ESTADO_SOLICITUD.RECHAZADO) {
        this.pUpManager.showErrorToast('Solicitud de reliquidación no puede ser revisada, porque se encuentra en estado RECHAZADO. Puedes revisar las observaciones');
      } else if (this.rolesActivos[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE] && evento.EstadoTipoSolicitudId.EstadoId.Id === ApiConstanst.ESTADO_SOLICITUD.ACEPTADA) {
        this.pUpManager.showInfoToast('Solicitud de reliquidación no puede ser revisada, porque se encuentra en estado ACEPTADA. Puedes revisar las observaciones');
      } else {
        this.route.navigate([`pages/revision-estudiante/${data.Id}`], { queryParams: { codSolicitud: evento.SolicitudId.Id } });

      }
    }
  }

  updateReliquidacion(evento?: any) {
    this.aniadirObservacion(evento.SolicitudId, evento.TerceroId, evento);
  }

  onChange(event) {

  }

  recargarTablaPage(pagina) {
    this.limit = this.registrosPorPagina * (pagina + 1);
    this.offset = this.limit - this.registrosPorPagina;
    this.recargarTabla = true;
  }


  obtenerDatosEstudiante() {
    this.reliquidacionHelper.getEstudiante(this.autenticacion.getPayload().sub).subscribe((res) => {
      this.estudiante = res[0].TerceroId;
      this.estudiante.documento = this.autenticacion.getPayload().documento;
      this.estudiante.documento_compuesto = this.autenticacion.getPayload().documento_compuesto;
      this.recargarTabla = true;
    });
  }

  obtenerRegistros(evento): any {
    this.params.query = `EstadoTipoSolicitudId.TipoSolicitud.Id:${ApiConstanst.SOLICITUDES.TIPO_SOLICITUD_RELIQUDIACION},Activo:true`;
    if (this.rolesActivos[RolesConstanst.ROLES_SISTEMA.ESTUDIANTE] && this.estudiante) {
      const query = `,TerceroId:${this.estudiante.Id}`;
      this.params.query = `${this.params.query}${query}`
    }
    this.params.offset = this.offset;
    this.params.limit = this.limit;
    this.params.order = 'desc';
    this.params.sortby = 'Id';
    return this.reliquidacionHelper.getSolicitudes(this.params);
  }

  guardarObservacion() {
    if (this.modalObservaciones.invalid) {
      this.validarObservacion = true;
      this.pUpManager.showErrorToast('Formulario no válido');
      return;
    }
    this.solicitudAnterior.Activo = false;
    this.reliquidacionHelper.updateSolicitudEstado(this.solicitudAnterior).subscribe((solicitudAnt) => {
      let observacion: any = { TipoObservacionId: {} };
      observacion.Activo = true;
      observacion.Id = null;
      observacion.SolicitudId = this.solicitud;
      observacion.TerceroId = this.terceroId;
      observacion.TipoObservacionId.Id = this.observacion.tipo_observacion_id;
      observacion.Titulo = 'Observación sobre reliquidación';
      observacion.Valor = this.observacion.valor;
      this.reliquidacionHelper.grabarObservacion(observacion).subscribe((res) => {
        this.grabarSolicitudEstado();
      })
    });
  }

  aniadirObservacion(evento, terceroId, estadoSolicitud) {
    if (evento && terceroId && estadoSolicitud) {
      this.solicitud = evento;
      this.terceroId = terceroId;
      this.solicitudAnterior = estadoSolicitud;
      this.dialog.open(this.observaciones);
    }
  }

  abrirParametria() {
    this.dialog.open(this.dialogParametria);
  }

  verObservacionesSolicitud(evento) {
    if (evento) {
      this.solicitud = evento;
      this.reliquidacionHelper.getObservaciones(this.solicitud).subscribe((observaciones) => {
        this.observacionesSolicitud = observaciones;
      })
      this.dialog.open(this.verObservaciones);
    }
  }

  grabarSolicitudEstado() {
    let solicitudEvolucion: any = {};
    solicitudEvolucion.Activo = true;
    solicitudEvolucion.EstadoTipoSolicitudId = {};
    solicitudEvolucion.EstadoTipoSolicitudId.Id = this.idEstadoSolicitud;
    solicitudEvolucion.EstadoTipoSolicitudIdAnterior = this.solicitud.EstadoTipoSolicitudId || null;
    solicitudEvolucion.Id = null;
    solicitudEvolucion.SolicitudId = this.solicitud;
    solicitudEvolucion.TerceroId = this.terceroId;
    solicitudEvolucion.FechaCreacion = this.dateCustomPipe.transform(new Date());
    solicitudEvolucion.FechaLimite = this.dateCustomPipe.transform(new Date());
    solicitudEvolucion.FechaModificacion = this.dateCustomPipe.transform(new Date());
    this.reliquidacionHelper.grabarSolicitudEvolucion(solicitudEvolucion).subscribe((res2) => {
      this.solicitud.EstadoTipoSolicitudId = solicitudEvolucion.EstadoTipoSolicitudId;
      this.solicitud.FechaCreacion = this.dateCustomPipe.transform(new Date());
      this.solicitud.FechaRadicacion = this.dateCustomPipe.transform(new Date());
      this.solicitud.FechaModificacion = this.dateCustomPipe.transform(new Date());
      this.reliquidacionHelper.actualizarSolicitud(this.solicitud).subscribe((res3) => {
        this.pUpManager.showInfoToast('Observación grabada');
        let ruta = '/pages/revision';
        if (this.rolesActivos[this.ROLES_CONSTANTS.ROLES_SISTEMA.ESTUDIANTE]) {
          ruta = '/pages/revision-estudiante';
        }
        this.dialog.closeAll();
        this.recargarTabla = true;
      });
    });
  }
}
