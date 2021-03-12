import { PeriodoAcademico } from './periodo_academico';
import { ProgramaAcademico } from './programa_academico';
import { TipoIdentificacion } from './tipo_identificacion';

export class Pago {
  Secuencia: number;
  Concepto: string;
  TipoRecibo: number;
  Periodo: string;
  Anio: string;
  ProgramaId: number;
  Perpago: PeriodoAcademico;
  Proyecto: ProgramaAcademico;
  TipoIdentificacion: TipoIdentificacion;
  Codigo: number;
  Nombre: string;
  Apellido: string;
  Correo: string;
  ValorOrdinario: number;
  EstadoPago: string;
  FechaOrdinaria: Date;
}
