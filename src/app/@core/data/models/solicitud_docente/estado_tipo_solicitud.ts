import { TipoSolicitud } from './tipo_solicitud';
import { Estado } from './estado'

export class EstadoTipoSolicitud {
  Id: number;
  TipoSolicitudId: TipoSolicitud;
  EstadoId: Estado;
  DependenciaId: number;
  NumeroDias: number;
  FechaModificacion: any;
}
