import { TipoDocumento } from './tipo_documento';

export class DocumentoG {
    Descripcion: string;
    Enlace: string;
    Id: number;
    Serie: string;
    SubSerie: string;
    Metadatos: string;
    Nombre: string;
    Activo: boolean;
    Fecha: Date;
    Archivo: File;
    TipoDocumento: TipoDocumento;
}
