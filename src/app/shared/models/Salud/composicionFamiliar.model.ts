import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface ComposicionFamiliar {
    HistoriaClinicaId: HistoriaClinica,
    HojaHistoriaId: HojaHistoria,
    Id: number,
    Observaciones: string,
}