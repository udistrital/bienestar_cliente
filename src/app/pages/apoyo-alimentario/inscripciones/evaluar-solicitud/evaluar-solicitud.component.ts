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

    constructor(
        private route: ActivatedRoute,
        private translate: TranslateService,
        private listService: ListService
    ) {
        this.idSolicitud = parseInt(this.route.snapshot.paramMap.get('idSolicitud'));
        if (this.idSolicitud != 0) {
            this.loadSolicitud();
        } else {
            this.nueva = true;
            this.listService.findParametrosByPeriodoTipoEstado(null,environment.IDS.IDINSCRIPCIONES,true).then(
                (resp)=>{
                  if(resp!=[]){
                    this.periodo = resp[0].PeriodoId
                  }else{
                      this.showError("No hay un periodo para crear inscripciones");
                  }
                }
            ).catch((error)=>this.showError(error));
        }
    }

    loadSolicitud() {
        this.listService.loadSolicitud(this.idSolicitud).then((respSolicitud) => {
            this.solicitud = respSolicitud;
            if (this.solicitud != undefined) {
                this.listService.loadSolicitanteBySolicitud(this.solicitud.Id).then((respSolicitante) => {
                    this.solicitante = respSolicitante;
                    if (this.solicitante != undefined) {
                        this.listService.loadTercero(this.solicitante.TerceroId).then((respTerc) => {
                            this.tercero = respTerc;
                        }).catch((errT) => this.showError(errT));
                    } else {
                        this.showError("No se encontro el solicitante");
                    }
                }).catch((err) => this.showError(err));
            } else {
                this.showError("No se encontro la solicitud");
            }
        }).catch((error) => this.showError(error));
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

}


