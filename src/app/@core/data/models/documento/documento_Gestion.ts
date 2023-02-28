import { TipoDocumento } from './tipo_documento';

export class DocumentoG {
    Id: string;
    Tipo: string;
    Nombre: string;
    Serie: string;
    SubSerie: string;
    Fecha: Date;
    Descripcion: string;
    Enlace: string;
    // Metadatos: string;
    // Activo: boolean;
    Archivo: File;
    TipoDocumento: TipoDocumento;
}
