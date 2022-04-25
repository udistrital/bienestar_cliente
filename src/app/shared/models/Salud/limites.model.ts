import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface Limites {
    Claros?: string,
    Difusos?: string,
    HistoriaClinicaId?: HistoriaClinica | number,
    HojaHistoriaId?: HojaHistoria | number,
    Id?: number,
    Rigidos?: string,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Activo?: boolean,
}