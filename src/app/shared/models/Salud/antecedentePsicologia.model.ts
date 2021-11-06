import { HistoriaClinica } from "./historiaClinica.model";
import { TipoAntecedentePsicologia } from "./tipoAntecedentePsicologia.model";

export interface AntecedentePsicologia {
    ActualSomatico: string,
    HistoriaClinicaId: HistoriaClinica,
    PasadoSomatico: string,
    Id: number,
    TipoAntecedente: TipoAntecedentePsicologia,
}