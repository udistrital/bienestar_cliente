import { Seccion } from './seccion';

export class TipoEvaluacion {
  _id: string;
  nombre: string;
  descripcion: string;
  estructura_tipo_evaluacion: any;
  secciones_id: Seccion[];
}
