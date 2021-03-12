import { TipoRecibo } from './tipo_recibo';
import { EstadoRecibo } from './estado_recibo';

export class Recibo {
  Id: number;
  Referencia: number;
  TipoReciboId: TipoRecibo;
  EstadoReciboId: EstadoRecibo;
  FechaOrdinaria: Date;
  ValorOrdinario: number;
}
