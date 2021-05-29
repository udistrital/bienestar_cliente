import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { InfoCompletaEstudiante } from '../../../../@core/data/models/info-completa-estudiante/info-completa-estudiante';
import { InfoComplementariaTercero } from '../../../../@core/data/models/terceros/info_complementaria_tercero';
import { DatePipe } from '@angular/common';
import { SolicitudEvolucionEstado } from '../../../../@core/data/models/solicitud/solicitud-evolucion-estado';
import { SoportePaquete } from '../../../../@core/data/models/solicitud/soporte-paquete';
import { NuxeoService } from '../../../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../../../@core/data/documento.service';
import {DomSanitizer} from '@angular/platform-browser';

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
    evolucionesEstado: SolicitudEvolucionEstado[] = [];
    documentosHTML = new Array();
    selectDoc=[];

    estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante();
    
    loading: boolean = true;
    loadForm: boolean = true;
    loadDocs: boolean = true;

    referencia=[];

    listInfoComplementaria = [];
    documentosSolicitud: SoportePaquete;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private listService: ListService,
        private utilsService: UtilService,
        private nuxeoService: NuxeoService,
        private documentosService: DocumentoService,
        private sanitizer :DomSanitizer
    ) {
        this.idSolicitud = parseInt(this.route.snapshot.paramMap.get('idSolicitud'));
        if (this.idSolicitud != 0) {
            this.loadSolicitud();
            this.loadEstadoTipoSolicitud();
        } else {
            this.nueva = true;
            this.loadForm = true; 
            /*
            EVALUAR CASOOOOOOO
            EVALUAR CASOOOOOOO
            EVALUAR CASOOOOOOO
            */
            console.log("construyo bien makia");
            this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDSERVICIOAPOYO, true).then(
                (resp) => {          
                    if (resp[0]!=undefined) {
                        this.periodo = resp[0].PeriodoId
                    } else {
                        this.utilsService.showSwAlertError("Servicio apoyo no encontrado","No esta habilitado el apoyo alimentario para el periodo actual");
                    }
                }
            ).catch((error) => this.utilsService.showSwAlertError("Parametos no encontrados",error));
        }
    }

    loadSolicitud() {
        this.listService.loadSolicitud(this.idSolicitud).then((respSolicitud) => {
            console.log(respSolicitud)
            this.solicitud = respSolicitud;
            console.log(this.solicitud,'paso')
            let ref: any=JSON.parse(this.solicitud.Referencia);
            this.referencia.push(ref.Periodo);
            this.referencia.push(ref.Puntaje);
            if (this.solicitud != undefined) {
                this.loadDocumentos();
                this.listService.loadSolicitanteBySolicitud(this.solicitud.Id).then((respSolicitante) => {
                    this.solicitante = respSolicitante;
                    console.log("Solicitante=>", respSolicitante);
                    if (this.solicitante != undefined) {
                        this.listService.loadTercero(this.solicitante.TerceroId).then((respTerc) => {
                            this.tercero = respTerc;
                        }).catch((errT) => this.utilsService.showSwAlertError("Estudiante(tercero) no encontrado",errT));
                    } else {
                        this.utilsService.showSwAlertError("Solicitante no encontrado","No se encontro un solicitante para la solicitud");
                    }
                }).catch((err) => this.utilsService.showSwAlertError("Solicitante no encontrado",err));
                this.listService.findObservacion(this.solicitud.Id,1).then((respObs) => {
                    console.log(respObs);
                    this.observaciones = respObs;
                }).catch((errObs) =>  this.utilsService.showSwAlertError("Observación no encontrada",errObs));
                this.listService.findEvolucionEstado(this.solicitud.Id).then((respObs) => {
                  console.log(respObs);
                  this.evolucionesEstado = respObs;
              }).catch((errObs) =>  this.utilsService.showSwAlertError("Observación no encontrada",errObs));
            } else {
                this.utilsService.showSwAlertError("Solicitud no encontrada","No se encontro la solicitud para el periodo actual");
            }
        }).catch((error) => this.utilsService.showSwAlertError("Solicitud no encontrada",error));
    }

    loadDocumentos() {
      console.log("CARGO DOCS");
      let contDocs=0;
      this.listService.findPaqueteSolicitudBySolicitud(this.solicitud.Id).then((paqSol)=>{
        if(paqSol!=undefined){
          console.log(paqSol.PaqueteId);
          this.listService.findSoportePaqueteByIdPaquete(paqSol.PaqueteId.Id).then((soportes)=>{
            this.documentosSolicitud=soportes;
            let terminoDescargar=false;
            console.log("entra=>",soportes);
            console.log(this.documentosHTML);
            
            for (let i = 0; i < Object.keys(soportes).length; i++) {
              const element = Object.values(soportes)[i];
              this.documentosHTML[i]=new Array();
              console.log(element.Descripcion);
              this.documentosHTML[i][0]=element.Descripcion;
            }
            this.nuxeoService.getDocumentoById$(soportes, this.documentosService).subscribe((res: Object) => {
              
              console.info("res --> ",res['undefined']);
              for (let i = 0; i < this.documentosHTML.length; i++) {
                if(res['undefined'].documento==this.documentosHTML[i][0]){
                  this.documentosHTML[i][1]=res['undefined'].url;
                }
              }
              
              contDocs++;
              
              if (contDocs === Object.keys(soportes).length && !terminoDescargar) {
  
                  console.log("DOCS -->",this.documentosHTML);
                  this.selectDoc=this.documentosHTML[0];              
                  this.loading = false;
                  Swal.close();
  
                  /* for (doc of res) {
                      window.open(res[archivo.key]);
                  } */
                  terminoDescargar = true;
              }
  
          });
          })
        }
      }).catch((err)=>{
        this.showError('No se encontraron documentos',err);
        this.loadDocs = false;
      });
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
                console.log("aqui voy");
                this.listService.loadSolicitanteByIdTercero(this.tercero.Id, null, this.periodo.Nombre, null).then((resp) => {
                    if (resp != [] && resp[0] != undefined) {
                        console.log(resp[0]);
                        this.solicitante = resp[0];
                        this.solicitud = resp[0].SolicitudId;
                        this.idSolicitud = this.solicitud.Id;
                        this.nueva = false;
                        this.utilsService.showSwAlertError("Solicitud ya existente","Esta solicitud ya fue creada, a continuación se le redirige a esta.");
                        this.loadSolicitud();
                        this.loadEstadoTipoSolicitud();
                        this.router.navigate([`/pages/apoyo-alimentario/inscripciones/solicitudes/${this.idSolicitud}`]);
                    }else{
                        Swal.fire({
                            title: "Por favor espere!",
                            html: `cargando información de formulario`,
                            allowOutsideClick: false,
                            showConfirmButton: false,
                          });
                        Swal.showLoading();
                        this.cargarNuevaSolicitud();
                        
                    }
                });
            } else {
                this.utilsService.showSwAlertError("Estudiante no encontrado","No se encontro ningun estudiante con el documento " + documento);
            }
        }).catch((error) => this.utilsService.showSwAlertError("Error al buscar documentos",error))
    }

    ngOnInit() {
    }

    cargarNuevaSolicitud(){
        console.log(this.periodo);
        let usuarioWSO2 = this.tercero.UsuarioWSO2
        //usuarioWSO2 = "daromeror";

        console.log(this.tercero);
        this.listService.findDocumentosTercero(this.tercero.Id,null).then((respDocs) => {
            console.log("findDocumentosTercero");
            for (const documento of respDocs) {
                if (this.estudiante.Carnet == null && documento.TipoDocumentoId.CodigoAbreviacion == "CODE") {
                this.estudiante.Carnet=documento;                  
                } else if (this.estudiante.Documento == null && documento.TipoDocumentoId.CodigoAbreviacion != "CODE") {
                this.estudiante.Documento=documento;
                }
            }
            //Change this.estudiante.Documento
            if(this.estudiante.Carnet!=null && this.estudiante.Documento!=null){   
                this.listService.findInfoComplementariaTercero(this.tercero.Id).then((respIC)=>{
                    this.listInfoComplementaria=respIC;
                    this.listService.loadFacultadProyectoTercero(this.tercero.Id).then((nomFacultad) => {
                        this.estudiante.Facultad=nomFacultad[0];
                        this.estudiante.ProyectoCurricular=nomFacultad[1];
                        this.loadForm = false;                    
                        Swal.close();
                    });
                }).catch((errIC)=>{
                    this.showError("error",errIC);
                    this.loadForm = false;                    
                    Swal.close();
                });
                console.log("Iniciamos formularios");  
            }else{
                this.showError("Documentos del estudiante no encontrados","No se encontro el carnet y documento de identificacion");
            }
        }).catch((errorDocs)=>this.showError("Documentos no encontrados",errorDocs));
    }

    showError(titulo: string,msj: any) {
        this.loading=false;
        Swal.close();
        this.utilsService.showSwAlertError(titulo,msj);
      }

    save() {
        if (this.nuevoEstado == null) {
            this.utilsService.showSwAlertError("Nuevo estado vacio","El nuevo estado es obligatorio");
            return;
        }
        const nuevoEstadoTipo = this.estadosTipoSolicitud[this.nuevoEstado];
        if (nuevoEstadoTipo.Id == this.solicitud.EstadoTipoSolicitudId.Id) {
            this.utilsService.showSwAlertError("Cambio de Estado","El nuevo estado no puede ser igual al actual");
            return;
        }
        if (this.obseravacionText == null) {
            this.utilsService.showSwAlertError("Observación Vacia","Agregar una observacion es obligatorio");
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
                        //Swal.fire("Cambio de estado", "Se cambio el estado de forma correcta", "success");
                        this.utilsService.showSwAlertSuccess("Cambio de estado", "Se cambio el estado de forma correcta", "success");
                        this.listService.loadTiposObservacion(1).then((resp) => {
                            /*  Agregar observacion*/
                            let observacionObj = new Observacion();
                            observacionObj.SolicitudId = this.solicitud;
                            observacionObj.TerceroId = this.tercero.Id;
                            observacionObj.Titulo = tituloObservacion;
                            observacionObj.Valor = obseracionCompleta;
                            observacionObj.TipoObservacionId = resp['Data'][0];
                            this.listService.crearObservacion(observacionObj).then((respObs) => {
                                respObs.FechaCreacion = respObs.FechaCreacion.split('.')[0]+'.000000 +0000 +0000';               
                                this.observaciones.push(respObs);
                                this.utilsService.showSwAlertSuccess("Nueva observacion", "Se agrego la observacion de forma correcta", "success");
                                //Swal.fire("Nueva observacion", "Se agrego la observacion de forma correcta", "success");
                            }).catch( (error) => this.utilsService.showSwAlertError("No se creo la Observación",error));
                        }).catch((err) => this.utilsService.showSwAlertError("Observaciones no encontradas",err));

                    }).catch((err) => {
                        this.utilsService.showSwAlertError("Cambio de estado de la solicitud",err);
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
                            this.listService.crearObservacion(observacionObj).then((respObs) => {
                                respObs.FechaCreacion = respObs.FechaCreacion.split('.')[0]+'.000000 +0000 +0000';               
                                this.observaciones.push(respObs);
                                this.utilsService.showSwAlertSuccess("Nueva observacion", "Se agrego la observacion de forma correcta", "success");
                                //Swal.fire("Nueva observacion", "Se agrego la observacion de forma correcta", "success");
                            }).catch((errOb)=>this.utilsService.showSwAlertError("No se pudo crear la observacion",errOb));
                        }).catch((err) => this.utilsService.showSwAlertError("Observaciones no encontradas",err));
                    }
                });
            }else{
                this.utilsService.showSwAlertError("Campos Incompletos","Todos los campos de la observacion deben ir llenos");
            }
        })

    }



}


