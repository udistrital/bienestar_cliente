import { toJSDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar";
import { formatDate } from "@angular/common";

export class ApoyoAlimentario{
    _id: string;
    terceroId: number;
    solicitudId: number;
    periodoId: number;
    espacioFisicoId: number;
    usuarioAdministrador: String;
    fechaRegistro: String;
    activo: boolean;
    fecha_creacion: string;
    fecha_modificacion: string;
    constructor(){
        this.solicitudId=null;
        this.activo=true;
        this.fechaRegistro = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.fecha_creacion = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
        this.fecha_modificacion = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
    }

}