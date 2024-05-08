import { formatDate } from "@angular/common";
import { Paquete } from "./paquete";

export class SoportePaquete{
   
    Id: number;
    Activo: boolean;
    Descripcion: string;
    DocumentoId: number;
    FechaCreacion: string;
    FechaModificacion: string;
    PaqueteId: Paquete

    constructor(){
        this.Id=0;
        this.Activo=true;
        this.Descripcion='';
        this.DocumentoId=0;
        this.FechaCreacion = "string";
        this.FechaModificacion = "string";
        this.PaqueteId=null;
    }
    
}