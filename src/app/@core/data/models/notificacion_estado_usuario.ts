import { Notificacion } from './notificacion';
import { NotificacionEstado } from './notificacion_estado';

export class NotificacionEstadoUsuario {
  Id: number;
  Notificacion: Array<Notificacion>;
  NotificacionEstado: Array<NotificacionEstado>;
  Fecha: Date;
  Usuario: string;
  Activo: boolean;
}
