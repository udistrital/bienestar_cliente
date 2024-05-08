import { HistoriaClinica } from "./historiaClinica.model";

export interface AccesoHistoria {
    IdAccesoHistoria?: number,
    IdHistoriaClinica?: HistoriaClinica | number,
    FechaAcceso?: Date,
    ProfesionalId?: number,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Activo?: boolean,
}
