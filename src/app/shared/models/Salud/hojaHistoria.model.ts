import { HistoriaClinica } from "./historiaClinica.model";
import { Diagnostico } from "./diagnostico.model";

export interface HojaHistoria {
    Id?: number,
    HistoriaClinica?: HistoriaClinica | any,
    Diagnostico?: Diagnostico,
    Evolucion?: string,
    FechaConsulta?: Date,
    Especialidad?: number,
    Persona?: number,
    Profesional?: number,
    Motivo?: string,
    Observacion?: string
}