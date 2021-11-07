import { HistoriaClinica } from "./historiaClinica.model";
import { TipoAntecedentePsicologia } from "./tipoAntecedentePsicologia.model";

export interface AntecedentePsicologia {
    ActualSomatico?: string,
    HistoriaClinicaId?: HistoriaClinica | number,
    PasadoSomatico?: string,
    Id?: number,
    TipoAntecedente?: TipoAntecedentePsicologia,
}