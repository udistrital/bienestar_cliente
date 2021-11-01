import { HojaHistoria } from "./hojaHistoria.model";

export interface ConsultaFisioterapia {
    Evolucion: string,
    IdConsultaFisioterapia: number,
    IdHojaHistoria: HojaHistoria,
    Motivo_consulta: string,
    Observaciones: string,
    PlanManejo: string,
    Valoracion: string,
}