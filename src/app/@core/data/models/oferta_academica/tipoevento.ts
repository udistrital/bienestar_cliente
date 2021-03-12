import { Tiporecurrencia } from './tiporecurrencia';

export class Tipoevento {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Codigoabreviacion: string;
  Activo: boolean;
  Dependenciaid: number;
  Tiporecurrencia: Tiporecurrencia;
}
