import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface Sistemas {
    HojaHistoria?: HojaHistoria | number,
    HistoriaClinica?: HistoriaClinica | number,
    Id?: number,
    Articular?: string,
    CardioVascular?: string,
    Colageno?: string,
    Digestivo?: string,
    Linfatico?: string,
    Muscular?: string,
    Neurologico?: string,
    Oseo?: string,
    Piel?: string,
    Respiratorio?: string,
    Sentidos?: string,
    Urinario?: string,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Activo?: boolean,
}