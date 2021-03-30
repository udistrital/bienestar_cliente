export class InfoNecesidadesEstudiante {
    CalidadVivienda: string;
    CuartosDormir: string;
    PersonasHogar: number;
    ServiciosPublicos: string[];
    OrigenAgua: string;
    AguasNegras:string;
    constructor() {
        this.CalidadVivienda= "";
        this.CuartosDormir= "4";
        this.PersonasHogar= 4;
        this.ServiciosPublicos= [""];
        this.OrigenAgua= "";
        this.AguasNegras= "";
    }
}