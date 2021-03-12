import { TipoParentesco } from './tipo_parentesco';
import { InfoComplementariaTercero } from './info_complementaria_tercero';
import { Tercero } from './tercero';

export class TerceroFamiliar {
  Id: number;
  TerceroId: Tercero;
  TerceroFamiliarId: Tercero;
  TipoParentescoId: TipoParentesco;
  CodigoAbreviacion: string;
}

export class TerceroFamiliarConInfoComplementaria {
  Familiar: TerceroFamiliar;
  InformacionContacto: InfoComplementariaTercero[];
}

export class TrPostInformacionFamiliar {
  Tercero_Familiar: Tercero;
  Familiares: TerceroFamiliarConInfoComplementaria[];
}
