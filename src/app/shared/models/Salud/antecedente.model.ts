import { HistoriaClinica } from "./historiaClinica.model";
import { TipoAntecedente } from "./tipoAntecedente.model";

export interface Antecedente {
    Id?: number,
    HistoriaClinica?: HistoriaClinica,
    TipoAntecedente?: TipoAntecedente,
    Observaciones?: string,
}