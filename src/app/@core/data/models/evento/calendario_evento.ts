import { TipoEvento } from './tipo_evento';
import { EncargadoEvento } from './encargado_evento';
import { TipoPublico } from './tipo_publico';

export class CalendarioEvento {
  Id: number;
  Descripcion: string;
  FechaInicio: Date;
  FechaFin: Date;
  PeriodoId: number;
  EventoPadreId: CalendarioEvento;
  TipoEventoId: TipoEvento;
}

export class CalendarioEventoPost {
  Evento: CalendarioEvento;
  EncargadosEvento: EncargadoEvento[];
  TiposPublico: TipoPublico[];
  Dependencia: number;
  TipoDependencia: number;
  TipoEvento: number;
  EventoPadre: number;
}

export class CalendarioEventoPut {
  Evento: CalendarioEvento;
  EncargadosEvento: EncargadoEvento[];
  TiposPublico: TipoPublico[];
  EncargadosEventoBorrados: EncargadoEvento[];
  TiposPublicoBorrados: TipoPublico[];
}
