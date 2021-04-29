export interface GrupoComplementario {
    Id: number;
    Nombre: string;
    CodigoAbreviacion: string;
    Activo: boolean;
    TipoDeDato?: string;
    GrupoInfoComplementariaId?: GrupoComplementario;
    FechaCreacion: string;
    FechaModificacion: string;
    Descripcion?: string;
}
