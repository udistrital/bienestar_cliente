import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface ValoracionInterpersonal {
    Autoridad?: string,
    Drogas?: string
    Economicos?: string,
    HistoriaClinicaId?: HistoriaClinica | number,
    HojaHistoriaId?: HojaHistoria | number,
    Id?: number,
    Judiciales?: string,
    Motivo?: string,
    Orientacion?: string,
    Pareja?: string,
    Pares?: string,
    Proteccion?: string,
    RelacionesSexuales?: boolean,
    Satisfaccion?: string,
}