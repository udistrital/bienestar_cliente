import { Periodo } from "./periodo";
import { Parametro } from "./parametro";

export class ParametroPeriodo{
    Id: number;
    Activo: boolean;
    FechaCreacion: string;
    FechaModificacion: string;
    ParametroId: Parametro;
    PeriodoId: Periodo;
    Valor: string;
    constructor(){
      this.Id=0;
      this.Activo=true;
      this.FechaCreacion= "0";
      this.FechaModificacion= "0";
      this.Valor=null;
    }
  }