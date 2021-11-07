import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface DiagnosticoPsicologia {
    Acuerdo?: string,
    Evolucion?: string,
    Hipotesis?: string,
    HistoriaClinicaId?: HistoriaClinica | number,
    HojaHistoriaId?: HojaHistoria | number,
    Id?: number,
    Observaciones?: string,
}