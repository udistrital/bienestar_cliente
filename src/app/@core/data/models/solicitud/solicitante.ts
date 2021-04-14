import { formatDate } from "@angular/common";
import { Solicitud } from "./solicitud";

export class Solicitante {
    Activo: boolean;
    FechaCreacion: string;
    FechaModificacion: string;
    Id: number;
    SolicitudId: Solicitud;
    TerceroId: number;
    constructor(){
        this.Activo=true;
        this.FechaCreacion= formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.FechaModificacion=formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.Id=0
    }
}
