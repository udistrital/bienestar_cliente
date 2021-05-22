import { TipoContribuyente } from './tipo_contribuyente';

export class Tercero {
  Id: number;
  NombreCompleto: string;
  PrimerApellido: string;
  PrimerNombre: string;
  SegundoApellido: string;
  SegundoNombre: string;
  FechaNacimiento: any;
  Activo: true;
  FechaCreacion: string;
  FechaModificacion: string;
  TipoContribuyenteId: TipoContribuyente;
  UsuarioWSO2: string;
}
