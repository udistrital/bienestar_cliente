import { Tercero } from "./tercero";
import { TipoDocumento } from "./tipo_documento";

export class DatosIdentificacion 
{
    Activo: boolean;
    CiudadExpedicion: number;
    DigitoVerificacion: number;
    DocumentoSoporte: number;
    FechaCreacion: string;
    FechaExpedicion: string;
    FechaModificacion: string;
    Id: number;
    Numero: string;
    TerceroId: Tercero;
    TipoDocumentoId: TipoDocumento;
    constructor(){
        this.Activo=false;
        this.Id=0;
        this.Numero='';
        this.TipoDocumentoId= new TipoDocumento();
    }

}