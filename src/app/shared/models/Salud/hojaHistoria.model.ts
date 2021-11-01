import { HistoriaClinica } from "./historiaClinica.model";
import { Diagnostico } from "./diagnostico.model";

export interface HojaHistoria {
    IdHistoriaClinica: HistoriaClinica,
    IdDiagnostico: Diagnostico,
    Evolucion: string,
    FechaConsulta: string,
    IdEspecialidad: number,
    IdHojaHistoria: number,
    IdPersona: number,
    IdProfesional: number,
    Motivo: string,
    Observacion: string
}