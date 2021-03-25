import { InfoResidenciaEstudiante } from "./info-residencia-estudiante";
import { DatosIdentificacion } from "../terceros/datos_identificacion"
import { InfoSocioEconomicaEstudiante } from "./info-socioeconomica-estudiante";

export class InfoCompletaEstudiante {
    IdTercero: number;
    Nombre: string;
    Carnet: DatosIdentificacion;
    Documento: DatosIdentificacion;
    FechaNacimiento: string;
    ProyectoCurricular: string;
    Facultad: string;
    Correo_Institucional: string;
    Correo: string;
    Celular: string;
    Genero: string;
    InfoResidencia: InfoResidenciaEstudiante;
    InfoSocioeconomica: InfoSocioEconomicaEstudiante;

    constructor(){
      this.IdTercero=0;
      this.Nombre="";
      this.Carnet= new DatosIdentificacion();
      this.Documento= new DatosIdentificacion();
      this.FechaNacimiento="";
      this.ProyectoCurricular="";
      this.Facultad="";
      this.Correo="";
      this.InfoResidencia=new InfoResidenciaEstudiante();
      this.Genero="";
    }
  }