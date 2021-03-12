import { DescuentoDependencia } from './descuento_dependencia';

export class SolicitudDescuento {
  Id: number;
  Persona: number;
  Periodo: number;
  Documento: any;
  Estado: string;
  Activo: boolean;
  DescuentoDependencia: DescuentoDependencia;
}
