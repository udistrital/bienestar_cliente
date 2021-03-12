import { TipoProduccionAcademica } from './tipo_produccion_academica';

export class SubTipoProduccionAcademica {
  Id: number;
  Nombre: string;
  TipoProduccionId: TipoProduccionAcademica;
  Descripcion: string;
  CodigoAbreviacion: string;
  Activo: boolean;
  NumeroOrden: number;
}
