import { formatDate } from "@angular/common";
import { EstadoTipoSolicitud } from "./estado-tipo-solicitud";

export class Solicitud {
    Activo: boolean;
    EstadoTipoSolicitudId: EstadoTipoSolicitud;
    FechaCreacion: string;
    FechaModificacion: string;
    FechaRadicacion: string;
    Id: number;
    Referencia: string;
    Resultado: string;
    SolicitudFinalizada: boolean;
    SolicitudPadreId: Solicitud
  length: number;
    constructor(){
        this.Activo=true;
        this.FechaCreacion= formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.FechaModificacion=formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.FechaRadicacion=formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.Id=0;
        this.Referencia= "{}";
        this.Resultado= "";
        this.SolicitudFinalizada= false;
        this.SolicitudPadreId= null;
    }
}