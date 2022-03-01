import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model"

export interface ExamenEstomatologico {
    HojaHistoriaId?: HojaHistoria | number,
    HistoriaClinicaId?: HistoriaClinica | number,
    Id?: number,
    ArticulacionTemporo?: string,
    Carrillos?: string,
    GlandulasSalivares?: string,
    Labios?: string,
    Lengua?: string,
    Maxilares?: string,
    MusculosMasticadores?: string,
    Paladar?: string,
    PisoBoca?: string,
    SenosMaxilares?: string,
    SistemaLinfaticoRegional?: string,
    SistemaNervioso?: string,
    SistemaVascular?: string,
}