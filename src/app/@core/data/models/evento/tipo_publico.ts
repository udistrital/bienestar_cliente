import { CalendarioEvento } from './calendario_evento';

export class TipoPublico {
  Id: number;
  Nombre: string;
  Descripcion: string;
  CodigoAbreviacion: string;
  Activo: boolean;
  CalendarioEventoId: CalendarioEvento;
}
