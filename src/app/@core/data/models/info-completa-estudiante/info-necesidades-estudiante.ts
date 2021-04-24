export class InfoNecesidadesEstudiante {
    CalidadVivienda: string;
    CuartosDormir: string;
    PersonasHogar: string;
    ServiciosPublicos: string[];
    OrigenAgua: string;
    AguasNegras:string;
    constructor() {
        this.CalidadVivienda= "";
        this.CuartosDormir= "pre: 4";
        this.PersonasHogar= "pre: 4";
        this.ServiciosPublicos= [""];
        this.OrigenAgua= "";
        this.AguasNegras= "";
    }
}