import { HojaHistoria } from "./hojaHistoria.model"
import { TipoExamen } from "./tipoExamen.model";

export interface Examen {
    FechaExamen: Date,
    IdExamen: number,
    IdHojaHistoria: HojaHistoria,
    IdTipoExamen: TipoExamen,
    Nombre: string,
    Observacion: string,
}