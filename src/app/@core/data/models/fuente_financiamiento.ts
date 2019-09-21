export class FuenteFinanciamiento {
    Vigencia: number;
    Nombre: string;
    Descripcion: string;
    FechaCreacion: Date;
    FechaModificacion: Date;
    Activo: boolean = true;
    TipoFuente: string;
    ValorOriginal: number;
    ValorAcumulado: number;
    NumeroDocumento: string;
    TipoDocumento: string;
    Codigo: string;
    Rubros: Object;
}
