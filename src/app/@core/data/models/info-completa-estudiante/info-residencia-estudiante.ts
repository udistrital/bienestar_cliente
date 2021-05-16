
export class InfoResidenciaEstudiante {
    Localidad: string;
    Municipio: string;
    Direccion: string;
    Barrio: string;
    Telefono: string;
    Sisben: boolean;
    Puntaje_Sisben: string;
    Grupo_Sisben: string;
    constructor() {
        this.Localidad= "LOCALIDAD PRUEBA";
        this.Municipio= "MUNICIPIO PRUEBA";
        this.Direccion= "DIRECCION PRUEBA";
        this.Telefono= "TELEFONO PB";
        this.Barrio="BARRIO PRUEBA";
        this.Sisben= false;
        this.Puntaje_Sisben= "0";
        this.Grupo_Sisben= "";
    }
}