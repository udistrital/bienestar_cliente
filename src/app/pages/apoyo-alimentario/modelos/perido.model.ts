
export class PeriodoModel{
    id: string;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: string;
    
    constructor(){
        this.estado="nuevo";  
    }
}