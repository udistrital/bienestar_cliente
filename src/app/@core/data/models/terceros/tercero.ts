import { TipoContribuyente } from './tipo_contribuyente';

export class Tercero {
  Id: number;
  NombreCompleto: string;
  TipoContribuyenteId: TipoContribuyente;
  DatosDocumento: any;
  FechaNacimiento: Date;
}
