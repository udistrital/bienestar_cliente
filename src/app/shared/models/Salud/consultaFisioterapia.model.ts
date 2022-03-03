import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface ConsultaFisioterapia {
    Id?: number,
    HojaHistoria?: HojaHistoria,
    HistoriaClinica?: HistoriaClinica,
    PlanManejo?: string,
    Valoracion?: string,
    Diagnostico?: string,
    Medicamento?: string,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Activo?: boolean,
}