import { HistoriaClinica } from "./historiaClinica.model";

export interface Antecedente {
    Id?: number,
    HistoriaClinica?: HistoriaClinica,
    Alergicos?: string,
    Ccv?: string,
    Ciclos?: string,
    CompañerosSexuales?: string,
    Familiares?: string,
    Farmacologicos?: string,
    Fog?: string,
    Fup?: string,
    Fur?: string,
    GenitoUrinarios?: string,
    Hospitalarios?: string,
    Menarquia?: string,
    Ocupacionales?: string,
    Patologicos?: string,
    Pp?: string,
    Quirurgicos?: string,
    Seno?: string,
    Traumaticos?: string,
}