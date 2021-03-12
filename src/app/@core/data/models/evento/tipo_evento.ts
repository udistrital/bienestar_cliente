import { TipoRecurrencia } from './tipo_recurrencia';

export class TipoEvento {
  Id: number;
  Nombre: string;
  Descripcion: string;
  CodigoAbreviacion: string;
  Activo: boolean;
  DependenciaId: number;
  TipoRecurrenciaId: TipoRecurrencia;
}
