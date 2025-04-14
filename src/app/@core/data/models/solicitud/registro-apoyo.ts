import { NumberFormatStyle } from "@angular/common";

export class RegistroApoyo {

    id: number;
    terceroId: number;
    periodoId: number;
    fecha: String;
    espacio_fisico_id: number;
    solicitudId: number;
    usurio_administrador: String;

    constructor( 
        periodoId: number,
        fecha: String,
        espacio_fisico_id: number,
        solicitudId: number,
        terceroId: number,
        usurio_administrador: String){
        this.id=0;
        this.periodoId=periodoId;
        this.fecha=fecha;
        this.espacio_fisico_id=espacio_fisico_id;
        this.solicitudId = solicitudId;
        this.terceroId= terceroId;
        this.usurio_administrador= usurio_administrador;
    }

}
