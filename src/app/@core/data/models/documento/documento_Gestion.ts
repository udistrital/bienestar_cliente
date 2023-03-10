import { TipoDocumento } from './tipo_documento';

export class DocumentoGestion {
    Id: string;
    IdApi: string;
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
    // TipoDocumento: TipoDocumento;
    constructor(
        id: string,
        idApi: string,
        tipo: string, 
        nombre: string, 
        serie: string, 
        subSerie: string,
        fecha: Date, 
        descripcion: string, 
        enlace: string, 
        archivo: File){
            this.Id=id;
            this.IdApi=idApi;
            this.Tipo=tipo; 
            this.Nombre=nombre; 
            this.Serie=serie; 
            this.SubSerie=subSerie;
            this.Fecha=fecha; 
            this.Descripcion=descripcion;
            this.Enlace=enlace;
            this.Archivo= archivo;
    }
}
