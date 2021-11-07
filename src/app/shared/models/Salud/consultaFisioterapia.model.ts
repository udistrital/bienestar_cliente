import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface ConsultaFisioterapia {
    Evolucion?: string,
    Id?: number,
    HojaHistoria?: HojaHistoria,
    HistoriaClinica?: HistoriaClinica,
    MotivoConsulta?: string,
    Observaciones?: string,
    PlanManejo?: string,
    Valoracion?: string,
}