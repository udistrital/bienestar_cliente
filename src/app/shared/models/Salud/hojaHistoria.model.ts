import { HistoriaClinica } from "./historiaClinica.model";
import { Diagnostico } from "./diagnostico.model";

export interface HojaHistoria {
    Id?: number,
    HistoriaClinica?: HistoriaClinica,
    Diagnostico?: Diagnostico,
    Evolucion?: JSON,
    FechaConsulta?: string,
    Especialidad?: number,
    Persona?: number,
    Profesional?: number,
    Motivo?: string,
    Observacion?: string
}