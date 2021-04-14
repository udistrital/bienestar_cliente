import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { environment } from "../../../../../environments/environment";
import { Periodo } from "../../../../@core/data/models/parametro/periodo";
import { ListService } from "../../../../@core/store/list.service";
import { Solicitud } from "../../../../@core/data/models/solicitud/solicitud";
import { ImplicitAutenticationService } from "../../../../@core/utils/implicit_autentication.service";
import { Tercero } from "../../../../@core/data/models/terceros/tercero";
import { TercerosService } from "../../../../@core/data/terceros.service";
import { SolicitudService } from "../../../../@core/data/solicitud.service";
import { Solicitante } from "../../../../@core/data/models/solicitud/solicitante";
import { ReferenciaSolicitud } from "../../../../@core/data/models/solicitud/referencia-solicitud";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { ViewChild } from "@angular/core";
import { TemplateRef } from "@angular/core";
import { ApiConstanst } from "../../../../shared/constants/api.constans";
import { TranslateService } from "@ngx-translate/core";
import { AcademicaService } from "../../../../@core/data/academica.service";
import { InfoCompletaEstudiante } from "../../../../@core/data/models/info-completa-estudiante/info-completa-estudiante";
import { DatePipe } from "@angular/common";
import { InfoComplementariaTercero } from "../../../../@core/data/models/terceros/info_complementaria_tercero";
import { UtilService } from "../../../../shared/services/utilService";
import { OikosService } from '../../../../@core/data/oikos.service';

@Component({
  selector: "ngx-solicitud-tercero",
  templateUrl: "./solicitud-tercero.component.html",
  styleUrls: ["./solicitud-tercero.component.scss"],
})
export class SolicitudTerceroComponent implements OnInit {
  tercero: Tercero = null;
  solicitud: Solicitud = null;
  periodo: Periodo = null;
  referenciaSolicitud: ReferenciaSolicitud = null;
  estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante();
  listInfoComplementaria = [];

  username: string = "";
  private autenticacion = new ImplicitAutenticationService();
  facultades: Array<string> = ["ARTES ASAB", "CIENCIAS Y EDUCACIÓN"];
  proyectos: Array<string> = [
    "Sistematizacion de datos",
    "Industrial",
    "Eléctrica",
    "Mecánica",
  ];
  localidades: Array<string> = ["Bosa", "Usme", "Ciudad Bolivar", "Kennedy"];
  municipios: Array<string> = ["Bogota", "Sumapaz", "Otros"];
  estadocivil: Array<string> = ["Soltero", "Casado", "Separado"];

  registro: FormGroup;
  residencia: FormGroup;
  sisben: FormGroup;
  socioeconomica: FormGroup;
  necesidades: FormGroup;
  especial: FormGroup;
  menores: FormGroup;

  colegio: FormGroup;
  vivienda: FormGroup;
  futurofort: FormGroup;
  documentos: FormGroup;
  doccertificadoingreso: FormGroup;
  personasacargo: FormGroup;
  registrocivil: FormGroup;
  desplazado: FormGroup;
  recibopago: FormGroup;
  otrosdoc: FormGroup;
  @ViewChild("dialogo", { read: null, static: null }) dialogo: TemplateRef<any>;

  APP_CONSTANTS = ApiConstanst;
  loading: boolean = true;
  isPost: boolean = true;

