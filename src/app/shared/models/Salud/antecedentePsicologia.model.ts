import { HistoriaClinica } from "./historiaClinica.model";

export interface AntecedentePsicologia {
    Id?: number,
    HistoriaClinica?: HistoriaClinica | number,
    ActualFamiliar?: string,
    ActualPersonal?: string,
    PasadoFamiliar?: string,
    PasadoPersonal?: string,
}