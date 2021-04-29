import { TipoEvaluacion } from './tipo_evaluacion';

export class EvaluacionDocentePost {
  _id: string;
  tipo_evaluacion_id: string;
  nombre: string;
  descripcion: string;
  estructura_evaluacion: any;
  resultado: any;
  estado: any;
  respuestas_por_fecha: any[];
  fecha: Date;
  ciudad: string;
  fecha_creacion: string;
}
