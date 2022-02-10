import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface DiagnosticoOdontologia {
    Evaluacion?: string,
    HistoriaClinica?: HistoriaClinica | number,
    HojaHistoriaId?: HojaHistoria | number,
    Id?: number,
    Diagnostico?: string,
    Pronostico?: string,
    Pulso?: string,
    Respiracion?: string,
    Temperatura?: string,
    TensionArterial?: string,
    Medicamento?: string
}