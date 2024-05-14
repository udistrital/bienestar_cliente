import { Tipo } from "./tipo";

export class Parametro {
    Id: number;
    Activo: boolean;
    CodigoAbreviacion: string;
    Descripcion: string;
    FechaCreacion: string;
    FechaModificacion: string;
    Nombre: string;
    NumeroOrden: number;
    ParametroPadreId: Parametro;
    TipoParametroId: Tipo
}