import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { RegistroInscritoModel } from "../../modelos/registroInscrito.model";
import { ListService } from "../../../../@core/store/list.service";
import { Periodo } from "../../../../@core/data/models/parametro/periodo";
import { DatePipe } from "@angular/common";
import { formatDate } from "@angular/common";
import { environment } from "../../../../../environments/environment";
import { OikosService } from "../../../../@core/data/oikos.service";
import { Tercero } from "../../../../@core/data/models/terceros/tercero";
import { ApoyoAlimentarioService } from "../../../../@core/data/apoyo-alimentario.service";
import { Registro } from "../../../../@core/data/models/registro";
import { UtilService } from '../../../../shared/services/utilService';
import { ApoyoAlimentario } from "../../../../@core/data/models/apoyo-alimentario";
import { Solicitante } from "../../../../@core/data/models/solicitud/solicitante";

@Component({
  selector: "ngx-inscritos",
  templateUrl: "./inscritos.component.html",
  styleUrls: ["./inscritos.component.scss"],
})


export class InscritosComponent implements OnInit {


  
  noBeneficiarios: boolean;
  sedesAcceso = [];
  facultadAccesso = [];
  registros = [];
  registroBase = new RegistroInscritoModel();
  periodo: Periodo = null;
  myDate = formatDate(new Date(), "yyyy-MM-dd", "en");
  usuarioWSO2 = "";

  //Ajustar segun las necesidades
  estados_validos=['V','A'];

