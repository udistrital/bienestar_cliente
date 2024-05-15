import { HistoriaClinica } from "./historiaClinica.model";
import { Diagnostico } from "./diagnostico.model";
import { Especialidad } from "./especialidad.model";

export interface HojaHistoria {
    Id?: number,
    HistoriaClinica?: HistoriaClinica | any,
    Diagnostico?: Diagnostico,
    Evolucion?: string,
    FechaConsulta?: Date,
    Especialidad?: Especialidad | any,
    Persona?: number,
    Profesional?: number | string,
    Motivo?: string,
    Observacion?: string,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Activo?: boolean,
}