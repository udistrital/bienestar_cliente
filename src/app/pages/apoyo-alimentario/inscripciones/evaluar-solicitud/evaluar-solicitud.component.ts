import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Solicitante } from '../../../../@core/data/models/solicitud/solicitante';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { SolicitudService } from '../../../../@core/data/solicitud.service';
import { ListService } from '../../../../@core/store/list.service';
import { TranslateService } from "@ngx-translate/core";
import Swal from "sweetalert2";
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { environment } from '../../../../../environments/environment';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { Observacion } from '../../../../@core/data/models/solicitud/observacion';
import { EstadoTipoSolicitud } from '../../../../@core/data/models/solicitud/estado-tipo-solicitud';
import { UtilService } from '../../../../shared/services/utilService';

@Component({
    selector: 'ngx-evaluar-solicitud',
    templateUrl: './evaluar-solicitud.component.html',
    styleUrls: ['./evaluar-solicitud.component.scss']
})
export class EvaluarSolicitudComponent implements OnInit {
    nueva = false;
    periodo: Periodo = null;
    idSolicitud = 0;
    solicitud: Solicitud = null;
    solicitante: Solicitante = null;
    tercero: Tercero = null;
    estadosTipoSolicitud: EstadoTipoSolicitud[] = [];
    nuevoEstado: number = null;
    obseravacionText: string = "";
    observaciones: Observacion[] = [];

