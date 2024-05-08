import { formatDate } from "@angular/common";
import { Solicitud } from "./solicitud";
import { TipoObservacion } from "./tipo-observacion";

export class Observacion {
    Id: number;
    SolicitudId: Solicitud;
    TerceroId: number;
    TipoObservacionId: TipoObservacion;
    Titulo: string;
    Valor: string
    Activo: boolean;
    FechaCreacion: string;
    FechaModificacion: string;
    constructor(){
        this.Id=0;
        this.SolicitudId=null;
        this.TerceroId=0;
        this.TipoObservacionId=null;
        this.Titulo="";
        this.Valor="";
        this.Activo=true;
        this.FechaCreacion = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');;
        this.FechaModificacion = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');;
    }
}

