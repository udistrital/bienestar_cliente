import { ProduccionAcademica } from './produccion_academica';
import { MetadatoSubtipoProduccion } from './metadato_subtipo_produccion';

export class MetadatoProduccionAcademica {
    Id: number;
    ProduccionAcademicaId: ProduccionAcademica;
    MetadatoSubtipoProduccionId: MetadatoSubtipoProduccion;
    Valor: string;
}
