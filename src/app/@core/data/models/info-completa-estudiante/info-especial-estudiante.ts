export class InfoEspecialEstudiante {
    CondicionDesplazado: boolean;
    CondicionEspecial: string;
    Discapacidad: string;
    Patologia: string;
    SeguridadSocial: string;
    SerPiloPaga:string;
    constructor() {
        this.CondicionDesplazado= false;
        this.CondicionEspecial= null;
        this.Discapacidad= 'si';
        this.Patologia= null;
        this.SeguridadSocial= null;
        this.SerPiloPaga= "no";
    }
}