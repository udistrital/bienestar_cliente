
export class InfoSocioEconomicaEstudiante {
    EstadoCivil: string;
    Estrato: number;
    IngresosMensuales: number; 
    CabezaFamilar: string; //COMO ESTUDIANTE SOSTIENE EL HOGAR EN QUE VIVE
    DependenciaEconomica: string; //COMO ESTUDIANTE SE SOSTIENE ECONÓMICAMENTE A SI MISMO
    PagaArriendo: boolean; // NO EXISTE
    ZonaVulnerabilidad: boolean; // NO EXISTE
    NumeroHermanos: string;
    ConQuienVive: string;  //  NO EXISTE
    TipoColegio: string;  // No FORM APOYO
    TipoVivienda: string; //Paga Arriendo
    
    constructor() {
        this.Estrato=0;
        this.CabezaFamilar="";
        this.IngresosMensuales=0;
        this.EstadoCivil="";
        this.DependenciaEconomica="";
        this.NumeroHermanos="";
        this.ConQuienVive="";
        this.ZonaVulnerabilidad=null;
        this.TipoColegio="";
        this.TipoVivienda="pre: Arriendo";
    }
}