import { RolEncargadoEvento } from './rol_encargado_evento';
import { CalendarioEvento } from './calendario_evento';

export class EncargadoEvento {
  Id: number;
  EncargadoId: number;
  Nombre: string;
  Activo: boolean;
  RolEncargadoEventoId: RolEncargadoEvento;
  CalendarioEventoId: CalendarioEvento;
}
