import { HistoriaClinica } from "./historiaClinica.model";
import { TipoAntecedente } from "./tipoAntecedente.model";

export interface Antecedente {
    IdAntecedente: number,
    IdHistoriaClinica: HistoriaClinica,
    IdTipoAntecedente: TipoAntecedente,
    Observaciones: string,
}