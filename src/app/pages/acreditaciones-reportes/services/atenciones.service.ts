import { Injectable, Input } from "@angular/core";
import Swal from "sweetalert2";
import { ListService } from "../../../@core/store/list.service";
import { UtilService } from "../../../shared/services/utilService";
import { environment } from "../../../../environments/environment";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { ReferenciaSolicitud } from "../../../@core/data/models/solicitud/referencia-solicitud";
import { Periodo } from "../../../@core/data/models/parametro/periodo";
import { referencia } from "../../paz-y-salvos/interfaces/index";
import { Solicitante } from "../../../@core/data/models/solicitud/solicitante";

interface atencion {
  name: string;
  value: number;
}

@Injectable({
  providedIn: "root",
})
export class AtencionesService {
  solicitudAtencion = [];
  //arreglos para realiza conteos
  atenciones = [];
  atencionesaux = [];

  solicitantes = [];
  //data en bruto
  data = [];
  dataRefYFa = [];
  dataAxSpreRendered = [];

  //solicitantes = []
  //arreglo para vecces que se repite el servicio

  conteoFacultades = [];
  conteoServicio = {};

  dataAxS: atencion[] = []; //data atencion poir tipo de servicio
  dataAxF: atencion[] = []; // data de atenciones por facultad

  itemSelect: number = 10;
  itemOffSet: number = 0;
  tipoAtencion: number = null;
  filtroFacultad: string = null;
  fechaInicio: string = null;
  fechaFinal: string = null;

  constructor(
    private listService: ListService,
    private utilService: UtilService
  ) {}
  setTipoAtencion(id: number) {
    this.tipoAtencion = id;
  }

  setFiltroFacultad(facultad: string, fechaInicio: string, fechaFinal: string) {
    this.filtroFacultad = facultad;
    this.fechaInicio = fechaInicio;
    this.fechaFinal = fechaFinal;
    return new Promise((resolve) => {
      resolve(this.actualizarFiltros());
    });
  }

  loadFecha(atenciones) {
    if (this.fechaInicio === "" && this.fechaFinal === "") {
      return atenciones;
    } else {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFinal = new Date(this.fechaFinal);
      let fechaAtencion;
      const newData = atenciones.filter((atencion) => {
        fechaAtencion = new Date(atencion.solicitud.FechaCreacion);

        if (fechaAtencion > fechaInicio && fechaAtencion <= fechaFinal) {
          return atencion;
        }
      });
      return newData;
    }
  }

  actualizarFiltros() {
    let newDataAtenciones = this.loadFecha(this.solicitudAtencion);
    this.contarFacultades(newDataAtenciones);
    this.contarAtenciones(newDataAtenciones);

    let facultadSelected = null;
    let facultadSelectedxService = null;
    if (this.filtroFacultad != null) {
      facultadSelected = this.dataAxF.filter((atenciones) => {
        return atenciones.name === this.filtroFacultad;
      });
      this.dataAxF = facultadSelected;
      facultadSelectedxService = newDataAtenciones.filter((data) => {
        return data.facultad[0] === this.filtroFacultad;
      });
      return this.contarAtenciones(facultadSelectedxService);
    } else {
      return (this.dataAxF = this.data), (this.dataAxS = this.dataAxS);
    }
  }
  buscarSolicitudes() {
    this.cargarSol();
  }

  contarAtenciones(solicitudes) {
    this.conteoServicio = {};
    this.dataAxS = [];
    // for para sacar data de tipo de servicio
    for (let solicitudG of solicitudes) {
      const { solicitud } = solicitudG;
      let referencia = null;
      referencia = JSON.parse(solicitud.Referencia);

      //contar # que se repite el servicio
      if (this.conteoServicio[referencia["tipo_servicio"]]) {
        this.conteoServicio[referencia["tipo_servicio"]]++;
      } else {
        this.conteoServicio[referencia["tipo_servicio"]] = 1;
      }
    }
    //guardar numero de atenciones por tipo de servicio
    for (const servicio in this.conteoServicio) {
      this.dataAxS.push({
        name: servicio,
        value: this.conteoServicio[servicio],
      });
    }
    return this.dataAxS;
  }

