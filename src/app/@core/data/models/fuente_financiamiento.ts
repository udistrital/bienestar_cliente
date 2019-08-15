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
    Codigo: string;
    Rubros: Object;
}