  constructor(
    private translate: TranslateService,
    private utilService: UtilService,
    private listService: ListService,
    private tercerosService: TercerosService,
    private academicaService: AcademicaService,
    private solicitudService: SolicitudService,
    private oikosService: OikosService,
    private dialog: MatDialog
  ) {
    Swal.fire({
      title: "Por favor espere!",
      html: `cargando información de formulario`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();

    /* Cargamos periodo con inscripciones activas */
    this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDINSCRIPCIONES, true).then(
      (resp) => {
        console.log(resp);
        if (resp != []) {
          this.periodo = resp[0].PeriodoId;
          console.log(this.periodo);

          let usuarioWSO2 = this.autenticacion.getPayload().email
            ? this.autenticacion.getPayload().email.split("@").shift()
            : this.autenticacion.getPayload().sub;
          usuarioWSO2 = "daromeror";
          //usuarioWSO2 = "sagomezl";

          this.listService.loadTerceroByWSO2(usuarioWSO2).then((respTecero) => {
            console.log("loadTerceroByWSO2");
            this.tercero = respTecero;
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
              if(this.estudiante.Carnet!=null && this.estudiante.Documento){
                this.listService.loadSolicitanteByIdTercero(this.tercero.Id, null, this.periodo.Nombre, null)
                  .then((listSolicitantes) => {
                    console.log("loadSolicitanteByIdTercero");
                    
                    if(listSolicitantes.length>0){
                      this.listService.loadSolicitud(listSolicitantes[0].SolicitudId.Id).then((sol)=>{
                        this.solicitud=sol;
                        console.log(this.solicitud);
                        this.loading=false;
                        Swal.close();
                      }).catch((errorSol)=> this.showError(errorSol));
                    }else{
                      console.log("Iniciamos formularios");
                      
                      this.inicializarFormularios();
                    }
                  }).catch((errorSolT) => {
                    this.showError(errorSolT);
                  });
              }else{
                this.showError("No se encontro el carnet y documento de indentificacion");
              }
            }).catch((errorDocs)=>this.showError(errorDocs));

          }).catch((errorT) => this.showError(errorT));

        } else {
          this.showError("no hay periodo F");
        }
      }).catch((error) => {
        this.showError(error);
      });

  }
 

  /* Clasifica la informacion de listInfoComplementaria */
  loadEstudiante(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.estudiante.Nombre = this.tercero.NombreCompleto;
      var datePipe = new DatePipe("en-US");
      this.estudiante.FechaNacimiento = datePipe.transform(
        this.tercero.FechaNacimiento,
        "dd/MM/yyyy"
      );
      let infComp: InfoComplementariaTercero;

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
    switch (nombreInfComp) {
      case "CORREO INSTITUCIONAL":
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

  /* Carga los datos a estudiante y crea los formularios reactivos */
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
        Swal.fire({
          icon: "error",
          title: error.status + " Load info estudiante",
          text: this.translate.instant("ERROR." + error.status),
          confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
        });
      });
  }

  ngOnInit() {
  }

  sendData(form: NgForm) { }

  registrar() {
    /* var codigoValue = (<HTMLInputElement>document.getElementById("codigo")).value; */
    Swal.fire({
      title: "Está seguro?",
      text: `Desea solicitar apoyo alimentario para ${this.tercero.NombreCompleto}`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
    }).then(async (resp) => {
      if (resp.value) {
        Swal.fire({
          title: "Espere",
          text: "Procesando su solicitud",
          icon: "question",
          allowOutsideClick: false,
        });
        Swal.showLoading();

        if (this.solicitud == null) {
          let refSol: ReferenciaSolicitud = new ReferenciaSolicitud();

          refSol.Periodo = this.periodo.Nombre;
          this.listService.crearSolicitudApoyoAlimentario(
            +this.tercero.Id,
            refSol
          );
        } else {
          console.log("ya existe no se crea");
        }

        Swal.fire({
          title: "titulo",
          text: "Se cargaron los datos de forma correcta",
          icon: "success",
        });
      }
    });
    return false;
  }

  showError(msj: string) {
    this.loading=false;
    Swal.close();
    Swal.fire("Error",msj,"error");
  }


  async save() {
    const isValidTerm = await this.utilService.termsAndConditional();
    /* let caracterizaciones = [...this.comorbilidades, ...this.otros]; */

    if (isValidTerm) {
      this.registrar();
      console.log("Se guardoooo");
      /* Swal.fire({
        title: 'Información de caracterización',
        text: `Se ${this.isPost ? 'almacenará' : 'actualizará'} la información correspondiente a la caracterización`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: this.isPost ? 'Guardar' : 'Actualizar',
      }).then(result => {
        if (result.value) {
          Swal.fire({
            title: '¡Por favor espere!',
            html: this.isPost ? 'Guardando' : 'Actualizando' + ' caracterización',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading();
            },
          });

          if (this.tercero) {
            Swal.fire({
              title: this.isPost ? 'Guardando' : 'Actualizando' + ' caracterización',
              html: `<b></b> de ${caracterizaciones.length + this.vinculaciones.length} registros ${this.isPost ? 'almacenados' : 'actualizados'}`,
              timerProgressBar: true,
              willOpen: () => {
                Swal.showLoading();
              },
            });

            let vinculacionesC = this.vinculaciones.map((vinculacion: any) => {
              const newVinculacion = { ...vinculacion };
              newVinculacion.Alternancia = newVinculacion.isSelected;
              delete newVinculacion.label;
              delete newVinculacion.isSelected;
              delete newVinculacion.name;
              delete newVinculacion.nombreVinculacion;
              return newVinculacion
            })
            from(vinculacionesC)
              .subscribe((vinculacionC: any) => {
                this.request.put(environment.TERCEROS_SERVICE, 'vinculacion', vinculacionC, vinculacionC.Id)
                  .subscribe((data) => {

                  }),
                  error => {
                    Swal.fire({
                      title: 'error',
                      text: `${JSON.stringify(error)}`,
                      icon: 'error',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      confirmButtonText: `Aceptar`,
                    });
                  };
              })

            let updated = this.vinculaciones.length;
            from(caracterizaciones)
              .subscribe((caracterizacion: any) => {
                let caracterizacionTercero = {
                  TerceroId: { Id: this.tercero.Id },
                  InfoComplementariaId: {
                    Id: caracterizacion.Id,
                  },
                  Dato: JSON.stringify({ dato: caracterizacion.isSelected }),
                  Activo: true,
                };
                this.updateStorage()

                if (this.isPost) {
                  this.request
                    .post(environment.TERCEROS_SERVICE, 'info_complementaria_tercero/', caracterizacionTercero)
                    .subscribe((data: any) => {
                      const content = Swal.getContent();
                      if (content) {
                        const b = content.querySelector('b');
                        if (b) {
                          b.textContent = `${updated}`;
                        }
                      }
                      updated += 1;
                      if (updated === (caracterizaciones.length + this.vinculaciones.length)) {
                        Swal.close();
                        Swal.fire({
                          title: `Registro correcto`,
                          text: `Se ingresaron correctamente ${caracterizaciones.length + this.vinculaciones.length} registros`,
                          icon: 'success',
                        }).then((result) => {
                          if (result.value) {
                            this.router.navigate(['/pages']);
                          }
                        })
                        this.isPost = false;
                      }
                    }),
                    error => {
                      Swal.fire({
                        title: 'error',
                        text: `${JSON.stringify(error)}`,
                        icon: 'error',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: `Aceptar`,
                      });
                    };
                } else {
                  this.request
                    .put(environment.TERCEROS_SERVICE, 'info_complementaria_tercero', caracterizacionTercero, caracterizacion.form.Id)
                    .subscribe((data: any) => {
                      const content = Swal.getContent();
                      if (content) {
                        const b = content.querySelector('b');
                        if (b) {
                          b.textContent = `${updated}`;
                        }
                      }
                      updated += 1;
                      if (updated === (caracterizaciones.length + this.vinculaciones.length)) {
                        Swal.close();
                        Swal.fire({
                          title: `Actualización correcta`,
                          text: `Se actualizaron correctamente ${caracterizaciones.length + this.vinculaciones.length} registros`,
                          icon: 'success',
                        }).then((result) => {
                          if (result.value) {
                            this.router.navigate(['/pages']);
                          }
                        })
                      }
                    }),
                    error => {
                      Swal.fire({
                        title: 'error',
                        text: `${JSON.stringify(error)}`,
                        icon: 'error',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: `Aceptar`,
                      });
                    };
                }
              });
          }
        }
      });
    } */
    }
  }
}
