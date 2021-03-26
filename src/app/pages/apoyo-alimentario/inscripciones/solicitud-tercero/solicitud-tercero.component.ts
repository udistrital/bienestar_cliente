import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ListService } from '../../../../@core/store/list.service';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { ImplicitAutenticationService } from '../../../../@core/utils/implicit_autentication.service';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { TercerosService } from '../../../../@core/data/terceros.service';
import { SolicitudService } from '../../../../@core/data/solicitud.service';
import { Solicitante } from '../../../../@core/data/models/solicitud/solicitante';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud'
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { ApiConstanst } from '../../../../shared/constants/api.constans';
import { TranslateService } from '@ngx-translate/core';
import { AcademicaService } from '../../../../@core/data/academica.service';
import { InfoCompletaEstudiante } from '../../../../@core/data/models/info-completa-estudiante/info-completa-estudiante';
import { DatePipe } from '@angular/common';
import { InfoComplementariaTercero } from '../../../../@core/data/models/terceros/info_complementaria_tercero';

@Component({
  selector: 'ngx-solicitud-tercero',
  templateUrl: './solicitud-tercero.component.html',
  styleUrls: ['./solicitud-tercero.component.scss']
})
export class SolicitudTerceroComponent implements OnInit {

  tercero: Tercero = null;
  solicitud: Solicitud = null;
  periodo: Periodo = null;
  referenciaSolicitud: ReferenciaSolicitud = null;
  estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante;
  listInfoComplementaria = [];

  username: string = '';
  private autenticacion = new ImplicitAutenticationService;
  facultades: Array<string> = ['ARTES ASAB', 'CIENCIAS Y EDUCACIÓN'];
  proyectos: Array<string> = ['Sistematizacion de datos', 'Industrial', 'Eléctrica', 'Mecánica'];
  localidades: Array<string> = ['Bosa', 'Usme', 'Ciudad Bolivar', 'Kennedy'];
  municipios: Array<string> = ['Bogota', 'Sumapaz', 'Otros'];
  estadocivil: Array<string> = ['Soltero', 'Casado', 'Separado'];


  registro: FormGroup;
  residencia: FormGroup;
  socioeconomica: FormGroup;
  necesidades: FormGroup;
  especial: FormGroup;
  menores: FormGroup;

  colegio: FormGroup;
  vivienda: FormGroup;
  futurofort: FormGroup;
  documentos: FormGroup;
  doccertificadoingreso: FormGroup;
  peracargo: FormGroup;
  registrocivil: FormGroup;
  desplazado: FormGroup;
  recibopago: FormGroup;
  otrosdoc: FormGroup;
  @ViewChild('dialogo', { read: null, static: null }) dialogo: TemplateRef<any>;



  APP_CONSTANTS = ApiConstanst;
  loading: boolean = true;


