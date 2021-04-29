import { TipoDocumento } from './tipo_documento';

export class Documento {
    Descripcion: string;
    Enlace: string;
    Id: number;
    Metadatos: string;
    Nombre: string;
    Activo: boolean;
    TipoDocumento: TipoDocumento;
}
