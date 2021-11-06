import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface ComportamientoConsulta {
    Afrontamiento: string,
    Comportamiento: string,
    HistoriaClinicaId: HistoriaClinica,
    HojaHistoriaId: HojaHistoria,
    Id: number,
    Problematica: string,
}