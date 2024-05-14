export class InfoNecesidadesEstudiante {
    CalidadVivienda: string;
    CuartosDormir: string;
    PersonasHogar: string;
    ServiciosPublicos: string[][];
    OrigenAgua: string;
    AguasNegras:string;
    constructor() {
        this.CalidadVivienda= "";
        this.CuartosDormir= "";
        this.PersonasHogar= "";
        this.OrigenAgua= "";
        this.AguasNegras= "";
        this.ServiciosPublicos = [["luz", ""],
                                  ["gas", ""],
                                  ["telefono", ""],
                                  ["tv", ""]]; 
    }
}