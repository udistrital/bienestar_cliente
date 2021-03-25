import { MetodoHttp } from './metodo_http';
import { NotificacionTipo } from './notificacion_tipo';
import { Aplicacion } from './aplicacion';

export class NotificacionConfiguracion {
  Id: number;
  EndPoint: string;
  MetodoHttp: MetodoHttp;
  Tipo: NotificacionTipo;
  CuerpoNotificacion: string;
  Aplicacion: Aplicacion;
}
