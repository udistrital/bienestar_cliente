import { TipoMetadato } from './tipo_metadato';
import { SubTipoProduccionAcademica } from './subtipo_produccion_academica';

export class MetadatoSubtipoProduccion {
    Id: number;
    SubTipoProduccionId: SubTipoProduccionAcademica;
    TipoMetadatoId: TipoMetadato;
}
