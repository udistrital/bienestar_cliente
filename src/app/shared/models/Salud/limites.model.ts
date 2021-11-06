import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface Limites {
    Claros: string,
    Difusos: string,
    HistoriaClinicaId: HistoriaClinica,
    HojaHistoriaId: HojaHistoria,
    Id: number,
    Rigidos: string,
}