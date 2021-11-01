import { HojaHistoria } from "./hojaHistoria.model";

export interface Sistemas {
    IdHojaHistoria: HojaHistoria,
    IdSistema: number,
    NombreSistema: string,
    Observacion: string,
}