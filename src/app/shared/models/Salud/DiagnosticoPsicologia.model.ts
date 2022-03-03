import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface DiagnosticoPsicologia {
    Acuerdo?: string,
    Hipotesis?: string,
    Diagnostico?: string,
    HistoriaClinicaId?: HistoriaClinica | number,
    HojaHistoriaId?: HojaHistoria | number,
    Id?: number,
    Medicamento?: string,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Activo?: boolean,
}