    constructor(
        private route: ActivatedRoute,
        private translate: TranslateService,
        private listService: ListService,
        private utilsService: UtilService
    ) {
        this.idSolicitud = parseInt(this.route.snapshot.paramMap.get('idSolicitud'));
        if (this.idSolicitud != 0) {
            this.loadSolicitud();
            this.loadEstadoTipoSolicitud();
        } else {
            this.nueva = true;
            this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDINSCRIPCIONES, true).then(
                (resp) => {
                    if (resp != []) {
                        this.periodo = resp[0].PeriodoId
                    } else {
                        this.showError("No hay un periodo para crear inscripciones");
                    }
                }
            ).catch((error) => this.showError(error));
        }
    }

    loadSolicitud() {
        this.listService.loadSolicitud(this.idSolicitud).then((respSolicitud) => {
            this.solicitud = respSolicitud;
            if (this.solicitud != undefined) {
                this.listService.loadSolicitanteBySolicitud(this.solicitud.Id).then((respSolicitante) => {
                    this.solicitante = respSolicitante;
                    console.log("Solicitante=>", respSolicitante);
                    if (this.solicitante != undefined) {
                        this.listService.loadTercero(this.solicitante.TerceroId).then((respTerc) => {
                            this.tercero = respTerc;
                        }).catch((errT) => this.showError(errT));
                    } else {
                        this.showError("No se encontro el solicitante");
                    }
                }).catch((err) => this.showError(err));
                this.listService.findObservacion(this.solicitud.Id).then((respObs) => {
                    console.log(respObs);
                    this.observaciones = respObs;
                }).catch((errObs) => this.showError(errObs));
            } else {
                this.showError("No se encontro la solicitud");
            }
        }).catch((error) => this.showError(error));
    }

    loadEstadoTipoSolicitud() {
        this.listService.findEstadoTipoSolicitud(environment.IDS.IDTIPOSOLICITUD)
            .subscribe((result: any[]) => {
                if (result['Data'].length > 0) {
                    let estadosTiposolicitud = <Array<EstadoTipoSolicitud>>result['Data'];
                    for (let estadoTipo of estadosTiposolicitud) {
                        this.estadosTipoSolicitud.push(estadoTipo);
                    }
                }
            },
                error => {
                    console.error(error);
                }
            );
    }

    cargarSolicitante(documento: string) {
        console.log(documento);
        this.listService.loadTerceroByDocumento(documento).then((respDoc) => {
            this.tercero = respDoc;
            if (this.tercero != undefined) {
                this.listService.loadSolicitanteByIdTercero(this.tercero.Id, null, this.periodo.Nombre, null).then((resp) => {
                    if (resp != [] && resp[0] != undefined) {
                        console.log(resp[0]);
                        this.solicitante = resp[0];
                        this.solicitud = resp[0].SolicitudId;
                        this.idSolicitud = this.solicitud.Id;
                        this.nueva = false;
                    }
                });
            } else {
                this.showError("No se encontro ningun estudiante con el documento " + documento);
            }
        }).catch((error) => this.showError(error))
    }

    showError(error: any) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: this.translate.instant("ERROR." + error),
            confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
        });
    }

    ngOnInit() {
    }

    save() {
        if (this.nuevoEstado == null) {
            this.showError("El nuevo estado es obligatorio");
            return;
        }
        const nuevoEstadoTipo = this.estadosTipoSolicitud[this.nuevoEstado];
        if (nuevoEstadoTipo.Id == this.solicitud.EstadoTipoSolicitudId.Id) {
            this.showError("El nuevo estado no puede ser igual al actual");
            return;
        }
        if (this.obseravacionText == null) {
            this.showError("Agregar una observacion es obligatorio");
            return;
        }

        let tituloObservacion = `Cambio estado ${this.solicitud.EstadoTipoSolicitudId.EstadoId.Nombre} a ` +
            `${nuevoEstadoTipo.EstadoId.Nombre}`;

        let obseracionCompleta = `${this.obseravacionText} // ${this.utilsService.getUsuarioWSO2()}`;

        this.utilsService.showSwAlertQuery('¿Cambiar estado?', `<p>Su nuevo estado sera <strong>${nuevoEstadoTipo.EstadoId.Nombre}</strong></p>` +
            `<p> <strong> Observacion:</strong>${obseracionCompleta}</p>`, 'Cambiar estado')
            .then((result) => {
                if (result) {
                    this.listService.cambiarEstadoSolicitud(this.solicitud, nuevoEstadoTipo, this.tercero.Id).then((resp) => {
                        this.solicitud.EstadoTipoSolicitudId = resp;
                        Swal.fire("Cambio de estado", "Se cambio el estado de forma correcta", "success");
                        this.listService.loadTiposObservacion(1).then((resp) => {
                            /*  Agregar observacion*/
                            let observacionObj = new Observacion();
                            observacionObj.SolicitudId = this.solicitud;
                            observacionObj.TerceroId = this.tercero.Id;
                            observacionObj.Titulo = tituloObservacion;
                            observacionObj.Valor = obseracionCompleta;
                            observacionObj.TipoObservacionId = resp['Data'][0];
                            this.listService.crearObservacion(observacionObj).then((resp) => {
                                this.observaciones.push(observacionObj);
                                Swal.fire("Nueva observacion", "Se agrego la observacion de forma correcta", "success");
                            }).catch();
                        }).catch((err) => this.showError(err));

                    }).catch((err) => {
                        this.showError(err);
                    })
                } else {
                    console.log("Se cancela");
                }

            });






    }
    agregarObservacion() {
        Swal.mixin({
            input: 'textarea',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2']
        }).queue([
            {
                title: 'Titulo observacion',
                text: 'Coloca el titulo de la observacion'
            },{
                title: 'Contenido de la observacion',
                text: 'Coloca toda la infromacion necesaria para dejar un registro'
            }
        ]).then((result) => {            
            if (result['value'][0]!="" && result['value'][1]!="") {
                this.utilsService.showSwAlertQuery("¿Agregar observacion?",
                `<b>${result['value'][0]}</b> ${result['value'][1]}`,"Agregar").then((respq)=>{
                    if(respq){
                        this.listService.loadTiposObservacion(1).then((resp) => {
                            /*  Agregar observacion*/
                            let observacionObj = new Observacion();
                            observacionObj.SolicitudId = this.solicitud;
                            observacionObj.TerceroId = this.tercero.Id;
                            observacionObj.Titulo = result['value'][0];
                            observacionObj.Valor = result['value'][1]+" // "+this.utilsService.getUsuarioWSO2();
                            observacionObj.TipoObservacionId = resp['Data'][0];
                            this.listService.crearObservacion(observacionObj).then((resp) => {
                                this.observaciones.push(observacionObj);
                                Swal.fire("Nueva observacion", "Se agrego la observacion de forma correcta", "success");
                            }).catch((errOb)=>this.showError(errOb));
                        }).catch((err) => this.showError(err));
                    }
                });
            }else{
                this.showError("Todos los campos de la observacion deben ir llenos");
            }
        })

    }



}


