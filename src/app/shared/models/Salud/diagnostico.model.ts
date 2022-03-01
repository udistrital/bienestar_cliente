import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface Diagnostico {
    Id?: number,
    HistoriaClinica?: HistoriaClinica | number,
    HojaHistoria?: HojaHistoria | number,
    Analisis?: string,
    Descripcion?: string,
    PlanDeManejo?: string,
    Medicamento?: string
}