import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";
import { TipoSistema } from "./tipoSistema.model";

export interface Sistemas {
    HojaHistoria: HojaHistoria,
    HistoriaClinica:HistoriaClinica,
    Id: number,
    TipoSistema: TipoSistema,
    Observacion: string,
}