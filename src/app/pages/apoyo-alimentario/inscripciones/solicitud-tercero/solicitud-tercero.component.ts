import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ListService } from '../../../../@core/store/list.service';
import { IAppState } from '../../../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { delay, switchMap } from 'rxjs/operators';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { ImplicitAutenticationService } from '../../../../@core/utils/implicit_autentication.service';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { TercerosService } from '../../../../@core/data/terceros.service';
import { SolicitudService } from '../../../../@core/data/solicitud.service';
import { Solicitante } from '../../../../@core/data/models/solicitud/solicitante';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud'
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { ApiConstanst } from '../../../../shared/constants/api.constans';
import { IncripcionEstudianteService } from '../../../../shared/services/incripcion-estudiante.service';
import { ReliquidacionHelper } from '../../../../@core/helpers/reliquidacion/reliquidacionHelper';
import { DatosIdentificacion } from '../../../../@core/data/models/terceros/datos_identificacion';
import { TranslateService } from '@ngx-translate/core';
/* import {ReliquidacionHelper} from '../../@core/helpers/reliquidacion/reliquidacionHelper';
import { IncripcionEstudianteService } from '../../shared/services/incripcion-estudiante.service';
import { ApiConstanst } from '../../shared/constants/api.constans'; */



@Component({
  selector: 'ngx-solicitud-tercero',
  templateUrl: './solicitud-tercero.component.html',
  styleUrls: ['./solicitud-tercero.component.scss']
})
export class SolicitudTerceroComponent implements OnInit {
  tercero: Tercero = null;
  solicitud: Solicitud = null;
  periodo: Periodo = null;
  documentoIdentidad: DatosIdentificacion = null;
  carnetEstudiantil: DatosIdentificacion = null;
  listDocumentos = [];
  username: string = '';
  private autenticacion = new ImplicitAutenticationService;
  referenciaSolicitud: ReferenciaSolicitud = null;
  facultades: Array<string> = ['ARTES ASAB', 'CIENCIAS Y EDUCACIÓN'];
  proyectos: Array<string> = ['Sistematizacion de datos', 'Industrial', 'Eléctrica', 'Mecánica'];
  localidades: Array<string> = ['Bosa', 'Usme', 'Ciudad Bolivar', 'Kennedy'];
  municipios: Array<string> = ['Bogota', 'Sumapaz', 'Otros'];
  estadocivil: Array<string> = ['Soltero', 'Casado', 'Separado'];
  NIVEL_FORMACION2: any;

  registro: FormGroup;
  residencia: FormGroup;
  socioeconomica: FormGroup;
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

  estudiante: any;

  APP_CONSTANTS = ApiConstanst;
  loading: boolean;



