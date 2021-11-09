import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface Diagnostico {
    Id?: number,
    HistoriaClinica?: HistoriaClinica | number,
    HojaHistoria?: HojaHistoria | number,
    Activo?: boolean,
    Analisis?: string,
    Descripcion?: string,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Nombre?: string,
    Numero?: number,
    PlanDeManejo?: string,
}