import { EstadoTipoSolicitud } from "./estado_tipo_solicitud";
import { SolicitudDocentePost } from "./solicitud_docente";

export class PaqueteSolicitudPost {
  Id: number;
  Nombre: string;
  NumeroComite: string;
  FechaComite: string;
  Activo: boolean;
  Solicitudes: number;
  SolicitudesList: SolicitudDocentePost[];
  EstadoTipoSolicitudId: EstadoTipoSolicitud;
  TerceroId: number;
  PaqueteRevisado: boolean;
}
