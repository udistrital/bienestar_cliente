import { NotificacionConfiguracion } from './notificacion_configuracion';

export class Notificacion {
  Id: number;
  FechaCreacion: Date;
  CuerpoNotificacion: string;
  NotificacionConfiguracion: NotificacionConfiguracion;
}
