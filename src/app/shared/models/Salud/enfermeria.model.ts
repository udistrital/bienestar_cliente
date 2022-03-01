import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface Enfermeria {
    SignosVitales?: string,
    Descripcion?: string,
    HistoriaClinica?: HistoriaClinica | number,
    HojaHistoria?: HojaHistoria | number,
    Id?: number,
}