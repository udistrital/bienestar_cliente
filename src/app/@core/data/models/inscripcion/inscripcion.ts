import { TipoInscripcion } from './tipo_inscripcion';
import { EstadoInscripcion } from './estado_inscripcion';

export class Inscripcion {
  Id: number;
  PersonaId: any;
  ProgramaAcademicoId: any;
  ReciboMatriculaId: number;
  ReciboInscripcionId: number;
  PeriodoId: any;
  EnfasisId: any;
  AceptaTerminos: boolean;
  FechaAceptaTerminos: Date;
  TipoInscripcionId: TipoInscripcion;
  EstadoInscripcionId: EstadoInscripcion;
  Activo: boolean;
}
