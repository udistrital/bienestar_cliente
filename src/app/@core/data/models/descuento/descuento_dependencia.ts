import { TipoDescuento } from './tipo_descuento';

export class DescuentoDependencia {
  Id: number;
  Nombre: string;
  Dependencia: number;
  Periodo: number;
  Porcentaje: number;
  Activo: boolean;
  TipoDescuento: TipoDescuento;
}
