import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface ValoracionInterpersonal {
    Autoridad: string,
    Drogas: string
    Economicos: string,
    HistoriaClinicaId: HistoriaClinica,
    HojaHistoriaId: HojaHistoria,
    Id: number,
    Judiciales: string,
    Motivo: string,
    Orientacion: string,
    Pareja: string,
    Pares: string,
    Proteccion: string,
    Relaciones: boolean,
    Satisfaccion: string,
}