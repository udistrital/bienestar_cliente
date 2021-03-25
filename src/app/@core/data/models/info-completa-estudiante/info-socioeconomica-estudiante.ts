
export class InfoSocioEconomicaEstudiante {
    EstadoCivil: string;
    Estrato: number;
    IngresosMensuales: string; // NO EXISTE
    CabezaFamilar: string; //COMO ESTUDIANTE SOSTIENE EL HOGAR EN QUE VIVE
    DependenciaEconomica: string; //COMO ESTUDIANTE SE SOSTIENE ECONÓMICAMENTE A SI MISMO
    ValorMatricula: string;  // NO EXISTE
    PersonasACargo: boolean;
    Hijos: string;
    NumeroHijos: string;
    PagaArriendo: boolean; // NO EXISTE
    ZonaVulnerabilidad: boolean; // NO EXISTE
    NumeroHermanos: string;
    constructor() {
        this.EstadoCivil="";
        this.Estrato=0;
        this.DependenciaEconomica="";
        this.IngresosMensuales="";
    }
}