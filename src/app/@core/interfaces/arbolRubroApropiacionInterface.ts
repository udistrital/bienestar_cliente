export interface ArbolRubroApropiacionInterface {
  Codigo: string;
  Descripcion?: string;
  ApropiacionInicial: number;
  ValorInicial?: number;
  ValorActual?: number;
  Hijos?: ArbolRubroApropiacionInterface[];
  Movimientos?: string[];
  Padre?: string;
  UnidadEjecutora: number;
  Estado?: string;
  IsLeaf: boolean;
  expanded?: boolean;
  data?: ArbolRubroApropiacionInterface;
  children?: ArbolRubroApropiacionInterface[];
  Nombre: string;
}
