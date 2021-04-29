import { InfoComplementaria  } from './info_complementaria';
import { Tercero  } from './tercero';

export class InfoComplementariaTercero {
  Id: number;
  TerceroId: Tercero;
  InfoComplementariaId: InfoComplementaria;
  Dato: string;
  Activo: boolean;
  PadreId: number;
}
