import { HistoriaClinica } from "./historiaClinica.model";

export interface AntecedentePsicologia {
    Id?: number,
    HistoriaClinicaId?: HistoriaClinica | number,
    ActualFamiliar?: string,
    ActualPersonal?: string,
    PasadoFamiliar?: string,
    PasadoPersonal?: string,
}