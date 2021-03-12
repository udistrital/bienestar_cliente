import { SubTipoProduccionAcademica } from './subtipo_produccion_academica';
import { MetadatoSubtipoProduccion } from './metadato_subtipo_produccion';

export class ProduccionAcademica {
  Id: number;
  SubTipoProduccionAcademica: SubTipoProduccionAcademica;
  Titulo: string;
  Resumen: string;
  Fecha: Date;
}

export class ProduccionAcademicaPost {
  Id: number;
  SubtipoProduccionId: SubTipoProduccionAcademica;
  Titulo: string;
  Resumen: string;
  Fecha: Date;
  MetadatoSubtipoProduccion: MetadatoSubtipoProduccion[];
  Metadatos: any[];
  Autores: any[];
}

