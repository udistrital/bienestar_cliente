import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model"

export interface Examen {
    HojaHistoria?: HojaHistoria,
    HistoriaClinica?: HistoriaClinica | number,
    Id?: number,
    Abdomen?: string,
    CabezaYCuello?: string,
    EstadoGeneral?: string,
    Extremidades?: string,
    Fc?: string,
    Fr?: string,
    Genital?: string,
    Imc?: string,
    Laboratorio?: string,
    Neurologico?: string,
    Ojos?: string,
    Orl?: string,
    Peso?: string,
    RuidosCardiacos?: string,
    RuidosRespiratorios?: string
    Sao2?: string,
    Ta?: string,
    Talla?: string,
    Temperatura?: string,
    Torax?: string,
}