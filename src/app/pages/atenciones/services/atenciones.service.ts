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

  registrarSolicitantexAtencion(codigo_estudiante: string, Id_atencion: string) {

    //console.log("Voy a registrar solciitante (estudiante)")
    //console.log(codigo_estudiante)
    //console.log(Id_atencion)
    //let estudiante = this.getTerceroxEstudiante(codigo_estudiante)
    let tercero= new Tercero()
    let solicitud = new Solicitud()
    let solicitante = new Solicitante()
    this.getEstudiante(codigo_estudiante).subscribe((res)=>{
        tercero = res.Id
        this.getAtencion(Id_atencion).subscribe((resAtencion)=>{
          solicitud = resAtencion
          console.log("flag registrar solciitante x atencion")
          console.log(tercero)
          console.log(solicitud)
        });
    });

    solicitante.SolicitudId = solicitud;
    solicitante.TerceroId = tercero.Id;
    solicitante.FechaCreacion = formatDate(new Date(), "yyyy-MM-dd", "en");
    solicitante.FechaModificacion = formatDate(new Date(), "yyyy-MM-dd", "en");
    solicitante.Activo=true;
    //console.log("ESTE ES EL SOLICITANTE Y LA SOLICITUD");
    //console.log(solicitante);

    
    
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
  getEstudiante(codigo: string): Observable<any> {
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/datos_identificacion/?query=Numero:${codigo}`,
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

  getAtencion(codigo_atencion:string): Observable<any>{
    //console.log(codigo_atencion)
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
  getObservacionesxAtencion(id_atencion:string){
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/observacion?query=SolicitudId.id:${id_atencion}`,
      httpOptions
    )
  }

  getAtencionxSolicitante(codigo_tercero: string) {
    //console.log("tercero id", cod_tercero)
    return this.http.get<any>(
      `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/solicitante?query=terceroId:${codigo_tercero}&fields=SolicitudId`,
      httpOptions
    )
  }

  // crearEstadoTipo(estadoTipo: EstadoTipoSolicitud): Observable<any> {
  //   return this.http.post<any>(
  //     `https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/estado_tipo_solicitud`,
  //     estadoTipo,
  //     httpOptions
  //   );
  // }

  /**Trae la información de la atención según el código */

  
}
