import { Tercero } from '../terceros/tercero';

export class Invitacion {
  Id: number;
  SolicitudId: any;
  TerceroId: number;
  NombrePar: string;
  CorreoPar: string;
  Activo: boolean;
  Persona: Tercero;
}
