import { CategoriaProduccion } from './categoria_produccion';
import { TipoProduccionAcademica } from './tipo_produccion_academica';

export class SubTipoProduccionAcademica {
  Id: number;
  Nombre: string;
  TipoProduccionId: TipoProduccionAcademica;
  CategoriaProduccion: CategoriaProduccion;
  Descripcion: string;
  CodigoAbreviacion: string;
  Activo: boolean;
  NumeroOrden: number;
}
