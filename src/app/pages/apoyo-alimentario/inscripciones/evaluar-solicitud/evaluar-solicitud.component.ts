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
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { InfoCompletaEstudiante } from '../../../../@core/data/models/info-completa-estudiante/info-completa-estudiante';
import { InfoComplementariaTercero } from '../../../../@core/data/models/terceros/info_complementaria_tercero';
import { DatePipe } from '@angular/common';
import { SolicitudEvolucionEstado } from '../../../../@core/data/models/solicitud/solicitud-evolucion-estado';
import { SoportePaquete } from '../../../../@core/data/models/solicitud/soporte-paquete';
import { NuxeoService } from '../../../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../../../@core/data/documento.service';

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

    estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante();

    registro: FormGroup;
    residencia: FormGroup;
    sisben: FormGroup;
    socioeconomica: FormGroup;
    necesidades: FormGroup;
    especial: FormGroup;
    menores: FormGroup;
    personasacargo: FormGroup;
    documentos: FormGroup;
    
    loading: boolean = true;

    listInfoComplementaria = [];
  documentosSolicitud: SoportePaquete;

    constructor(
        private route: ActivatedRoute,
        private translate: TranslateService,
        private listService: ListService,
        private utilsService: UtilService,
        private nuxeoService: NuxeoService,
        private documentosService: DocumentoService
    ) {
        this.idSolicitud = parseInt(this.route.snapshot.paramMap.get('idSolicitud'));
        if (this.idSolicitud != 0) {
            this.loadSolicitud();
            this.loadEstadoTipoSolicitud();
        } else {
            this.nueva = true;
            /*
            EVALUAR CASOOOOOOO
            EVALUAR CASOOOOOOO
            EVALUAR CASOOOOOOO
            */
            this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDINSCRIPCIONES, null).then(
                (resp) => {
                    if (resp != []) {
                        this.periodo = resp[0].PeriodoId
                    } else {
                        this.utilsService.showSwAlertError("Parametos no encontrados","No hay un periodo para crear inscripciones");
                    }
                }
            ).catch((error) => this.utilsService.showSwAlertError("Parametos no encontrados",error));
        }
    }

    loadSolicitud() {
        this.listService.loadSolicitud(this.idSolicitud).then((respSolicitud) => {
            this.solicitud = respSolicitud;
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
                this.listService.findObservacion(this.solicitud.Id).then((respObs) => {
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
    
    this.listService.findPaqueteSolicitudBySolicitud(this.solicitud.Id).then((paqSol)=>{
      if(paqSol!=undefined){
        console.log(paqSol.PaqueteId);
        this.listService.findSoportePaqueteByIdPaquete(paqSol.PaqueteId.Id).then((soportes)=>{
          this.documentosSolicitud=soportes;
          let terminoDescargar=false;
          console.log("entra=>",soportes);
          this.nuxeoService.getDocumentoById$(soportes, this.documentosService).subscribe((res: Object) => {
            window.open(res['undefined']);
            console.log(res['undefined']);
            if (Object.keys(res).length === Object.keys(soportes).length && !terminoDescargar) {
              
              
                /* for (doc of res) {
                    window.open(res[archivo.key]);
                } */
                terminoDescargar = true;
            }
        });
        })
      }
    }).catch((err)=>this.showError('No se encontraron documentos',err));
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

    create(){
        this.utilsService.showSwAlertQuery("Está seguro?",`Desea crear solicitud de apoyo alimentario en ExtraTiempo para ${this.tercero.NombreCompleto} en `,"Crear","question")
        .then(async (resp) => {
            if (resp) {
                this.utilsService.showSwAlertSuccess("Solicitud Creada ExtraTiempo",`Se creo la solicitud para ${this.tercero.NombreCompleto} en el periodo ${this.periodo.Nombre} `);
            }
        });
        
    }

    cargarNuevaSolicitud(){
        this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDINSCRIPCIONES, true).then(
            (resp) => {
              console.log(resp);
              console.log(resp != []);
              
              //if (resp != []) {
              if (resp.length > 0) {
                this.periodo = resp[0].PeriodoId;
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
                                this.inicializarFormularios();
                            });
                        }).catch((errIC)=>{
                            this.showError("error",errIC);
                            this.inicializarFormularios();
                        });
                        console.log("Iniciamos formularios");

                        
      
                    }else{
                      this.showError("Documentos del estudiante no encontrados","No se encontro el carnet y documento de identificacion");
                    }
                  }).catch((errorDocs)=>this.showError("Documentos no encontrados",errorDocs));
      
      
              } else {
                this.showError("Periodo Vacio","No se encuentra un periodo activo para inscripciones");
              }
            }).catch((error) => {  
              this.showError("Periodo Vacio",error);
            });
    }

    showError(titulo: string,msj: any) {
        this.loading=false;
        Swal.close();
        this.utilsService.showSwAlertError(titulo,msj);
      }

    /* Clasifica la informacion de listInfoComplementaria */
    loadEstudiante(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.estudiante.IdTercero=this.tercero.Id;
        this.estudiante.Nombre = this.tercero.NombreCompleto;
        var datePipe = new DatePipe("en-US");
        this.estudiante.FechaNacimiento = datePipe.transform(
        this.tercero.FechaNacimiento,
        "dd/MM/yyyy"
        );
        let infComp: InfoComplementariaTercero;
        
        console.log(this.listInfoComplementaria);

        for (infComp of this.listInfoComplementaria) {
        const nombreGrupoInfo =
            infComp.InfoComplementariaId.GrupoInfoComplementariaId.Nombre;
        switch (nombreGrupoInfo) {
            case "Información Contacto":
            this.agregarInformacionContacto(infComp);
            break;
            case "Información Socioeconómica":
            this.agregarInformacionSocioEconomica(infComp);
            break;
            case "Dependencia económica":
            this.estudiante.InfoSocioeconomica.DependenciaEconomica =
                infComp.InfoComplementariaId.Nombre;
            /* this.agregarInformacionSocioEconomica(infComp); 
            Padre: InfoComplementariaId.Id:166
            Madre: InfoComplementariaId.Id:167
            Familiar: InfoComplementariaId.Id:168
            El mismo: InfoComplementariaId.Id:169

            this.estudiante.InfoSocioeconomica.DependenciaEconomica = infComp.InfoComplementariaId.Nombre;
            */

            break;
            case "¿Tiene Sisben?":
            if (infComp.InfoComplementariaId.Nombre == "SI") {
                this.estudiante.InfoResidencia.Sisben = true;
            } else if (infComp.InfoComplementariaId.Nombre == "NO") {
                this.estudiante.InfoResidencia.Sisben = false;
            }

            /* 
            SI: InfoComplementariaId.Id:170
            NO: InfoComplementariaId.Id:171
            */
            break;
            case "Tipo de Colegio":
            /* 
            Privado: InfoComplementariaId.Id:172
            Publico: InfoComplementariaId.Id:173
            */
            this.estudiante.InfoSocioeconomica.TipoColegio =
                infComp.InfoComplementariaId.Nombre;
            break;
            case "Lugar de vivienda":
            /* 
            Propio: InfoComplementariaId.Id:181
            Familiar: InfoComplementariaId.Id:182
            Arriendo: InfoComplementariaId.Id:183
            */
            this.estudiante.InfoSocioeconomica.TipoVivienda =
                infComp.InfoComplementariaId.Nombre;
            if (this.estudiante.InfoSocioeconomica.TipoVivienda == "Arriendo") {
                this.estudiante.InfoSocioeconomica.PagaArriendo == true;
            } else {
                this.estudiante.InfoSocioeconomica.PagaArriendo == false;
            }
            break;

            case "¿Con quién vive?":
            /* 
            Familia: InfoComplementariaId.Id:184
            Solo: InfoComplementariaId.Id:185
            Amigos: InfoComplementariaId.Id:186
            */
            this.estudiante.InfoSocioeconomica.ConQuienVive =
                infComp.InfoComplementariaId.Nombre;

            break;
            /* 
            case "Lugar de residencia de la Familia":
            INFO REPETIDA, NO VA
            break; 

            case "¿Responsable de la matricula desempleado?":
            INFO NO VA
            break;

            case "¿Elestudianteesdesplazadopolítico?":
            INFO NO VA
            break;

            case "¿Fallecióresponsabledelamatricula?":
            INFO NO VA
            break;
            
            case "¿Elestudianteesmadreopadrecabezadefamilia?":
            INFO REPETIDA
            break;

            case "¿ElestudiantecambiodeestratodespuésdesuingresoenlaUniversidad?":
            break;

            */
            case "¿Posee personas a Cargo?": //GRupoInfo:44
            /* 
            Si: InfoComplementariaId.Id:201
            No: InfoComplementariaId.Id:231
            */
            if (infComp.InfoComplementariaId.Nombre == "Si") {
                this.estudiante.InfoPersonasACargo.TienePersonasACargo = true;
            } else if (infComp.InfoComplementariaId.Nombre == "No") {
                this.estudiante.InfoPersonasACargo.TienePersonasACargo = false;
            }
            break;
            case "Presenta condición de desplazado":
            if (infComp.InfoComplementariaId.Nombre == "Si") {
                this.estudiante.InfoEspecial.CondicionDesplazado = true;
            } else if (infComp.InfoComplementariaId.Nombre == "No") {
                this.estudiante.InfoEspecial.CondicionDesplazado = false;
            }
            break;
            /* case "Solicituddereliquidación":
            break;
            case "Comorbilidades":
            break; */
            case "Genero":
            this.estudiante.Genero = infComp.InfoComplementariaId.Nombre;
            break;

            case "Estado Civil":
            this.estudiante.InfoSocioeconomica.EstadoCivil =
                infComp.InfoComplementariaId.Nombre;
            break;

            default:
        }
        }
        resolve(true);
    });
    }

    /* Clasifica la informacion socieconomica del estudiante */
    agregarInformacionSocioEconomica(infComp: InfoComplementariaTercero) {
    const nombreInfComp = infComp.InfoComplementariaId.Nombre;
    switch (nombreInfComp) {
        case "ESTRATO":
        this.estudiante.InfoSocioeconomica.Estrato = JSON.parse(
            infComp.Dato
        ).ESTRATO;
        break;

        case "PUNTAJE_SISBEN":
        this.estudiante.InfoResidencia.Puntaje_Sisben = infComp.Dato;
        break;

        case "CABEZA_FAMILIA":
        this.estudiante.InfoSocioeconomica.CabezaFamilar = JSON.parse(
            infComp.Dato
        );
        break;

        case "HIJOS":
        this.estudiante.InfoPersonasACargo.Hijos = JSON.parse(
            infComp.Dato
        ).value;
        break;

        case "NUMERO_HIJOS":
        this.estudiante.InfoPersonasACargo.NumeroHijos = JSON.parse(
            infComp.Dato
        ).value;
        break;

        case "NUMERO_HERMANOS":
        this.estudiante.InfoSocioeconomica.NumeroHermanos = infComp.Dato;
        break;
        case "Información Socioeconómica":
        this.estudiante.InfoSocioeconomica.IngresosMensuales = JSON.parse(
            infComp.Dato
        ).value;
        break;

        default:
        break;
    }
    }

    /* Clasifica informacion de contacto */
    agregarInformacionContacto(infComp: InfoComplementariaTercero) {
    const nombreInfComp = infComp.InfoComplementariaId.Nombre;
    console.log(infComp);
    switch (nombreInfComp) {
        case "CORREO INSTITUCIONAL":
        console.log(infComp);
        this.estudiante.Correo_Institucional = JSON.parse(infComp.Dato).value;
        break;

        case "TELEFONO":
        this.estudiante.InfoResidencia.Telefono = JSON.parse(
            infComp.Dato
        ).telefono;
        break;

        case "CELULAR":
        this.estudiante.Celular = infComp.Dato;
        break;

        case "CORREO":
        this.estudiante.Correo = JSON.parse(infComp.Dato).value;
        break;

        case "DIRECCIÓN":
        this.estudiante.InfoResidencia.Direccion = JSON.parse(
            infComp.Dato
        ).Data;
        /* "Dato": "{\"DIRECCIÓN\":\"CL 60 A SUR # 73 - 41\",\"ZONA\":\"URBANA\",\"GENERO\":\"MIXTO\",\"DANE11\":\"51100202578\",\"DANE12\":\"111001107816\",\"CLASE\":\"DISTRITAL\",\"NAT_JURIDICA\":\"OFICIAL\",\"ESTADO\":\"ANTIGUO ACTIVO\"}", */
        break;

        case "LUGAR_RESIDENCIA":
        /* "Dato": "447" */
        this.estudiante.InfoResidencia.Municipio = JSON.parse(infComp.Dato);
        break;

        case "LOCALIDAD":
        this.estudiante.InfoResidencia.Localidad = JSON.parse(
            infComp.Dato
        ).LOCALIDAD;
        break;

        default:
        break;
    }
    }

    private inicializarFormularios() {
        this.loadEstudiante()
          .then(() => {
            console.log("Se carga el estudiante");
            this.registro = new FormGroup({
              nombres: new FormControl({
                value: this.estudiante.Nombre,
                disabled: true,
              }),
              codigo: new FormControl({
                value: this.estudiante.Carnet.Numero,
                disabled: true,
              }),
              documento: new FormControl({
                value: this.estudiante.Documento.Numero,
                disabled: true,
              }),
              tipoDocumento: new FormControl({
                value: this.estudiante.Documento.TipoDocumentoId.Nombre,
                disabled: true,
              }),
              proyecto: new FormControl({
                value: this.estudiante.ProyectoCurricular,
                disabled: true,
              }),
              facultad: new FormControl({
                value: this.estudiante.Facultad,
                disabled: true,
              }),
              fechaNacimiento: new FormControl({
                value: this.estudiante.FechaNacimiento,
                disabled: true,
              }),
              email_institucional: new FormControl({
                value: this.estudiante.Correo_Institucional,
                disabled: true,
              }),
              email: new FormControl({
                value: this.estudiante.Correo,
                disabled: true,
              }),
              celular: new FormControl({
                value: this.estudiante.Celular,
                disabled: true,
              }),
              programa: new FormControl(),
              genero: new FormControl({
                value: this.estudiante.Genero,
                disabled: true,
              }),
            });
    
            this.residencia = new FormGroup({
              localidad: new FormControl({
                value: this.estudiante.InfoResidencia.Localidad,
                disabled: true,
              }),
              municipio: new FormControl({
                value: this.estudiante.InfoResidencia.Municipio,
                disabled: true,
              }),
              direccion: new FormControl({
                value: this.estudiante.InfoResidencia.Direccion,
                disabled: true,
              }),
              barrio: new FormControl({
                value: this.estudiante.InfoResidencia.Barrio,
                disabled: true,
              }),
              telefono: new FormControl({
                value: this.estudiante.InfoResidencia.Telefono,
                disabled: true,
              }),
            });
    
            this.socioeconomica = new FormGroup({
              estadocivil: new FormControl({
                value: this.estudiante.InfoSocioeconomica.EstadoCivil,
                disabled: true,
              }),
              estrato: new FormControl({
                value: this.estudiante.InfoSocioeconomica.Estrato,
                disabled: true,
              }),
              valorMatricula: new FormControl(),
              ingresosMensuales: new FormControl({
                value: this.estudiante.InfoSocioeconomica.IngresosMensuales,
                disabled: true,
              }),
              cabezaFamilar: new FormControl({
                value: this.estudiante.InfoSocioeconomica.CabezaFamilar,
                disabled: true,
              }),
              dependenciaEconomica: new FormControl({
                value: this.estudiante.InfoSocioeconomica.DependenciaEconomica,
                disabled: true,
              }),
              pagaArriendo: new FormControl(),
              zonaVulnerabilidad: new FormControl({
                value: this.estudiante.InfoSocioeconomica.ZonaVulnerabilidad,
                disabled: true,
              }),
              numeroHermanos: new FormControl(),
              conQuienVive: new FormControl(),
              tipoColegio: new FormControl(),
              tipoVivienda: new FormControl({
                value: this.estudiante.InfoSocioeconomica.TipoVivienda,
                disabled: true,
              }),
            });
    
            this.personasacargo = new FormGroup({
              tieneperacargo: new FormControl({
                value: this.estudiante.InfoPersonasACargo.TienePersonasACargo,
                disabled: true,
              }),
              hijos: new FormControl({
                value: this.estudiante.InfoPersonasACargo.Hijos,
                disabled: true,
              }),
              numeroHijos: new FormControl({
                value: this.estudiante.InfoPersonasACargo.NumeroHijos,
                disabled: true,
              }),
              menoresEdad: new FormControl({
                value: this.estudiante.InfoPersonasACargo.MenoresEdad,
                disabled: false,
              }),
              menoresEstudiantes: new FormControl({
                value: this.estudiante.InfoPersonasACargo.MenoresEdad,
                disabled: false,
              }),
              menoresMatriculados: new FormControl({
                value: this.estudiante.InfoPersonasACargo.MenoresMatriculados,
                disabled: false,
              }),
            });
    
            this.sisben = new FormGroup({
              tieneSisben: new FormControl({
                value: this.estudiante.InfoResidencia.Sisben,
                disabled: true,
              }),
              puntaje_Sisben: new FormControl({
                value: this.estudiante.InfoResidencia.Puntaje_Sisben,
                disabled: true,
              }),
              grupo: new FormControl(),
            });
    
            this.necesidades = new FormGroup({
              calidadVivienda: new FormControl({
                value: this.estudiante.InfoNecesidades.CalidadVivienda,
                disabled: false,
              }),
              cuartosDormir: new FormControl({
                value: this.estudiante.InfoNecesidades.CuartosDormir,
                disabled: false,
              }),
              personasHogar: new FormControl({
                value: this.estudiante.InfoNecesidades.PersonasHogar,
                disabled: false,
              }),
              serviciosPublicos: new FormControl({
                value: this.estudiante.InfoNecesidades.ServiciosPublicos,
                disabled: false,
              }),
              origenAgua: new FormControl({
                value: this.estudiante.InfoNecesidades.OrigenAgua,
                disabled: false,
              }),
              aguasNegras: new FormControl({
                value: this.estudiante.InfoNecesidades.AguasNegras,
                disabled: false,
              }),
            });
    
            this.especial = new FormGroup({
              condicionDesplazado: new FormControl({}),
              condicionEspecial: new FormControl({}),
              discapacidad: new FormControl({
                value: this.estudiante.InfoEspecial.Discapacidad,
                disabled: true,
              }),
              patologia: new FormControl({
                value: this.estudiante.InfoEspecial.Patologia,
                disabled: true,
              }),
              seguridadSocial: new FormControl({}),
              serPiloPaga: new FormControl({}),
            });
    
            this.documentos = new FormGroup({});
    
            this.loading = false;
            Swal.close();
          })
          .catch((error) => {
            console.error(error);
            if (!error.status) {
              error.status = 409;
            }
            this.utilsService.showSwAlertError(error.status + " Load info estudiante",error.status);
          });
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
                            this.listService.crearObservacion(observacionObj).then((resp) => {
                                this.observaciones.push(observacionObj);
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
                            this.listService.crearObservacion(observacionObj).then((resp) => {
                                this.observaciones.push(observacionObj);
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


