export class InfoEspecialEstudiante {
    CondicionDesplazado: boolean;
    CondicionEspecial: string;
    Discapacidad: string;
    Patologia: string;
    SeguridadSocial: string;
    SerPiloPaga:string;
    constructor() {
        this.CondicionDesplazado= false;
        this.CondicionEspecial= "";
        this.Discapacidad= 'si';
        this.Patologia= "si";
        this.SeguridadSocial= "";
        this.SerPiloPaga= "no";
    }
}