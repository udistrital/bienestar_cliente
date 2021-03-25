import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ImplicitAutenticationService } from '../../@core/utils/implicit_autentication.service';
import { ReliquidacionHelper } from '../../@core/helpers/reliquidacion/reliquidacionHelper';
import { ApiConstanst } from '../../shared/constants/api.constans';
import { PopUpManager } from '../../@core/managers/popUpManager';
import { NuxeoApiHelper } from '../../@core/helpers/reliquidacion/nuxeoApiHelper';
import { NuxeoService } from '../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../@core/data/documento.service';
import { DateCustomPipePipe } from '../../shared/pipes/date-custom-pipe.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesConstanst } from '../../shared/constants/roles.constants';
import { NbToastrService } from '@nebular/theme';
import { Tercero } from '../../@core/data/models/terceros/tercero';

@Component({
    selector: 'ngx-inscripcion-est',
    styleUrls: ['./inscripcion-est.component.scss'],
    templateUrl: './inscripcion-est.component.html',
})
export class InscripcionEstComponent implements OnInit {
    facultades: Array<string> = ['ARTES ASAB', 'CIENCIAS Y EDUCACIÓN'];
    proyectos: Array<string> = ['Sistematizacion de datos', 'Industrial', 'Eléctrica', 'Mecánica'];
    localidades: Array<string> = ['Bosa', 'Usme', 'Ciudad Bolivar', 'Kennedy'];
    municipios: Array<string> = ['Bogota', 'Sumapaz', 'Otros'];
    estadocivil: Array<string> = ['Soltero', 'Casado', 'Separado'];

    formulario: FormGroup;
    modalObservaciones: FormGroup;
    observacion: any = {};
    estadoSolicitud: any = {};
    idEstadoSolicitud: any;

    @ViewChild('dialogo', { read: null, static: null }) dialogo: TemplateRef<any>;
    @ViewChild('observaciones', { read: null, static: null }) observaciones: TemplateRef<any>;

    estudiante: any;
    validar = false;
    validarObservacion = false;

    APP_CONSTANTS = ApiConstanst;
    bodyReliquidacion: any;
    formularioReliquidacion: any = {
        documentosCargados: {}
    };
    rolesActivos: any = {};
    ROLES_CONSTANTS = RolesConstanst;
    deshabilitar: any = {};
    solicitud: any;

    constructor(
        private httpClient: HttpClient,
        private dialog: MatDialog,
        public reliquidacionHelper: ReliquidacionHelper,
        private autenticacion: ImplicitAutenticationService,
        private pUpManager: PopUpManager,
        public nuxeoHelper: NuxeoApiHelper,
        private nuxeoService: NuxeoService,
        private documentoService: DocumentoService,
        private dateCustomPipe: DateCustomPipePipe,
        private route: ActivatedRoute,
        private toastrService: NbToastrService,
        private router: Router,
    ) {
        this.formulario = new FormGroup({});
        this.modalObservaciones = new FormGroup({});
    }

    obtenerDataIngreso() {
        if (this.route.snapshot.data['roles']) {
            for (const rol of this.route.snapshot.data['roles']) {
                this.rolesActivos[rol] = true;
            }
        }
        if (this.route.snapshot.data['esRevision']) {
            this.route.params.subscribe((params) => {
                if (params.id) {
                    this.obtenerInformacionReliquidacion(params.id);
                }
            });
            this.route.queryParams.subscribe((params) => {
                if (params.codSolicitud) {
                    this.obtenerSolicitud(params.codSolicitud);
                }
            });
            this.deshabilitar.esRevision = true;
        }
    }

    ngOnInit() {
        this.getInfoComplementariaSolicitudes();
        this.obtenerDataIngreso();
        this.getInfoEstudiante();
    }


    obtenerInformacionReliquidacion(id: any) {
        this.reliquidacionHelper.getSolicitudTercero(id).subscribe((res) => {
            this.formularioReliquidacion = JSON.parse(res.Dato);
            this.estudiante = res.TerceroId;
        });
    }

    obtenerSolicitud(id: any) {
        this.reliquidacionHelper.getSolicitud(id).subscribe((res) => {
            this.solicitud = res;
        });
    }

