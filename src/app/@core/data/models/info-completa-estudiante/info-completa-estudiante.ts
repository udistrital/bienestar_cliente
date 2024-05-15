import { InfoResidenciaEstudiante } from "./info-residencia-estudiante";
import { DatosIdentificacion } from "../terceros/datos_identificacion"
import { InfoSocioEconomicaEstudiante } from "./info-socioeconomica-estudiante";
import { InfoNecesidadesEstudiante } from './info-necesidades-estudiante';
import { InfoEspecialEstudiante } from './info-especial-estudiante';
import { InfoPersonasACargoEstudiante } from "./info-personas-a-cargo-estudiante";
import { InfoAcademicaEstudiante } from "./info-academica-estudiante";

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
    AntiguedadPrograma: string;
    InfoAcademica: InfoAcademicaEstudiante;
    InfoResidencia: InfoResidenciaEstudiante;
    InfoSocioeconomica: InfoSocioEconomicaEstudiante;
    InfoPersonasACargo: InfoPersonasACargoEstudiante;
    InfoNecesidades: InfoNecesidadesEstudiante;
    InfoEspecial: InfoEspecialEstudiante;

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
      this.AntiguedadPrograma=null;
      this.InfoAcademica=new InfoAcademicaEstudiante();
      this.InfoResidencia=new InfoResidenciaEstudiante();
      this.InfoSocioeconomica= new InfoSocioEconomicaEstudiante();
      this.InfoPersonasACargo = new InfoPersonasACargoEstudiante();
      this.InfoNecesidades= new InfoNecesidadesEstudiante();
      this.InfoEspecial= new InfoEspecialEstudiante();
      
    }
  }