import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";
import { TipoOdontograma } from "./tipoOdontograma";

export interface Odontograma {
    HistoriaClinicaId?: HistoriaClinica | number,
    IdHojaHistoria?: HojaHistoria | number,
    Id?: number,
    Observaciones?: string,
    IdTipoOdontograma?: TipoOdontograma,
    Diagrama?: string,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Activo?: boolean,
}