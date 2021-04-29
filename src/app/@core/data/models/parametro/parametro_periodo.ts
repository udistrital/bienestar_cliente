import { Periodo } from "./periodo";
import { Parametro } from "./parametro";

/* "2021-03-15 13:10:54.622019 +0000 +0000" */
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