import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Solicitud } from "../../../@core/data/models/solicitud/solicitud";
import { formatDate } from "@angular/common";
import { EstadoTipoSolicitud } from "../../../@core/data/models/solicitud/estado-tipo-solicitud";
import { ReferenciaSolicitud } from "../../../@core/data/models/solicitud/referencia-solicitud";
import { TipoSolicitud } from "../../../@core/data/models/solicitud/tipo_solicitud";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Tercero } from "../../../@core/data/models/terceros/tercero";
import { Solicitante } from "../../../@core/data/models/solicitud/solicitante";
import { Observacion } from "../../../@core/data/models/solicitud/observacion";

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
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/solicitud?limit=0`,
      httpOptions
    );
  }

  registrarSolicitantexAtencion(
    codigo_estudiante: string,
    Id_atencion: string
  ) {
    let tercero = new Tercero();
    let solicitud = new Solicitud();
    let solicitante = new Solicitante();
    this.getEstudianteByCode(codigo_estudiante).subscribe((res) => {
      tercero = res.Id;
      this.getAtencion(Id_atencion).subscribe((resAtencion) => {
        solicitud = resAtencion;
      });
    });

    solicitante.SolicitudId = solicitud;
    solicitante.TerceroId = tercero.Id;
    solicitante.FechaCreacion = formatDate(new Date(), "yyyy-MM-dd", "en");
    solicitante.FechaModificacion = formatDate(new Date(), "yyyy-MM-dd", "en");
    solicitante.Activo = true;
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

  /**
   *
   * @returns Este método retorna un Response donde el atributo Data es del tipo TipoSolicitud[]. Se pode de tipo any para que no marque error el TS en los componentes
   */
  getEstudianteByCode(codigo: string): Observable<any> {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/datos_identificacion/?query=Numero:${codigo}`,
      httpOptions
    );
  }

  /**
   *
   * @returns Este método retorna un Response donde el atributo Data es del tipo TipoSolicitud[]. Se pode de tipo any para que no marque error el TS en los componentes
   */
  getEstudianteByTerceroId(id: number): Observable<any> {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/datos_identificacion?query=TerceroId.Id:${id}`,
      httpOptions
    );
  }

  /**
   *
   * @returns Este método retorna un Response donde el atributo Data es del tipo TipoSolicitud[]. Se pode de tipo any para que no marque error el TS en los componentes
   */
  getSolicitanteBySolicitudId(id: string): Observable<any> {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/solicitante?query=SolicitudId.Id:${id}`,
      httpOptions
    );
  }

  /**
   *
   * @returns Este método retorna el tercero asociado al código estudiantil
   */
  getTerceroxEstudiante(codigo: string): Observable<any> {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/datos_identificacion?query=Numero:${codigo},TipoDocumentoId:14`,
      //`https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/datos_identificacion/?query=Numero:${codigo}`,
      httpOptions
    );
  }

  getTipoEstado(tipoId: number, estadoId: number): Observable<any> {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/estado_tipo_solicitud?query=TipoSolicitud.Id:${tipoId},EstadoId.Id:${estadoId}`,
      httpOptions
    );
  }

  getAtencion(codigo_atencion: string): Observable<any> {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/solicitud/${codigo_atencion}`,
      httpOptions
    );
  }

  /**
   * Se trae específicamente este tipo de observación ya que se definió que todas las obeservaciones de las atenciones serán de tipo "Comentario"
   */
  getTipoObservacionComentario() {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/tipo_observacion?query=Nombre:Comentario`,
      httpOptions
    );
  }

  /**
   * Consulta las observaciones hechas en una atención
   * @returns Observacion[]
   */
  getObservacionesxAtencion(id_atencion: string) {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/observacion?query=SolicitudId.id:${id_atencion}`,
      httpOptions
    );
  }

  getAtencionxSolicitante(codigo_tercero: string) {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/solicitante?query=terceroId:${codigo_tercero}&fields=SolicitudId`,
      httpOptions
    );
  }

  // crearEstadoTipo(estadoTipo: EstadoTipoSolicitud): Observable<any> {
  //   return this.http.post<any>(
  //     `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/estado_tipo_solicitud`,
  //     estadoTipo,
  //     httpOptions
  //   );
  // }

  /**Trae la información de la atención según el código */

  getEstadoTipoById(id: number): Observable<any> {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/estado_tipo_solicitud/${id}`,
      httpOptions
    );
  }

  deleteObservacion(id: number): Observable<any> {
    return this.http.delete<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/observacion/${id}`,
      httpOptions
    );
  }

  updateObservacion(id: number, observacion: Observacion): Observable<any> {
    return this.http.put<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/observacion/${id}`,
      observacion,
      httpOptions
    );
  }
}
