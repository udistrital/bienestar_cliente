import { Tercero } from '../terceros/tercero';
import { TipoObservacion } from './tipo_observacion';

export class Observacion {
  Id: number;
  TipoObservacionId: TipoObservacion;
  SolicitudId: any;
  TerceroId: number;
  Titulo: string;
  Valor: string;
  FechaCreacion: string;
  Activo: boolean;
  Persona: Tercero;
}