  constructor(
    private oikosService: OikosService,
    private datePipe: DatePipe,
    private utilsService: UtilService,
    private listService: ListService,
    private apoyoAlimentarioService: ApoyoAlimentarioService,
  ) {
    Swal.fire({
      title: "Por favor espere!",
      html: `cargando información de formulario`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    this.usuarioWSO2 = this.utilsService.getUsuarioWSO2();
    this.myDate = this.datePipe.transform(this.myDate, "yyyy-MM-dd");
    this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDSERVICIOAPOYO, true).then((resp) => {
      if (resp.length > 0) {
        this.periodo = resp[0].PeriodoId;
      } else {
        this.periodo = null;
      }
    }).catch((err) => this.utilsService.showSwAlertError("Cargar periodo", err));

    this.listService.cargarSedesApoyo()
      .then((sedes) => {
        this.sedesAcceso=sedes
        if (this.sedesAcceso != []) {
          this.cargarFacultades();
        }
      })
      .catch((error) => {
        Swal.close();
        Swal.fire("Error", `<p>${error}</p>`, "error");
      });
  }

  async ngOnInit() {
    this.noBeneficiarios = false;
  }

  /**
   *Recibe un formulario del html para validad y guardar un registro de apoyo
   *
   * @param {NgForm} form
   * @return {*} 
   * @memberof InscritosComponent
   */
  async guardar(form: NgForm) {
    if (form.invalid || this.sedesAcceso.length === 0) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    Swal.fire({
      title: 'Guardando registro apoyo',
      html: `<b></b> ... espere`,
      timerProgressBar: true,
      willOpen: () => {
        Swal.showLoading();
      },
    });


    this.registroBase.sede = form.value["sede"];

    /* Asociamos tercero con el documento */
    const content = Swal.getContent();
    const b = content.querySelector('b');

    b.textContent = `Buscando usuario por documento`;

    this.listService.loadTerceroByDocumento(this.registroBase.codigo).then((resp) => {
      const terceroReg: Tercero = resp;
      let solicitudId: number = 0;
      /* Se encuentra el tercero */
      if (terceroReg !== undefined) {
        b.textContent = `Buscando solicitud asociada`;
        this.listService.loadSolicitanteByIdTercero(terceroReg.Id, environment.IDS.IDSOLICITUDACEPTADA, this.periodo.Nombre, true)
          .then((listSolicitante) => {
            /* Validamos si esta inscrito, o si se permiten no inscritos y el estudiante esta activo */
            if (listSolicitante.length > 0) {
              solicitudId = listSolicitante[0].SolicitudId.Id;
            }

            this.permitirRegistroNoInscrito(listSolicitante, terceroReg.Id).then(
              (permitir) => {
                b.textContent = `Buscando facultad del estudiante`;
                this.listService.loadFacultadProyectoTercero(terceroReg.Id).then((nomFacultad) => {
                  if (nomFacultad[0] == this.facultadAccesso[this.registroBase.sede]) {
                    b.textContent = `Guardando registro`;
                    this.registrar(this.registroBase.sede, solicitudId, terceroReg.Id).then((msj) => {
                      this.showToast(`${this.registroBase.codigo}`, `${msj} ${solicitudId != 0 ? 'Beneficiario' : 'No beneficiario'} ${terceroReg.NombreCompleto}`);
                    }).catch((error) => {
                      this.showError(`${this.registroBase.codigo}`, terceroReg.NombreCompleto+" "+error);
                    });
                  }
                  else {
                    this.utilsService.showSwAlertQuery('Estudiante de otra facultad', "¿Deseas aceptar este registro?", 'Registrar')
                      .then(
                        (resp) => {
                          if (resp) {
                            Swal.fire({
                              title: 'Guardando registro apoyo',
                              html: `<b>Guardando registro</b> ... espere`,
                              timerProgressBar: true,
                              willOpen: () => {
                                Swal.showLoading();
                              },
                            });
                            this.registrar(this.registroBase.sede, solicitudId, terceroReg.Id).then((msj) => {
                              this.showToast(`${this.registroBase.codigo}`, `${msj} ${solicitudId != 0 ? 'Beneficiario' : 'No beneficiario'} ${terceroReg.NombreCompleto}`);
                            }).catch((error) => {
                              this.showError(`${this.registroBase.codigo}`, terceroReg.NombreCompleto+" "+error);
                            });
                          } else {
                            this.showError(`${this.registroBase.codigo}`, `${terceroReg.NombreCompleto} es de otra facultad`);
                          }
                        });
                  }
                })
                  .catch((error) => {
                    this.showError(`${this.registroBase.codigo}`, terceroReg.NombreCompleto+" "+error);
                  });
              }
            ).catch((error) => this.showError(`${this.registroBase.codigo}`, terceroReg.NombreCompleto+" "+error));
            Object.values(form.controls).forEach((control) => {
              control.markAsUntouched();
            });
            form.value["codigo"] = "";
          });
      } else {
        this.showError(`${this.registroBase.codigo}`, "Identificacion no asociada a un estudiante");
        this.registroBase.codigo='';
      }
    });
  }

  /**
   *Valida que se pueda hacer el registro de caso no beneficiario
   *
   * @param {Solicitante[]} resp
   * @param {number} terceroId
   * @return {*}  {Promise<boolean>}
   * @memberof InscritosComponent
   */
  permitirRegistroNoInscrito(resp: Solicitante[], terceroId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (resp.length == 0) {
        if (this.noBeneficiarios) {
          const content = Swal.getContent();
          if (content) {
            const b = content.querySelector('b');
            if (b) {
              b.textContent = `Buscando estado del estudiante`;
            }
          }
          this.listService.cargarEstadoTercero(terceroId).then((estado) => {
            //Cambiar por A
            if (this.estados_validos.includes(estado)) {
              resolve(true);
            } else {
              reject(`tiene el estado: ${estado}`);
            }
          }).catch((error) => {
            reject(error);
          });
        } else {
          reject("no es beneficiario")
        }
      } else {
        resolve(true);
      }
    });
  }

  /**
   *Guarda un registro despues de estar ya comprobado
   *
   * @private
   * @param {string} idSede
   * @param {number} idSolicitud
   * @param {number} idTercero
   * @return {*}  {Promise<any>}
   * @memberof InscritosComponent
   */
  private registrar(idSede: string, idSolicitud: number, idTercero: number): Promise<any> {
    return new Promise((resolve, reject) => {
      /*     resolve(`Registro #${145}`); */
      if (idTercero != null && idTercero > 0) {
        const idSed = this.sedesAcceso[idSede].Id;
        let apoyoAlimentario = new ApoyoAlimentario();
        apoyoAlimentario.espacioFisicoId = idSed;
        apoyoAlimentario.periodoId = this.periodo.Id;
        apoyoAlimentario.solicitudId = idSolicitud;
        apoyoAlimentario.terceroId = idTercero;
        apoyoAlimentario.usuarioAdministrador = this.usuarioWSO2;
        apoyoAlimentario.fechaRegistro= this.myDate;
        this.listService.consutarRegitroApoyo(idTercero,null,null,this.periodo.Id, this.myDate ,true,1,null).then((regAnt)=>{
          if (regAnt.length==0) {
            this.apoyoAlimentarioService.post('apoyo_alimentario', apoyoAlimentario)
              .subscribe(res => {
                resolve(`Registro #${res.Data._id}`);
              }, (error) => reject(error));
          } else {
            
            //let fechaReg=`${regAnt[0].fecha_creacion.split('T')[1].split('.')[0]} del ${regAnt[0].fecha_creacion.split('T')[0]} `;
            reject(`ya uso el servicio a las ${this.utilsService.UTCtoGTM(regAnt[0].fecha_creacion)}`)

          }
        })
      
      } else {
        this.utilsService.showSwAlertError('Error al registrar', "No se encontro el usuario que se va a registrar, intente nuevamente")
      }
    });
  }

  /**
   *Carga las facultades de las sedes 
   *
   * @memberof InscritosComponent
   */
  async cargarFacultades() {
    for (let i = 0; i < this.sedesAcceso.length; i++) {
      this.facultadAccesso.push("");
    }
    for (let i = 0; i < this.sedesAcceso.length; i++) {
      this.oikosService
        .get(
          `asignacion_espacio_fisico_dependencia?query=EspacioFisicoId.Nombre:${this.sedesAcceso[i].Nombre}&limit=-1`
        )
        .subscribe((result) => {
          for (let j = 0; j < result.length; j++) {
            let nomDependencia = result[j].DependenciaId.Nombre;
            var splitted = nomDependencia.split(" ", 1);
            if (splitted[0] == "FACULTAD") {
              this.facultadAccesso[i] = nomDependencia;
              break;
            }
          }
          Swal.close();
        });
    }
  }

  /**
   *Muestra Toasat de que salio bien y guarda el registro
   *
   * @param {*} titulo
   * @param {*} mensaje
   * @memberof InscritosComponent
   */
  showToast(titulo, mensaje) {
    Swal.close();
    let reg = new Registro(titulo, mensaje, "alert-success");
    this.agregarRegistro(reg);
    this.utilsService.showToastAlert(titulo, mensaje, null, 2000, null);
    this.registroBase.codigo = "";
  }

  /**
   *Muestra Toast de que salio algo mal y guarda el registro
   *
   * @param {*} titulo
   * @param {*} error
   * @memberof InscritosComponent
   */
  showError(titulo, error) {
    Swal.close();
    let reg = new Registro(titulo, error, "alert-danger");
    this.agregarRegistro(reg);
    
    this.utilsService.showToastError(titulo, error, "alert-circle-outline");
    this.registroBase.codigo = "";
  }

  private agregarRegistro(reg){
    //const newRegisters = (originArray.slice().reverse().concat(reg)).reverse(); // ES5
    this.registros = [reg, ...this.registros]; // ES6+
  }

}
