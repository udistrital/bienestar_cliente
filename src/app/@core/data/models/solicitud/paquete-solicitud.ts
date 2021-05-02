import { formatDate } from "@angular/common";
import { EstadoTipoSolicitud } from "./estado-tipo-solicitud";
import { Paquete } from "./paquete";
import { Solicitud } from "./solicitud";


export class PaqueteSolicitud{
   
    Id: 0;
    Activo: true;
    FechaCreacion: string;
    FechaModificacion: string;
    EstadoTipoSolicitudId:EstadoTipoSolicitud;
    PaqueteId: Paquete;
    SolicitudId: Solicitud;
  
    constructor(){
        this.Id=0;
        this.FechaCreacion = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
        this.FechaModificacion = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
        this.Activo=true;
        this.EstadoTipoSolicitudId=null;
        this.PaqueteId=null;
        this.SolicitudId=null;
    }
    
}