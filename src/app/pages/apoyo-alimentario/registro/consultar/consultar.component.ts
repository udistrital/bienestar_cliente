import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { ApoyoAlimentario } from '../../../../@core/data/models/apoyo-alimentario';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud';
import { ListService } from '../../../../@core/store/list.service';
import { UtilService } from '../../../../shared/services/utilService';

@Component({
  selector: 'ngx-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss']
})
export class ConsultarComponent implements OnInit {
  registros: ApoyoAlimentario[] = [];
  parametros: ParametroPeriodo[] = [];
  periodo: number = null;
  sedesAcceso: any[];
  sede: number = null;
  codigoEstudiante: number = undefined;
  fechaRegistroInicio: string = null;
  fechaRegistroFin: string = null;
  itemOffSet: number = 0;
  limite: number = 10;
  itemsLim: number[] = [5, 10, 25, 50, 100, 250, 500, 1000, 2500];
  pagina: number = 1;
  hasNext: boolean = true;
  modoRangoFechas = false;


  constructor(
    private listService: ListService,
    private utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDSERVICIOAPOYO, null).then((respParam) => {
      if (respParam.length > 0) {
        if (Object.keys(respParam[0]).length > 0) {
          this.parametros = respParam;
        }
      }
    });
    this.listService.cargarSedesApoyo()
      .then((sedes) => {
        this.sedesAcceso = sedes
      })
      .catch((error) => {
        this.utilService.showSwAlertError("Error interno", "No se pudo conectar para cargar las sedes")
      });

  }

  ngOnInit() {

    /** Se inicializa rango de fechas */
    /* let fechaTemp = new Date(Date.now());
    let initFecha = "";
    initFecha += fechaTemp.getFullYear() + "-";
    let mesTemp = fechaTemp.getMonth() + 1;
    let diaTemp = fechaTemp.getDate();
    if (mesTemp < 10) {
      initFecha += "0" + mesTemp + "-";
    } else {
      initFecha += mesTemp + "-";
    }
    if (diaTemp < 10) {
      initFecha += "0" + diaTemp;
    } else {
      initFecha += diaTemp;
    } */
    //xthis.fechaRegistroInicio=initFecha;
    //this.fechaRegistroFin=initFecha;
  }

  cambioFechaInicial() {
    this.modoRangoFechas = false;
    if (this.fechaRegistroFin == null) {
      if (this.fechaRegistroInicio != null) {
        this.fechaRegistroFin = this.fechaRegistroInicio;
      }
    } else {
      if (this.fechaRegistroInicio > this.fechaRegistroFin) {
        this.fechaRegistroFin = this.fechaRegistroInicio;
        this.utilService.showSwAlertError("Fecha inicial", "La fecha inicial no puede ser mayor a la final");
      } else {
        if (this.fechaRegistroInicio != this.fechaRegistroFin) {
          this.modoRangoFechas = true;
          this.limite = -1;
          this.itemOffSet = 0;
        }
      }
    }
  }

  cambioFechaFin() {
    this.modoRangoFechas = false;
    if (this.fechaRegistroInicio == null) {
      if (this.fechaRegistroFin != null) {
        this.fechaRegistroInicio = this.fechaRegistroFin;
      }
    } else {
      if (this.fechaRegistroInicio > this.fechaRegistroFin) {
        this.fechaRegistroInicio = this.fechaRegistroFin;
        this.utilService.showSwAlertError("Fecha fin", "La fecha final no puede ser menor a la inicial");
      } else {
        if (this.fechaRegistroInicio != this.fechaRegistroFin) {
          this.modoRangoFechas = true;
          this.limite = -1;
          this.itemOffSet = 0;
        }
      }
    }
  }

  limpiarFechas() {
    this.fechaRegistroInicio = null;
    this.fechaRegistroFin = null;
    this.modoRangoFechas = false;
  }

  /**
   *Hace una consulta en el api de registro apoyo 
   *
   * @param {*} numPg
   * @memberof ConsultarComponent
   */
  buscar(numPg) {
    if (this.modoRangoFechas) {
      if (this.codigoEstudiante != undefined) {
        this.listService.loadTerceroByDocumento(this.codigoEstudiante.toString()).then((respTer) => {
          let tercero = respTer;
          if (tercero !== undefined) {
            this.buscarRegistrosEntreFechas(this.fechaRegistroInicio, this.fechaRegistroFin, tercero.Id, 0);
          } else {
            this.utilService.showSwAlertError("Estudiante no encontrado", 'No se encuentra el tercero');
          }
        }).catch(
          (error) => {
            this.utilService.showSwAlertError("Estudiante no encontrado", `<p>${error}</p>`);
          }
        );
      } else {
        this.utilService.showSwAlertQuery("Consultar registros", "¿ Está seguro que desea consultar las solicitudes con estos parametros? Este proceso puede tardar varios minutos.", "Continuar",
          "question").then((res) => {
            if (res) {
              this.buscarRegistrosEntreFechas(this.fechaRegistroInicio, this.fechaRegistroFin, null, 0);
            }
          });
        
        
      }
    } else {
      if (numPg < this.pagina || numPg == 1) {
        this.hasNext = true;
      }
      if (this.limite == -1) {
        this.hasNext = false;
      }
      this.pagina = numPg;
      let offset = this.itemOffSet;
      if (numPg > 1) {
        offset += (numPg - 1) * this.limite
      }
      if (offset <= 0) {
        offset = null
      }

      if (this.codigoEstudiante != undefined) {
        this.listService.loadTerceroByDocumento(this.codigoEstudiante.toString()).then((respTer) => {
          let tercero = respTer;
          if (tercero !== undefined) {
            this.buscarRegistroSimple(tercero.Id, offset);
          } else {
            this.utilService.showSwAlertError("Estudiante no encontrado", 'No se encuentra el tercero');
          }
        }).catch(
          (error) => {
            this.utilService.showSwAlertError("Estudiante no encontrado", `<p>${error}</p>`);
          }
        );
      } else {
        if(this.limite==-1){
          this.utilService.showSwAlertQuery("Consultar registros", "¿ Está seguro que desea consultar las solicitudes con estos parametros? Este proceso puede tardar varios minutos.", "Continuar",
          "question").then((res) => {
            if (res) {
              this.buscarRegistroSimple(null, offset);
            }
          });
        }else{
          this.buscarRegistroSimple(null, offset);
        }
        
      }

    }

  }

  buscarRegistroSimple(terceroId: number, offset: number) {
    this.listService.consutarRegitroApoyo(terceroId, null, this.sede, this.periodo, this.fechaRegistroInicio, true, this.limite, offset).then((result) => {
      if (result.length > 0) {
        this.registros = result;
        if (this.registros.length < this.limite) {
          this.hasNext = false;
        }
      } else {
        this.utilService.showSwAlertError("Sin resultados", "No se encontraron resultados con los parametros indicados");
      }
    }).catch((err) => console.error(err));
  }


  buscarRegistrosEntreFechas(fecha_inicial, fecha_fin, terceroId: number, offset: number) {
    let fecha_incialSp: string[] = fecha_inicial.split("-");
    let fecha_finalSp: string[] = fecha_fin.split("-");
    let fechas: string[] = [];

    let fecha_inicial_dia: number;
    let fecha_inicial_mes: number;
    let fecha_inicial_anio: number;

    let fecha_final_dia: number;
    let fecha_final_mes: number;
    let fecha_final_anio: number;

    if (fecha_incialSp.length != 3) {
      this.utilService.showToastError("Error de formato", "Fecha inicial en formato erroneo");
      return;
    }
    if (fecha_finalSp.length != 3) {
      this.utilService.showToastError("Error de formato", "Fecha final en formato erroneo");
      return;
    }

    try {
      fechas.push(fecha_inicial);

      fecha_inicial_anio = +fecha_incialSp[0];
      fecha_inicial_mes = +fecha_incialSp[1];
      fecha_inicial_dia = +fecha_incialSp[2];

      fecha_final_anio = +fecha_finalSp[0];
      fecha_final_mes = +fecha_finalSp[1];
      fecha_final_dia = +fecha_finalSp[2];

    } catch (error) {
      this.utilService.showToastError("Error de conversion", "Solo puedes ingresar numeros");
      return;
    } finally {
      if (fecha_final_anio < fecha_inicial_anio) {
        this.utilService.showToastError("Error", "El año final es menor");
        return;
      }
      if (fecha_final_anio == fecha_inicial_anio) {
        if (fecha_final_mes < fecha_inicial_mes) {
          this.utilService.showToastError("Error", "El mes final es menor");
          return;
        }
      }
      if (fecha_final_anio == fecha_inicial_anio && fecha_final_mes == fecha_inicial_mes) {
        if (fecha_final_dia < fecha_inicial_dia) {
          this.utilService.showToastError("Error", "El dia final es menor");
          return;
        }
      }
      let mes = fecha_inicial_mes;
      let dia = fecha_inicial_dia;
      let anio = fecha_inicial_anio;
      let continua: boolean = true;
      this.registros = [];

      while (continua) {
        let fecha = anio + "-";
        fecha += (mes < 10 ? "0" : "") + mes + "-";
        fecha += (dia < 10 ? "0" : "") + dia;
        dia++;
        if (dia > 31) {
          dia = 1;
          mes++;
        }
        if (mes > 12) {
          mes = 1;
          anio++;
        }
        if (anio >= fecha_final_anio) {
          if (mes >= fecha_final_mes) {
            if (dia > fecha_final_dia) {
              continua = false;
            }
          }
        }
        this.listService.consutarRegitroApoyo(terceroId, null, this.sede, this.periodo, fecha, true, this.limite, offset).then((result) => {
          if (result.length > 0) {
            for (const res of result) {
              res.fecha_creacion = this.utilService.UTCtoGTM(res.fecha_creacion);
              this.registros.push(res);
            }
          } else {
            if (!continua && this.registros.length == 0 && fecha == fecha_fin) {
              this.utilService.showSwAlertError("Sin resultados", "No se encontraron resultados con los parametros indicados");
            }
          }
        }).catch((err) => console.error(err));
      }
    }

  }

  /**
   *Mapea el id del periodo al nombre de este
   *
   * @param {number} idPerido
   * @return {*} 
   * @memberof ConsultarComponent
   */
  getNombrePeriodo(idPerido: number) {
    for (const parametro of this.parametros) {
      if (parametro.PeriodoId.Id == idPerido) {
        return parametro.PeriodoId.Nombre
      }
    }
    return 'Indefinido';
  }

  /**
   *Mapea el id de la sede con el nombre de esta
   *
   * @param {number} idSede
   * @return {*} 
   * @memberof ConsultarComponent
   */
  getSedeAccesso(idSede: number) {
    for (const sede of this.sedesAcceso) {
      if (sede.Id == idSede) {
        return sede.Nombre
      }
    }
    return 'Indefinido';
  }

  /**
   *Despliega un toast con la informacion del estudiante
   *
   * @param {*} index
   * @memberof ConsultarComponent
   */
  verEstudiante(index) {
    let terceroId = this.registros[index].terceroId
    this.listService.loadTercero(terceroId).then((respTer) => {
      let tercero = respTer;
      if (tercero !== undefined) {

        this.listService.loadFacultadProyectoTercero(tercero.Id).then((nomFacultad) => {
          let facultad = nomFacultad[0];
          let proyectoCurricular = nomFacultad[1];
          let fecha = new Date(tercero.FechaNacimiento);
          Swal.fire({
            html: `<h3>Estudiante</h3>
            <p><b>Nombre:</b> ${tercero.NombreCompleto}</p>
            <p><b>Fecha nacimiento:</b> ${fecha.getDate()}-${fecha.getMonth()}-${fecha.getFullYear()}</p>
            <p><b>Faculta</b>d: ${facultad}</p>
            <p><b>Proyecto curricular:</b> ${proyectoCurricular}</p>`
          });

        });
      } else {
        this.utilService.showSwAlertError("Estudiante no encontrado", 'No se encuentra el tercero');
      }
    }).catch(
      (error) => {
        this.utilService.showSwAlertError("Estudiante no encontrado", `<p>${error}</p>`);
        /* Swal.fire("Error",
          `<p>${error}</p>`, "error"); */
      }
    );

  }

  /**
   *Despliega un toast con una solicitud y la opcion de verla a detalle
   *
   * @param {*} index
   * @memberof ConsultarComponent
   */
  verSolicitud(index) {
    let solicitudId = this.registros[index].solicitudId
    this.listService.loadSolicitud(solicitudId).then((respSolicitud) => {
      if (respSolicitud != undefined) {
        let solicitud = respSolicitud;
        let ref: ReferenciaSolicitud = JSON.parse(solicitud.Referencia);
        Swal.fire({
          showCloseButton: true,
          showDenyButton: true,
          confirmButtonText: `Ver solicitud completa`,
          denyButtonText: `Volver`,
          html: `<h3>Solicitud ${solicitud.Id}</h3>
          <p><b>Estado:</b> ${solicitud.EstadoTipoSolicitudId.EstadoId.Nombre}</p>
          <p><b>Periodo:</b> ${ref.Periodo}</p>
          <p><b>Puntaje</b>d: ${ref.Puntaje}</p>`
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate([`../../inscripciones/solicitudes/${solicitudId}`], { relativeTo: this.route });
          }
        });
      } else {
        this.utilService.showSwAlertError("Solicitud no encontrada", "No se encontro la solicitud para el periodo actual");
      }
    }).catch((error) => this.utilService.showSwAlertError("Solicitud no encontrada", error));


  }
}
