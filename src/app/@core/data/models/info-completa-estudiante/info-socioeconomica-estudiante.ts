
export class InfoSocioEconomicaEstudiante {
    EstadoCivil: string;
    Estrato: number;
    IngresosMensuales: number; // NO EXISTE
    CabezaFamilar: string; //COMO ESTUDIANTE SOSTIENE EL HOGAR EN QUE VIVE
    DependenciaEconomica: string; //COMO ESTUDIANTE SE SOSTIENE ECONÓMICAMENTE A SI MISMO
    ValorMatricula: string;  // NO EXISTE
    PersonasACargo: boolean;
    PagaArriendo: boolean; // NO EXISTE
    ZonaVulnerabilidad: boolean; // NO EXISTE
    NumeroHermanos: string;
    ConQuienVive: string;
    TipoColegio: string;  // No FORM APOYO
    TipoVivienda: string; //Paga Arriendo
    constructor() {
        this.Estrato=0;
        this.DependenciaEconomica="";
        this.IngresosMensuales=0;
        this.EstadoCivil="";
        this.DependenciaEconomica="";

    }
}