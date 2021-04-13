import { InfoResidenciaEstudiante } from "./info-residencia-estudiante";
import { DatosIdentificacion } from "../terceros/datos_identificacion"
import { InfoSocioEconomicaEstudiante } from "./info-socioeconomica-estudiante";
import { InfoNecesidadesEstudiante } from './info-necesidades-estudiante';
import { InfoEspecialEstudiante } from './info-especial-estudiante';
import { InfoPersonasACargoEstudiante } from "./info-personas-a-cargo-estudiante";

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
    InfoNecesidades: InfoNecesidadesEstudiante;
    InfoEspecial: InfoEspecialEstudiante;
    InfoPersonasACargo: InfoPersonasACargoEstudiante;

    constructor(){
      this.IdTercero=0;
      this.Nombre="";
      this.Carnet= null;
      this.Documento= null;
      this.FechaNacimiento="";
      this.ProyectoCurricular="";
      this.Facultad="";
      this.Correo="";
      this.Genero="";
      this.InfoResidencia=new InfoResidenciaEstudiante();
      this.InfoSocioeconomica= new InfoSocioEconomicaEstudiante();
      this.InfoNecesidades= new InfoNecesidadesEstudiante();
      this.InfoEspecial= new InfoEspecialEstudiante();
      this.InfoPersonasACargo = new InfoPersonasACargoEstudiante();
    }
  }