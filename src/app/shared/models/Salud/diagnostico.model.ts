import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface Diagnostico {
    Id?: number,
    HistoriaClinicca?: HistoriaClinica,
    HojaHistoria?: HojaHistoria,
    Activo?: boolean,
    Analisis?: string,
    Descripcion?: string,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Nombre?: string,
    Numero?: number,
    PlanDeManejo?: string,
}