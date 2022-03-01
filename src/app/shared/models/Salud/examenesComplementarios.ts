import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface ExamenesComplementarios {
    HistoriaClinicaId?: HistoriaClinica | number,
    HojaHistoriaId?: HojaHistoria | number,
    Id?: number,
    PeriapicalInicio?: string,
    PeriapicalFinal?: string,
    PanoramicaInicio?: string,
    PanoramicaFinal?: string,
    OtraInicio?: string,
    OtraFinal?: string,
    LaboratorioInicio?: string,
    LaboratorioFinal?: string,
    Tp?: string,
    Tpt?: string,
    Coagulacion?: string,
    Sangria?: string,
    Otra?: string
}