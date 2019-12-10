export interface FuenteFinanciamientoInterface {
    Vigencia: number;
    Nombre: string;
    Descripcion?: string;
    FechaCreacion: Date;
    FechaModificacion: Date;
    Activo: boolean ;
    TipoFuente: string;
    Movimientos?: string[];
    ValorInicial?: number;
    ValorActual?: number;
    Estado?: string;
    NumeroDocumento: string;
    TipoDocumento: string;
    Codigo: string;
/*     Rubros: Object; */
}
