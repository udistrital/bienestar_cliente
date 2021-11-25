import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface DiagnosticoOdontologia {
    Evaluacion?: string,
    Evolucion?: string,
    HistoriaClinica?: HistoriaClinica | number,
    HojaHistoriaId?: HojaHistoria | number,
    Id?: number,
    Diagnostico?: string,
    Observaciones?: string,
    Pronostico?: string,
    Motivo?: string,
    Pulso?: string,
    Respiracion?: string,
    Temperatura?: string,
    TensionArterial?: string,
}