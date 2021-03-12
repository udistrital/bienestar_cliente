import { Metodologia } from './metodologia';
import { NivelFormacion } from './nivel_formacion';
import { Titulacion } from './titulacion';

export class ProgramaAcademico {
  Id: number;
  Codigo: number;
  Nombre: string;
  Institucion: number;
  Metodologia: Metodologia;
  NivelFormacion: NivelFormacion;
  Titulacion: Titulacion;
  Duracion: number;
  UnidadTiempo: number;
}
