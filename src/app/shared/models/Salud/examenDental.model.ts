import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model"

export interface ExamenDental {
    HojaHistoriaId?: HojaHistoria | number,
    HistoriaClinicaId?: HistoriaClinica | number,
    Id?: number,
    Abrasion?: string,
    Manchas?: string,
    Observaciones?: string,
    Oclusion?: string,
    Otros?: string,
    PatologiaPulpar?: string,
    PlacaBlanda?: string,
    PlacaCalcificada?: string,
    Supernumerarios?: string,
}