  constructor(
    private translate: TranslateService,
    private listService: ListService,
    private tercerosService: TercerosService,
    private academicaService: AcademicaService,
    private solicitudService: SolicitudService,
    private dialog: MatDialog,
  ) {
    this.loadPeriodo().then(() => {
      if (this.periodo != null) {
        console.log("Entro a buscar tercero")
        this.loadInformacionTercero()
          .then(() => {
            this.loadInformacionCompletaEstudiante().then(
              () => {
                this.inicializarFormularios();
              }
            );
          })
          .catch(error => {
            if (!error.status) {
              error.status = 409;
            }
            Swal.fire({
              type: 'error',
              title: error.status + ' Load info tercero',
              text: this.translate.instant('ERROR.' + error.status),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
          });

      }
    }).catch(error => {
      if (!error.status) {
        error.status = 409;
      }
      Swal.fire({
        type: 'error',
        title: error.status + '',
        text: this.translate.instant('ERROR.' + error.status),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    });
    /* this.loading=false; */

    /* this.loadPeriodoSp() */


  }
  loadEstudiante(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.estudiante.Nombre = this.tercero.NombreCompleto;
      var datePipe = new DatePipe('en-US');
      this.estudiante.FechaNacimiento = datePipe.transform(this.tercero.FechaNacimiento, 'dd/MM/yyyy');
      this.estudiante.Facultad = "Ingenieria :)"
      let infComp: InfoComplementariaTercero
      
      console.log(Object.keys(this.listInfoComplementaria).length );
      for (infComp of this.listInfoComplementaria) {
        const nombreGrupoInfo = infComp.InfoComplementariaId.GrupoInfoComplementariaId.Nombre;
        switch (nombreGrupoInfo) {
          case "Información Contacto":
            this.agregarInformacionContacto(infComp);
            break;
          case "":
            this.agregarInformacionSocioEconomica(infComp);
            break;
          case "Dependencia económica":
            /* this.agregarInformacionSocioEconomica(infComp); 
            Padre: InfoComplementariaId.Id:166
            Madre: InfoComplementariaId.Id:167
            Familiar: InfoComplementariaId.Id:168
            El mismo: InfoComplementariaId.Id:169

            this.estudiante.InfoSocioeconomica.DependenciaEconomica = infComp.InfoComplementariaId.Nombre;
            */

            break;
          case "¿Tiene Sisben?":
            if(infComp.InfoComplementariaId.Nombre=="SI"){
              this.estudiante.InfoResidencia.Sisben=true; 
            }else if(infComp.InfoComplementariaId.Nombre=="NO"){
              this.estudiante.InfoResidencia.Sisben=false; 
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
            this.estudiante.InfoSocioeconomica.TipoColegio = infComp.InfoComplementariaId.Nombre;
            break;
          case "Lugar de vivienda":
            /* 
            Propio: InfoComplementariaId.Id:181
            Familiar: InfoComplementariaId.Id:182
            Arriendo: InfoComplementariaId.Id:183
            */ 
            this.estudiante.InfoSocioeconomica.TipoVivienda = infComp.InfoComplementariaId.Nombre;
            break;

          case "¿Con quién vive?":
            /* 
            Familia: InfoComplementariaId.Id:184
            Solo: InfoComplementariaId.Id:185
            Amigos: InfoComplementariaId.Id:186
            */ 
            this.estudiante.InfoSocioeconomica.ConQuienVive = infComp.InfoComplementariaId.Nombre;

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
            if(infComp.InfoComplementariaId.Nombre=="Si"){
              this.estudiante.InfoSocioeconomica.PersonasACargo =true; 
            }else if(infComp.InfoComplementariaId.Nombre=="No"){
              this.estudiante.InfoSocioeconomica.PersonasACargo =false; 
            }
            break;
          case "Presenta condición de desplazado":
            if(infComp.InfoComplementariaId.Nombre=="Si"){
              this.estudiante.InfoSocioeconomica.PersonasACargo =true; 
            }else if(infComp.InfoComplementariaId.Nombre=="No"){
              this.estudiante.InfoSocioeconomica.PersonasACargo =false; 
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
            /* this.estudiante.InfoSocioeconomica.EstadoCivil = infComp.InfoComplementariaId.Nombre; */
            break;

          default:

        }
      }
      resolve(true);

    });
  }

  agregarInformacionSocioEconomica(infComp: InfoComplementariaTercero) {
    const nombreInfComp = infComp.InfoComplementariaId.Nombre;
    switch (nombreInfComp) {
      case "ESTRATO":
        this.estudiante.InfoSocioeconomica.Estrato = JSON.parse(infComp.Dato).ESTRATO;
        break;

      case "PUNTAJE_SISBEN":
        this.estudiante.InfoResidencia.Puntaje_Sisben = infComp.Dato;
        break;

      case "CABEZA_FAMILIA":
        this.estudiante.InfoSocioeconomica.CabezaFamilar = JSON.parse(infComp.Dato);
        break;

      case "HIJOS":
        this.estudiante.InfoSocioeconomica.Hijos = JSON.parse(infComp.Dato).value;
        break;

      case "NUMERO_HIJOS":
        this.estudiante.InfoSocioeconomica.NumeroHijos = infComp.Dato;
        break;

      case "NUMERO_HERMANOS":
        this.estudiante.InfoSocioeconomica.NumeroHermanos = infComp.Dato;
        break;
  

      default:
        break;
    }
  }

  agregarInformacionContacto(infComp: InfoComplementariaTercero) {
    const nombreInfComp = infComp.InfoComplementariaId.Nombre;
    switch (nombreInfComp) {
      case "CORREO INSTITUCIONAL":
        this.estudiante.Correo_Institucional = JSON.parse(infComp.Dato).value;
        break;

      case "TELEFONO":
        this.estudiante.InfoResidencia.Telefono = JSON.parse(infComp.Dato).telefono;
        break;

      case "CELULAR":
        this.estudiante.Celular = infComp.Dato;
        break;

      case "CORREO":
        this.estudiante.Correo = JSON.parse(infComp.Dato).value;
        break;

      case "DIRECCIÓN":
        this.estudiante.InfoResidencia.Direccion = JSON.parse(infComp.Dato).Data;
        /* "Dato": "{\"DIRECCIÓN\":\"CL 60 A SUR # 73 - 41\",\"ZONA\":\"URBANA\",\"GENERO\":\"MIXTO\",\"DANE11\":\"51100202578\",\"DANE12\":\"111001107816\",\"CLASE\":\"DISTRITAL\",\"NAT_JURIDICA\":\"OFICIAL\",\"ESTADO\":\"ANTIGUO ACTIVO\"}", */
        break;

      case "LUGAR_RESIDENCIA":
        /* "Dato": "447" */
        this.estudiante.InfoResidencia.Municipio = JSON.parse(infComp.Dato);
        break;

      case "LOCALIDAD":
        this.estudiante.InfoResidencia.Localidad = JSON.parse(infComp.Dato).LOCALIDAD;
        break;

      default:
        break;
    }
  }

  private inicializarFormularios() {
    this.loadEstudiante().then(
      () => {
        console.log("Inicializamos formularios");
        this.registro = new FormGroup({
          nombres: new FormControl({ value: this.estudiante.Nombre, disabled: true }),
          codigo: new FormControl({ value: this.estudiante.Carnet.Numero, disabled: true }),
          documento: new FormControl({ value: this.estudiante.Documento.Numero, disabled: true }),
          tipoDocumento: new FormControl({ value: this.estudiante.Documento.TipoDocumentoId.Nombre, disabled: true }),
          proyecto: new FormControl({ value: this.estudiante.ProyectoCurricular, disabled: true }),
          facultad: new FormControl({ value: this.estudiante.Facultad, disabled: true }),
          fechaNacimiento: new FormControl({ value: this.estudiante.FechaNacimiento, disabled: true }),
          email_institucional: new FormControl({ value: this.estudiante.Correo_Institucional, disabled: true }),
          email: new FormControl({ value: this.estudiante.Correo, disabled: true }),
          celular: new FormControl({ value: this.estudiante.Celular, disabled: true }),
          programa: new FormControl(),
          genero: new FormControl({ value: this.estudiante.Genero, disabled: true }),
        });

        this.residencia = new FormGroup({
          localidad: new FormControl({ value: this.estudiante.InfoResidencia.Localidad, disabled: true }),
          municipio: new FormControl({ value: this.estudiante.InfoResidencia.Municipio, disabled: true }),
          direccion: new FormControl({ value: this.estudiante.InfoResidencia.Direccion, disabled: true }),
          barrio: new FormControl({ value: this.estudiante.InfoResidencia.Barrio, disabled: true }),
          telefono: new FormControl({ value: this.estudiante.InfoResidencia.Telefono, disabled: true }),
          sisben: new FormControl({ value: this.estudiante.InfoResidencia.Sisben, disabled: true }),
          puntaje_Sisben: new FormControl({ value: this.estudiante.InfoResidencia.Puntaje_Sisben, disabled: true }),
        });

        this.especial = new FormGroup({
          condicionDesplazado: new FormControl({ }),
          condicionEspecial: new FormControl({ }),
          discapacidad: new FormControl({ }),
          patologia: new FormControl({ }),
          seguridadSocial: new FormControl({ }),
          serPiloPaga: new FormControl({ }),
        });

        this.menores = new FormGroup({
          menoresEdad: new FormControl({ }),
          menoresEstudiantes: new FormControl({ }),
          grupoMenoresSisben: new FormControl({ }),
        });

        this.necesidades = new FormGroup({
          calidadVivienda: new FormControl({ }),
          cuartosDormir: new FormControl({ }),
          personasHogar: new FormControl({ }),
          serviciosPublicos: new FormControl({ }),
          origenAgua: new FormControl({ }),
          aguasNegras: new FormControl({ }),
        });
        /* 
         localidad: new FormControl({ value: this.estudiante.InfoResidencia.Localidad, disabled: true }),
          barrio: new FormControl({ value:this.estudiante.InfoResidencia.Barrio , disabled: true }),
          direccion: new FormControl({ value:this.estudiante.InfoResidencia.Direccion , disabled: true }),
          telefono: new FormControl({ value:this.estudiante.InfoResidencia.Telefono , disabled: true }),
          email: new FormControl('', Validators.required), */

        this.socioeconomica = new FormGroup({
          estadocivil: new FormControl(),
          estrato: new FormControl(),
          ingresosMensuales: new FormControl(),
          cabezaFamilar: new FormControl(),
          dependenciaEconomica: new FormControl(),
          valorMatricula: new FormControl(),
          personasACargo: new FormControl(),
          hijos: new FormControl(),
          numeroHijos: new FormControl(),
          pagaArriendo: new FormControl(),
          zonaVulnerabilidad: new FormControl(),
          numeroHermanos: new FormControl(),
          conQuienVive: new FormControl(),
          tipoColegio: new FormControl(),
          tipoVivienda: new FormControl(),
          descDis: new FormControl(),
        });

        this.colegio = new FormGroup({
          pension: new FormControl(),
        });

        this.vivienda = new FormGroup({});

        this.futurofort = new FormGroup({});

        this.documentos = new FormGroup({});

        this.doccertificadoingreso = new FormGroup({});

        this.peracargo = new FormGroup({});

        this.registrocivil = new FormGroup({

          edad: new FormControl(),
          numero_hijos: new FormControl(),

        });
        this.desplazado = new FormGroup({});

        this.recibopago = new FormGroup({

          valor_matricula: new FormControl(),

        });
        this.otrosdoc = new FormGroup({});

        this.loading = false;
      }
    ).catch(error => {
      console.error(error);
      if (!error.status) {
        error.status = 409;
      }
      Swal.fire({
        type: 'error',
        title: error.status + ' Load info estudiante',
        text: this.translate.instant('ERROR.' + error.status),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    });

  }

  public loadInformacionTercero(): Promise<any> {
    return new Promise((resolve, reject) => {
      let procesosPendientes = 0;
      let usuarioWSO2 = (this.autenticacion.getPayload()).email
        ? ((this.autenticacion.getPayload()).email.split('@')).shift()
        : (this.autenticacion.getPayload()).sub;
      console.info(`Login de ${usuarioWSO2}`);
      usuarioWSO2 = "daromeror";
      /* const idTercero = 9823; */
      this.tercerosService.get(`tercero?query=UsuarioWSO2:${usuarioWSO2}`)
        .subscribe(res => {
          procesosPendientes += 1;
          if (Object.keys(res[0]).length > 0) {
            this.tercero = <Tercero>res[0];

            //Se carga el carnet estudiantil y los documentos.
            if (!isNaN(this.tercero.Id)) {
              this.tercerosService.get(`datos_identificacion?query=TerceroId.Id:${this.tercero.Id}&sortby=id&order=desc`)
                .subscribe(result => {
                  console.info(result);
                  for (let i = 0; i < result.length; i++) {
                    if (result[i].TipoDocumentoId.CodigoAbreviacion == "CODE") {
                      this.estudiante.Carnet = result[i];
                    } else {
                      this.estudiante.Documento = result[i];
                    }
                  }

                }, (error: HttpErrorResponse) => {
                  Swal.fire({
                    type: 'error',
                    title: error.status + '',
                    text: this.translate.instant('ERROR.' + error.status),
                    footer: this.translate.instant('GLOBAL.cargar') + '-' +
                      this.translate.instant('GLOBAL.info_complementaria'),
                    confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                  });
                });

              /* Cargamos solicitud */
              this.solicitudService.get(`solicitante?query=TerceroId:${this.tercero.Id}`)
                .subscribe(
                  (result: any[]) => {
                    let solicitante: Solicitante;
                    console.log(result);
                    if (Object.keys(result[0]).length > 0) {
                      console.log("entro al if");
                      for (solicitante of result) {
                        const sol: Solicitud = solicitante.SolicitudId;
                        if (sol.EstadoTipoSolicitudId.Id === environment.IDS.IDSOLICITUDRADICADA) {
                          let refSol: ReferenciaSolicitud;
                          try {
                            refSol = JSON.parse(sol.Referencia);
                            if (refSol != null) {
                              if (refSol.Periodo === this.periodo.Nombre) {
                                this.solicitud = sol;
                                this.referenciaSolicitud = refSol;
                              }
                            }
                          } catch (error) {
                            console.error(error);
                          }
                        }

                        console.log("Se resolvio")
                        procesosPendientes -= 1;
                        if (procesosPendientes == 0) {
                          resolve(true);
                        } else {
                          resolve(false);
                        }

                      }
                    }
                    else {
                      this.solicitud = null;
                      procesosPendientes -= 1;
                      if (procesosPendientes == 0) {
                        resolve(true);
                      }
                    }
                  },
                  error => {
                    this.solicitud = null;
                  },
                );

            }
          }
        },
          (error: HttpErrorResponse) => {
            Swal.fire({
              type: 'error',
              title: error.status + '',
              text: this.translate.instant('ERROR.' + error.status),
              footer: this.translate.instant('GLOBAL.cargar') + '-' +
                this.translate.instant('GLOBAL.info_persona'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            reject(error);
          });

    });
  }

  public loadPeriodo(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.listService.findParametroPeriodoSp(environment.IDS.IDINSCRIPCIONES)
        .subscribe(
          (result: any[]) => {
            console.info('Entro')
            if (result['Data'].length > 0) {
              this.periodo = result['Data'][0].PeriodoId;
              console.log(this.periodo)
              /* this.loadTerceroSp(); */
            } else {

            }
            /* reject(true); */

            resolve(true);
          },
          error => {
            this.periodo = null;

            reject(error);
          },
        );
    });

  }

  public loadInformacionCompletaEstudiante(): Promise<any> {
    return new Promise((resolve, reject) => {
      let procesosPendientes = 2;
      console.log("Cargando proyecto")
      //this.academicaService.get(`datos_basicos_estudiante/${this.carnetEstudiantil.Numero}`)
      this.academicaService.get(`datos_basicos_estudiante/${this.estudiante.Carnet.Numero}`)
        .subscribe(result => {
          console.log("Iniciamos proceso proyecto", procesosPendientes)
          console.info(result);
          const cod_carrera = result["datosEstudianteCollection"]["datosBasicosEstudiante"][0].carrera;
          console.info(cod_carrera);
          //this.academicaService.get(`carrera/${this.cod_carrera}`)

          this.academicaService.get(`carrera/20`)
            .subscribe(resp => {
              console.info(resp.carrerasCollection.carrera[0].nombre);
              const proyecto = resp.carrerasCollection.carrera[0].nombre;
              this.estudiante.ProyectoCurricular = proyecto;
              console.info(this.estudiante.ProyectoCurricular)
              procesosPendientes -= 1;
              console.log("Terminamos proceso proyecto", procesosPendientes)
              if (procesosPendientes == 0) {
                console.log("Resolve")
                resolve(true);
              } else {
                console.log("Procesos pendientes esperando...")
                /* resolve(false); */
              }
              /* resolve(true); */
              //this.estudiante.Proyecto=proyecto;

            }, (error: HttpErrorResponse) => {
              reject(error);
              Swal.fire({
                type: 'error',
                title: error.status + '',
                text: this.translate.instant('ERROR.' + error.status),
                footer: this.translate.instant('GLOBAL.cargar') + '-' +
                  this.translate.instant('GLOBAL.academica'),
                confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
              });
            });

        }, (error: HttpErrorResponse) => {
          reject(error);
          Swal.fire({
            type: 'error',
            title: error.status + '',
            text: this.translate.instant('ERROR.' + error.status),
            footer: this.translate.instant('GLOBAL.cargar') + '-' +
              this.translate.instant('GLOBAL.academica'),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });

        });

      /* Cargamos la informacion complementaria */
      if (!isNaN(this.tercero.Id)) {
        /* this.tercerosService.get('info_complementaria_tercero/?limit=1000') */
          this.tercerosService.get('info_complementaria_tercero/?query=TerceroId__Id:' +
            (this.tercero.Id) + '&limit=-1')
          .subscribe(resp => {
            console.log("Empezamos proceso info_complementaria", procesosPendientes)

            for (let i = 0; i < resp.length; i++) {
              /* console.log(resp[i]); */
              if(Object.keys(resp[i]).length>0){
                this.listInfoComplementaria.push(resp[i]);
              }
            }
            console.log(this.listInfoComplementaria);
            procesosPendientes -= 1;
            console.log("Terminamos proceso info_complementaria", procesosPendientes)
            if (procesosPendientes === 0) {
              console.log("Resolve");
              resolve(true);

            } else {
              console.log("Procesos pendientes esperando...");
              /* resolve(false); */
            }


          }, (error: HttpErrorResponse) => {
            reject(error);
            Swal.fire({
              type: 'error',
              title: error.status + '',
              text: this.translate.instant('ERROR.' + error.status),
              footer: this.translate.instant('GLOBAL.cargar') + '-' +
                this.translate.instant('GLOBAL.info_complementaria'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
          });
      }

    });

  }

  

  loadInfoComplementariaTercero(): void {
    if (!isNaN(this.tercero.Id)) {

      this.tercerosService.get('info_complementaria_tercero/?limit=100')
        /* this.tercerosService.get('info_complementaria_tercero/?query=TerceroId__Id:' +
          (this.tercero.Id) + '&limit=-1') */
        .subscribe(resp => {
          for (let i = 0; i < resp.length; i++) {
            /* console.log(resp[i]); */
            this.listInfoComplementaria.push(resp[i]);
          }
          console.log(this.listInfoComplementaria);

        }, (error: HttpErrorResponse) => {
          Swal.fire({
            type: 'error',
            title: error.status + '',
            text: this.translate.instant('ERROR.' + error.status),
            footer: this.translate.instant('GLOBAL.cargar') + '-' +
              this.translate.instant('GLOBAL.info_complementaria'),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        });
    }
  }

  loadGrupinfoComplementaria(): void {
    console.log("GrupoInfoComplementaria");
    /* this.tercerosService.get('info_complementaria/?query=Nombre:AREA_CONOCIMIENTO')
      .subscribe(res => {
        this.AREA_CONOCIMIENTO = res;
        this.tercerosService.get('info_complementaria/?query=Nombre:FORMACION_ACADEMICA')
          .subscribe(resp => {
            this.NIVEL_FORMACION = resp
            this.tercerosService.get('info_complementaria/?query=Nombre:INSTITUCION')
              .subscribe(rest => {
                this.INSTITUCION = rest
              }, (error: HttpErrorResponse) => {
                Swal({
                  type: 'error',
                  title: error.status + '',
                  text: this.translate.instant('ERROR.' + error.status),
                  footer: this.translate.instant('GLOBAL.cargar') + '-' +
                    this.translate.instant('GLOBAL.info_complementaria'),
                  confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                });
              });
          }, (error: HttpErrorResponse) => {
            Swal({
              type: 'error',
              title: error.status + '',
              text: this.translate.instant('ERROR.' + error.status),
              footer: this.translate.instant('GLOBAL.cargar') + '-' +
                this.translate.instant('GLOBAL.info_complementaria'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
          });
      }, (error: HttpErrorResponse) => {
        Swal({
          type: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          footer: this.translate.instant('GLOBAL.cargar') + '-' +
            this.translate.instant('GLOBAL.info_complementaria'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      }); */
  }

  ngOnInit() {
  }

  sendData(form: NgForm) {

  }

  llamardialogo() {
    this.dialog.open(this.dialogo);
  }

  registrar() {
    /* var codigoValue = (<HTMLInputElement>document.getElementById("codigo")).value; */
    Swal.fire({
      title: 'Está seguro?',
      text: `Desea solicitar apoyo alimentario para ${this.tercero.NombreCompleto}`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }
    ).then(async resp => {
      if (resp.value) {

        Swal.fire({
          title: 'Espere',
          text: 'Procesando su solicitud',
          type: 'question',
          allowOutsideClick: false,
        });
        Swal.showLoading();

        if (this.solicitud == null) {
          console.log("Se crea solicitud")
          let refSol: ReferenciaSolicitud = new ReferenciaSolicitud();

          console.log("Se creo la referencia")
          console.log(this.periodo.Nombre);
          console.log(refSol.Periodo);
          refSol.Periodo = this.periodo.Nombre;
          console.log("Se tiene el periodo en la referencia");
          this.listService.crearSolicitudApoyoAlimentario(+this.tercero.Id, refSol);
        } else {
          console.log("ya existe no se crea")
        }

        Swal.fire({
          title: "titulo",
          text: 'Se cargaron los datos de forma correcta',
          type: 'success'
        });

      }
    });
    return false;
  }
  private update() {
    console.log("Update");
    console.log(this.solicitud);
  }

}
