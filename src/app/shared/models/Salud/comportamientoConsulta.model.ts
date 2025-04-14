import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface ComportamientoConsulta {
    Afrontamiento?: string,
    Comportamiento?: string,
    HistoriaClinicaId?: HistoriaClinica | number,
    HojaHistoriaId?: HojaHistoria | number,
    Id?: number,
    Problematica?: string,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Activo?: boolean,
}