  constructor(private router: Router,
    private translate: TranslateService,
    private listService: ListService,
    private tercerosService: TercerosService,
    private solicitudService: SolicitudService,
    private datePipe: DatePipe,
    private store: Store<IAppState>,
    private httpClient: HttpClient, private dialog: MatDialog,
    private reliquidacionHelper: ReliquidacionHelper,
    private inscripcionEstudianteService: IncripcionEstudianteService,) {
    this.loadInformacionTercero()
      .then(() => {
        this.loadPeriodoSp();
        this.loadInfoComplementariaTercero()
        this.loadGrupinfoComplementaria()
      })
      .catch(error => {
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


    this.registro = new FormGroup({
      codigo: new FormControl(),
      facultad: new FormControl(),
      proyecto: new FormControl(),
      nombres: new FormControl(),
      id: new FormControl(),
      edad: new FormControl(),
    });

    this.residencia = new FormGroup({
      barrio: new FormControl(),
      direccion: new FormControl(),
      telefono: new FormControl(),
      email: new FormControl(),
    });

    this.socioeconomica = new FormGroup({
      ingresosmensuales: new FormControl(),
      ing_mesual: new FormControl(),
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

    /* this.loadPeriodoSp() */

  }
  
  public loadInformacionTercero(): Promise<any> {
    return new Promise((resolve, reject) => {
      const usuarioWSO2 = (this.autenticacion.getPayload()).email
        ? ((this.autenticacion.getPayload()).email.split('@')).shift()
        : (this.autenticacion.getPayload()).sub;
      console.info(`Login de ${usuarioWSO2}`);
      const idTercero = 9445;
      this.loading = true;

      // hayq eu cambiar esto 
      this.tercerosService.get(`tercero?query=Id:${idTercero}`)
        .subscribe(res => {
          if (Object.keys(res[0]).length > 0) {
            this.tercero = <Tercero>res[0];

            if (!isNaN(this.tercero.Id)) {
              this.tercerosService.get(`datos_identificacion?query=TerceroId.Id:${this.tercero.Id}&sortby=id&order=desc`)
                .subscribe(result => {
                  console.info('Entro PETER PARKER');
                  console.info(result);
                  for (let i = 0; i < result.length; i++) {
                    if (result[i].TipoDocumentoId.CodigoAbreviacion == "CODE") {
                      this.carnetEstudiantil = result[i];
                    } else {
                      this.listDocumentos.push(result[i]);
                    }
                  }
                  resolve(true);
                }, (error: HttpErrorResponse) => {
                  Swal.fire({
                    type: 'error',
                    title: error.status + '',
                    text: this.translate.instant('ERROR.' + error.status),
                    footer: this.translate.instant('GLOBAL.cargar') + '-' +
                      this.translate.instant('GLOBAL.Informacion_complementaria'),
                    confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                  });
                });
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

  public loadPeriodoSp() {
    this.listService.findParametroPeriodoSp(environment.IDS.IDINSCRIPCIONES)
      .subscribe(
        (result: any[]) => {
          console.info('Entro')
          if (result['Data'].length > 0) {
            this.periodo = result['Data'][0].PeriodoId;
            /* this.loadTerceroSp(); */
          }
        },
        error => {
          this.periodo = null;
        },
      );
  }

  loadInfoComplementariaTercero(): void {
    if (!isNaN(this.tercero.Id)) {
      this.tercerosService.get('info_complementaria_tercero/?query=TerceroId__Id:' +
        (this.tercero.Id) + ',InfoComplementariaId__Nombre:CORREO')
        .subscribe(resp => {
          if (resp !== null && resp !== 'error') {
            console.log(resp);
            /* this.NIVEL_FORMACION2 = resp
            if (Object.keys(this.NIVEL_FORMACION2[0]).length > 0) {
              this.listaFormacion = JSON.parse(this.NIVEL_FORMACION2[this.NIVEL_FORMACION2.length - 1].Dato)['NivelFormacion']
              this.nivelFormacion = this.listNivelFormacion.find(value => value.Id === this.listaFormacion.Id)
              this.loadInfoGrupoAcademico()
            } */
          }
        }, (error: HttpErrorResponse) => {
          //  Swal({
          //    type: 'error',
          //    title: error.status + '',
          //    text: this.translate.instant('ERROR.' + error.status),
          //    footer: this.translate.instant('GLOBAL.cargar') + '-' +
          //      this.translate.instant('GLOBAL.Informacion_complementaria'),
          //    confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          //  });
        });
     /*  this.tercerosService.get('info_complementaria_tercero/?query=TerceroId__Id:' +
        (this.info_persona_id) + ',InfoComplementariaId__Nombre:INSTITUCION')
        .subscribe(rest => {
          if (rest !== null && rest !== 'error') {
            this.INSTITUCION2 = rest
            if (Object.keys(this.INSTITUCION2[0]).length > 0) {
              this.listaInsti = JSON.parse(this.INSTITUCION2[this.INSTITUCION2.length - 1].Dato)
              this.institucion = this.listaInsti.Institucion
            }
          }
        }, (error: HttpErrorResponse) => {
            Swal.fire({
              type: 'error',
              title: error.status + '',
              text: this.translate.instant('ERROR.' + error.status),
              footer: this.translate.instant('GLOBAL.cargar') + '-' +
                this.translate.instant('GLOBAL.Informacion_complementaria'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
        }); */
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
                    this.translate.instant('GLOBAL.Informacion_complementaria'),
                  confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                });
              });
          }, (error: HttpErrorResponse) => {
            Swal({
              type: 'error',
              title: error.status + '',
              text: this.translate.instant('ERROR.' + error.status),
              footer: this.translate.instant('GLOBAL.cargar') + '-' +
                this.translate.instant('GLOBAL.Informacion_complementaria'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
          });
      }, (error: HttpErrorResponse) => {
        Swal({
          type: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          footer: this.translate.instant('GLOBAL.cargar') + '-' +
            this.translate.instant('GLOBAL.Informacion_complementaria'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      }); */
  }

  public loadSolicitudSp() {
    this.solicitudService.get(`solicitante?query=TerceroId:${this.tercero.Id}`)
      .subscribe(
        (result: any[]) => {
          let solicitante: Solicitante;
          if (result.length > 0) {
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
            }
          }
          else {
            this.solicitud = null;
          }
          //this.solicitud=null
        },
        error => {
          this.solicitud = null;
        },
      );

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
