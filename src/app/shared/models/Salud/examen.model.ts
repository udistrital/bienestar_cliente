import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model"
import { TipoExamen } from "./tipoExamen.model";

export interface Examen {
    FechaExamen: Date,
    HojaHistoria: HojaHistoria,
    HistoriaClinica: HistoriaClinica,
    Id: number,
    TipoExamen: TipoExamen,
    Nombre: string,
    Observacion: string,
}