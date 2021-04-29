import { Estado } from "./estado";
import { TipoSolicitud } from "./tipo_solicitud";

export class EstadoTipoSolicitud {
    Activo: boolean;
    DependenciaId: number;
    EstadoId: Estado;
    FechaCreacion: string;
    FechaModificacion: string;
    Id: number;
    NumeroDias: number;
    TipoSolicitud: TipoSolicitud;
  }