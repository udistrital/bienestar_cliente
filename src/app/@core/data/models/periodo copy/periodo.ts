import { TipoPeriodo } from './tipo_periodo';

export class Periodo {
  Id: number;
  Ano: string;
  Periodo: string;
  Descripcion: string;
  CodigoAbreviacion: string;
  Activo: boolean;
  NumeroOrden: number;
  TipoPeriodo: TipoPeriodo;
}