  contarFacultades(solicitantes) {
    let aux = [];
    this.data = [];
    this.conteoFacultades = [];
    this.dataAxF = [];
    for (let solicitud of solicitantes) {
      let facultad = "";
      facultad = solicitud.facultad[0];

      aux = aux.concat(facultad);

      if (this.conteoFacultades[facultad]) {
        this.conteoFacultades[facultad]++;
      } else {
        this.conteoFacultades[facultad] = 1;
      }
      if (aux.length == solicitantes.length) {
        for (const servicio in this.conteoFacultades) {
          this.data.push({
            name: servicio,
            value: this.conteoFacultades[servicio],
          });
        }
        this.dataAxF = this.data;
      }
    }
  }

  cargarSolicitantes(solicitudes) {
    Swal.fire({
      title: "Por favor espere",
      html: `Se estan cargando las solicitudes`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    this.solicitudAtencion = [];
    this.solicitantes = [];
    for (let solicitud of solicitudes) {
      this.listService
        .loadSolicitanteBySolicitud(solicitud.Id)
        .then((solicitante) => {
          this.solicitudAtencion = this.solicitudAtencion.concat({
            solicitud,
            solicitante: solicitante,
          });
          this.solicitantes = this.solicitantes.concat(solicitante);
          if (this.solicitantes.length == this.atenciones.length) {
            this.cargarFacultades(this.solicitudAtencion);
          }
        })
        .catch((err) => this.utilService.showSwAlertError("Error", err));
    }
    Swal.close();
  }

  async cargarFacultades(solicitantes) {
    Swal.fire({
      title: "Por favor espere",
      html: `Se estan cargando la información de las Facultades`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();

    this.dataRefYFa = [];
    this.conteoFacultades = [];

    const ids = [9885, 9886, 9887, 9888, 9886, 9885, 9886];
    let i = 0;
    let id = ids[i];
    if (solicitantes.solicitante === undefined) {
    }
    for (let solicitante of solicitantes) {
      if (
        solicitante.Solicitante === undefined ||
        solicitante.solicitante.TerceroId === undefined
      ) {
        console.warn(
          "terceroId es undefined para el solicitante:",
          solicitante
        );
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error en la carga",
          footer: '<a href="#">Why do I have this issue?</a>',
        });
        continue; // Pasa al siguiente solicitante sin hacer la llamada
      }
      try {
        const facultades = await this.listService.loadFacultadProyectoTercero(
          solicitante.solicitante.terceroId
        );
        solicitante["facultad"] = facultades;
      } catch (errT) {
        this.utilService.showSwAlertError(
          "Error en las búsqueda de facultades",
          errT
        );
      }
      i = i + 1;
      id = ids[i];
    }

    this.contarFacultades(this.solicitudAtencion);
    this.contarAtenciones(this.solicitudAtencion);
    Swal.close();
  }

  cargarSol() {
    Swal.fire({
      title: "Por favor espere",
      html: `Se estan cargando las solicitudes`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();

    this.listService
      .findSolicitudes(this.tipoAtencion, this.itemSelect, this.itemOffSet)
      .then((result) => {
        this.atenciones = result;
        this.dataAxS = [];
        this.dataAxF = [];
        this.cargarSolicitantes(this.atenciones);

        if (this.atenciones.length == 0) {
          //para cuadnoa gregue filtros ->    && (this.itemOffSet<=0 || this.itemOffSet==null)
          Swal.close();
          this.utilService.showSwAlertError(
            "Solicitudes no encontradas",
            "No se encontro ninguna solicitud con los parametros seleccionados."
          );
        } else {
          Swal.close();
        }
      })
      .catch((err) => this.utilService.showSwAlertError("Error", err));
  }

  get atencionesDataAxS() {
    return this.dataAxS;
  }
  get atencionesDataAxF() {
    return this.dataAxF;
  }
}