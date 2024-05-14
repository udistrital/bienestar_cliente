export class TipoDocumento 
{
    Activo: boolean;
    CodigoAbreviacion: string;
    Descripcion: string;
    FechaCreacion: string;
    FechaModificacion: string;
    Id: number;
    Nombre: string;
    NumeroOrden: number;
    constructor(){
        this.CodigoAbreviacion="";
        this.Descripcion="";
        this.Nombre="";
    }
}