    getInfoComplementariaSolicitudes() {
        this.reliquidacionHelper.obtenerInfoComplementaria(ApiConstanst.INFO_COMPLEMENTARIA.INFO_COMPLEMENTARIA_SOLICITUD_RELIQUIDACION).subscribe((res) => {
            this.bodyReliquidacion = res;
        });
    }

    getInfoEstudiante() {
        if (this.rolesActivos[this.ROLES_CONSTANTS.ROLES_SISTEMA.ESTUDIANTE]) {
            this.reliquidacionHelper.getEstudiante(this.autenticacion.getPayload().sub).subscribe((res) => {
                this.estudiante = res[0].TerceroId;
                this.estudiante.documento = this.autenticacion.getPayload().documento;
                this.estudiante.documento_compuesto = this.autenticacion.getPayload().documento_compuesto;
            });
        }
    }


    llamardialogo() {
        if (this.formulario.invalid) {
            this.validar = true;
            this.pUpManager.showErrorToast('Formulario no válido');
            return;
        }
        this.dialog.open(this.dialogo);
    }

    aniadirObservacion() {
        this.dialog.open(this.observaciones);
    }

    enviarInformacionReliquidacion() {
        this.nuxeoService.getDocumentos$(this.formularioReliquidacion.documentosAdjuntos, this.documentoService).subscribe((res) => {
            if (this.formularioReliquidacion.documentosAdjuntos.length === Object.keys(res).length) {
                this.formularioReliquidacion.documentosCargados = res;
                const terceroInfoComplementaria: any = {};
                terceroInfoComplementaria.TerceroId = this.estudiante;
                terceroInfoComplementaria.Id = null;
                terceroInfoComplementaria.Activo = true;
                terceroInfoComplementaria.InfoComplementariaId = this.bodyReliquidacion;
                terceroInfoComplementaria.Dato = JSON.stringify(this.formularioReliquidacion);
                this.reliquidacionHelper.grabarSolicitudReliquidacion(terceroInfoComplementaria).subscribe((res2) => {
                    this.reliquidacionHelper.obtenerTipoSolicitudEnviada().subscribe((tipoSolicitud) => {
                        this.guardarSolicitud(tipoSolicitud.Data, res2, this.formularioReliquidacion.documentosCargados);
                    });
                });
            }
        });

    }

    guardarSolicitud(tipoSolicitud: any, referencia: any, documentos: any) {
        const solicitud: any = {};
        solicitud.Id = null;
        solicitud.EstadoTipoSolicitudId = tipoSolicitud;
        solicitud.Referencia = JSON.stringify(referencia);
        solicitud.FechaCreacion = this.dateCustomPipe.transform(new Date());
        solicitud.FechaModificacion = this.dateCustomPipe.transform(new Date());
        solicitud.FechaRadicacion = this.dateCustomPipe.transform(new Date());
        solicitud.Resultado = '';
        solicitud.SolicitudFinalizada = false;
        solicitud.SolicitudPadreId = null;
        this.reliquidacionHelper.grabarSolicitud(solicitud).subscribe((solicitud) => {
            this.solicitud = solicitud.Data;
            this.estadoSolicitud = solicitud.Data.EstadoTipoSolicitudId;
            this.grabarSolicitante(solicitud.Data, documentos, tipoSolicitud);
        })
    }

    grabarSolicitante(solicitud: any, documentos: any, tipoSolicitud: any) {
        const solicitante: any = {};
        solicitante.Id = null;
        solicitante.SolicitudId = solicitud;
        solicitante.TerceroId = this.estudiante.id;
        this.reliquidacionHelper.grabarSolicitante(solicitante).subscribe((res) => {
            this.grabarSolicitudEstado('Solicitud guardada con éxito');
        })
    }

