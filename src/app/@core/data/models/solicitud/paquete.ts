import { formatDate } from "@angular/common";

export class Paquete{
   
    Id: number;
    Nombre: string;
    FechaCreacion: string;
    FechaModificacion: string;
    Activo: boolean
    FechaComite: string;
    NumeroComite: string;
    PaqueteRevisado: boolean;
  

    constructor(){
        this.Id=0;
        this.Nombre="";
        this.FechaCreacion = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
        this.FechaModificacion = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
        this.FechaComite = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
        this.NumeroComite="1";
        this.PaqueteRevisado=false;
        this.Activo=true;
    }
    
}