import { Injectable, Input } from "@angular/core";
import Swal from "sweetalert2";
import { ListService } from "../../../@core/store/list.service";
import { UtilService } from "../../../shared/services/utilService";
import { environment } from "../../../../environments/environment";
import { EstadoTipoSolicitud } from "../../../@core/data/models/solicitud/estado-tipo-solicitud";
import { Estado } from "../../../@core/data/models/solicitud/estado";

@Injectable({
  providedIn: "root",
})
export class AtencionesService {
  private itemOffSet: number = 0;
  private itemSelect: number = -1;
  private solicitudesExt: any = [];
  private filtroFacultad = "";
  private estadoSolicitud = "";
  private data: any = [];

  private estados: Estado[] = [];
  private estadoTipo: number = null;
  private estadosTipoSolicitud: EstadoTipoSolicitud[] = [];

  constructor(
    private listService: ListService,
    private utilService: UtilService
  ) {
    this.loadEstadoTipoSolicitud();
  }

  setFiltros(facultad: string, estadoSolicitud: string, estadoTipo: number) {
    this.filtroFacultad = facultad;
    this.estadoSolicitud = estadoSolicitud;
    this.estadoTipo = estadoTipo;
    return new Promise((resolve) => {
      resolve(this.cargarSol());
    });
  }

  actualizarFiltros() {
    let endSelected;
    let finalizada: boolean = null;

    if (this.estadoSolicitud != "null") {
      finalizada = this.estadoSolicitud == "finalizada" ? true : false;
      endSelected = this.data.filter((solicitudes) => {
        return solicitudes.SolicitudFinalizada === finalizada;
      });
      this.data = endSelected;
    }

    let facultadSelected = null;
    if (this.filtroFacultad != null) {
      facultadSelected = this.data.filter((solicitudes) => {
        return solicitudes.Referencia.facultad === this.filtroFacultad;
      });
      this.data = facultadSelected;
    }
    this.data.length <= 0 &&
      this.utilService.showSwAlertError(
        "Solicitudes no encontrados",
        "No se encontraron solicitudes para los parametros seleccionados"
      );
  }

  loadEstadoTipoSolicitud() {
    this.listService
      .findEstadoTipoSolicitud(environment.IDS.IDPAZYSALVOS)
      .subscribe(
        (result: any[]) => {
          if (result["Data"].length > 0) {
            let estadosTiposolicitud = <Array<EstadoTipoSolicitud>>(
              result["Data"]
            );
            for (let estadoTipo of estadosTiposolicitud) {
              this.estadosTipoSolicitud.push(estadoTipo);
              this.estados.push(estadoTipo.EstadoId);
            }
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  get estadosTipoSolicitu() {
    return this.estadosTipoSolicitud;
  }
  get estado() {
    return this.estados;
  }

  cargarSol() {
    this.solicitudesExt = [];
    Swal.fire({
      title: "Por favor espere",
      html: `Se estan cargando las solicitudes`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    let finalizada = null;

    if (this.estadoSolicitud != "null") {
      finalizada = this.estadoSolicitud == "finalizada" ? true : false;
    }
    return this.listService
      .findSolicitudesPYZ(
        this.estadoTipo,
        this.itemSelect,
        this.itemOffSet,
        finalizada
      )
      .then((result) => {
        const solicitudes = result;

        if (solicitudes.length > 0) {
          for (let solicitud of solicitudes) {
            solicitud.Referencia = JSON.parse(solicitud.Referencia);
            this.solicitudesExt.push({
              ...solicitud,
              IdTercero: solicitud.Referencia["tercero"],
            });
          }
          Swal.close();
          return (this.data = this.solicitudesExt);
        } else {
          this.utilService.showSwAlertError(
            "Solicitudes no encontrados",
            "No se encontraron solicitudes para los parametros seleccionados"
          );
          return (this.data = []);
        }
      })
      .catch((err) => this.utilService.showSwAlertError("Error", err));
  }

  get Solicitudes() {
    return this.data;
  }
}