    grabarDocumentos(solicitud: any, documentos: any, tipoSolicitud: any) {
        const paquete: any = {};
        paquete.Activo = true;
        paquete.FechaComite = this.dateCustomPipe.transform(new Date());
        paquete.FechaCreacion = this.dateCustomPipe.transform(new Date());
        paquete.FechaModificacion = this.dateCustomPipe.transform(new Date());
        paquete.Id = null;
        paquete.Nombre = 'Formulario de reliquidación';
        paquete.NumeroComite = 'Formulario de reliquidación';
        paquete.PaqueteRevisado = false;
        this.reliquidacionHelper.grabarPaquete(paquete).subscribe((res) => {
            for (const doc of documentos) {
                const soporte: any = {};
                soporte.Activo = true;
                soporte.Descripcion = 'Paquete solicitud reliquidación';
                soporte.DocumentoId = doc.DocumentoId;
                soporte.FechaCreacion = this.dateCustomPipe.transform(new Date());
                soporte.FechaModificacion = this.dateCustomPipe.transform(new Date());
                soporte.Id = null;
                soporte.PaqueteId = res.Data;
                this.reliquidacionHelper.grabarSoportePaquete(soporte).subscribe((res2) => {
                    console.log(res2);
                });
            }
            const solicitudPaquete: any = {};
            solicitudPaquete.EstadoTipoSolicitudId = tipoSolicitud;
            solicitudPaquete.SolicitudId = solicitud;
            solicitudPaquete.Activo = true;
            solicitudPaquete.FechaCreacion = this.dateCustomPipe.transform(new Date());
            solicitudPaquete.FechaModificacion = this.dateCustomPipe.transform(new Date());
            this.reliquidacionHelper.grabarPaqueteSolicitud(solicitudPaquete).subscribe((paqueteSol) => {
                console.log(paqueteSol);
            });
        })
    }

    visualizarArchivo(archivo) {
        this.pUpManager.showInfoAlert(`Se esta descargando el archivo ${archivo.Nombre}`);
        this.nuxeoService.getDocumentoById$([archivo], this.documentoService).subscribe((res: Object) => {
            if (res[archivo.key]) {
                window.open(res[archivo.key]);
            }
        })
    }

    guardarObservacion() {
        if (this.modalObservaciones.invalid) {
            this.validarObservacion = true;
            this.pUpManager.showErrorToast('Formulario no válido');
            return;
        }
        let observacion: any = {};
        observacion.Activo = true;
        observacion.Id = null;
        observacion.SolicitudId = this.solicitud;
        observacion.TerceroId = this.estudiante.Id;
        observacion.TipoObservacionId = this.observacion.tipo_observacion_id;
        observacion.Titulo = 'Observación sobre reliquidación';
        observacion.Valor = this.observacion.valor;
        this.reliquidacionHelper.grabarObservacion(observacion).subscribe((res) => {
            this.grabarSolicitudEstado(undefined,true);
        })
    }

    grabarSolicitudEstado(mensaje?: any, esRevision?: any) {
        let solicitudEvolucion: any = {};
        solicitudEvolucion.Activo = true;
        solicitudEvolucion.EstadoTipoSolicitudId = {};
        if (esRevision) {
            solicitudEvolucion.EstadoTipoSolicitudId.Id = this.idEstadoSolicitud;
        }
        else {
            solicitudEvolucion.EstadoTipoSolicitudId = this.estadoSolicitud;
        }
        solicitudEvolucion.EstadoTipoSolicitudIdAnterior = null;
        solicitudEvolucion.Id = null;
        solicitudEvolucion.SolicitudId = this.solicitud;
        solicitudEvolucion.TerceroId = this.estudiante.Id;
        solicitudEvolucion.FechaCreacion = this.dateCustomPipe.transform(new Date());
        solicitudEvolucion.FechaLimite = this.dateCustomPipe.transform(new Date());
        solicitudEvolucion.FechaModificacion = this.dateCustomPipe.transform(new Date());
        this.reliquidacionHelper.grabarSolicitudEvolucion(solicitudEvolucion).subscribe((res2) => {
            this.solicitud.EstadoTipoSolicitudId = solicitudEvolucion.EstadoTipoSolicitudId;
            this.solicitud.FechaCreacion = this.dateCustomPipe.transform(new Date());
            this.solicitud.FechaRadicacion = this.dateCustomPipe.transform(new Date());
            this.solicitud.FechaModificacion = this.dateCustomPipe.transform(new Date());
            this.reliquidacionHelper.actualizarSolicitud(this.solicitud).subscribe((res3) => {
                this.pUpManager.showInfoToast(mensaje || 'Observación grabada');
                let ruta = '/pages/revision';
                if (this.rolesActivos[this.ROLES_CONSTANTS.ROLES_SISTEMA.ESTUDIANTE]) {
                    ruta = '/pages/revision-estudiante';
                }
                this.router.navigate([ruta]);
                this.dialog.closeAll();
            });
        });
    }

}
