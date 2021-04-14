import { formatDate } from "@angular/common";
import { EstadoTipoSolicitud } from "./estado-tipo-solicitud";
import { Solicitud } from "./solicitud";

export class SolicitudEvolucionEstado {
    Id: number;
    TerceroId: number;
    SolicitudId: Solicitud;
    EstadoTipoSolicitudIdAnterior: EstadoTipoSolicitud;
    EstadoTipoSolicitudId: EstadoTipoSolicitud;
    FechaLimite: string;
    FechaCreacion: string;
    FechaModificacion: string;
    Activo: boolean;

    constructor(){
      this.Id=0;
      this.TerceroId= null;
      this.SolicitudId= null;
      this.EstadoTipoSolicitudIdAnterior= null;
      this.EstadoTipoSolicitudId= null;
      this.FechaLimite = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');;
      this.FechaCreacion= formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.FechaModificacion=formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.Activo= true;
    }
  }


