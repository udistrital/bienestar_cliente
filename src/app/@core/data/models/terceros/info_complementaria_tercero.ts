import { InfoComplementaria  } from './info_complementaria';
import { Tercero  } from './tercero';

export class InfoComplementariaTercero {
  Id: number;   
  TerceroId: Tercero;   
  InfoComplementariaId: InfoComplementaria;  
  Dato: string; 
  Activo: boolean;

  constructor(){
    this.Id=0;
    this.Activo=true;
  }
}

