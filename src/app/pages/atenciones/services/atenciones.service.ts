import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { formatDate } from "@angular/common";
import { EstadoTipoSolicitud } from "../../../@core/data/models/solicitud/estado-tipo-solicitud";
import { ReferenciaSolicitud } from "../../../@core/data/models/solicitud/referencia-solicitud";
import { TipoSolicitud } from "../../../@core/data/models/solicitud/tipo_solicitud";

const httpOptions = {
  headers: new HttpHeaders({
    Accept: "application/json",
    authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
  }),
};
@Injectable({
  providedIn: "root",
})
export class AtencionesService {
  constructor(private http: HttpClient) {}

  /**
   * Trae TOOOOODAS las atenciones
   * @returns
   */
  findAtenciones(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/solicitud`,
      httpOptions
    );
  }

  createAtencion() {
    const solicitud: Solicitud = new Solicitud();
    solicitud.EstadoTipoSolicitudId = null;
    solicitud.FechaRadicacion = formatDate(new Date(), "yyyy-MM-dd", "en");

    const estadoTipoSol: EstadoTipoSolicitud = {
      Id: 1,
      TipoSolicitud: {
        Id: 1,
        Nombre: "Producción docentes oficina docencia",
        Descripcion: "",
        CodigoAbreviacion: "proddocen",
        NumeroOrden: 1,
        FechaCreacion: "2020-11-28 09:57:40.331276 +0000 +0000",
        FechaModificacion: "2020-11-28 09:57:40.331276 +0000 +0000",
        Activo: true,
      },
      EstadoId: {
        Id: 1,
        Nombre: "Radicada",
        Descripcion: "",
        CodigoAbreviacion: "RAD",
        NumeroOrden: 1,
        FechaCreacion: "2020-11-28 09:57:40.286495 +0000 +0000",
        FechaModificacion: "2020-11-28 09:57:40.286495 +0000 +0000",
        Activo: true,
      },
      DependenciaId: 46,
      NumeroDias: 14,
      FechaCreacion: "2020-11-28 09:57:40.341062 +0000 +0000",
      FechaModificacion: "2020-11-28 09:57:40.341062 +0000 +0000",
      Activo: true,
    };
    solicitud.EstadoTipoSolicitudId = estadoTipoSol;
    solicitud.setReferencia(new ReferenciaSolicitud());

    this.http
      .post(
        `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/solicitud`,
        JSON.stringify(solicitud)
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  /**
   * 
   * @returns Este método retorna un Response donde el atributo Data es del tipo TipoSolicitud[]. Se pode de tipo any para que no marque error el TS en los componentes
   */
  getTiposAtenciones(): Observable<any> {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/tipo_solicitud?limit=0`,
      httpOptions
    );
  }

  /**
   * 
   * @returns Este método retorna un Response donde el atributo Data es del tipo TipoSolicitud[]. Se pode de tipo any para que no marque error el TS en los componentes
   */
  getEstadosAtenciones(): Observable<any> {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/estado?limit=0`,
      httpOptions
    );
  }
}