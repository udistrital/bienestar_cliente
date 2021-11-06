import { HojaHistoria } from "./hojaHistoria.model";

export interface ConsultaFisioterapia {
    Evolucion: string,
    Id: number,
    HojaHistoria: HojaHistoria,
    MotivoConsulta: string,
    Observaciones: string,
    PlanManejo: string,
    Valoracion: string,
}