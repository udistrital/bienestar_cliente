import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";
import { TipoSistema } from "./tipoSistema.model";

export interface Sistemas {
    HojaHistoria?: HojaHistoria | number,
    HistoriaClinica?: HistoriaClinica | number,
    Id?: number,
    TipoSistema?: TipoSistema,
    Observacion?: string,
}