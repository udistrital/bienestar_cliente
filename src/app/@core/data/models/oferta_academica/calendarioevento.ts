import { Tipoevento } from './tipoevento';

export class Calendarioevento {
  Id: number;
  Descripcion: string;
  Fechainicio: Date;
  Fechafin: Date;
  Periodoid: number;
  Activo: boolean;
  Tipoevento: Tipoevento;
}
