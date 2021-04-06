import { NumberFormatStyle } from "@angular/common";

export class RegistroApoyo {

    id: number;
    periodoId: number;
    date: String;
    espacio_fisico_id: number;
    solicitudId: number;
    terceroId: number;
    usurio_administrador: String;

    constructor( 
        periodoId: number,
        date: String,
        espacio_fisico_id: number,
        solicitudId: number,
        terceroId: number,
        usurio_administrador: String){
        this.id=0;
        this.periodoId=periodoId;
        this.date=date;
        this.espacio_fisico_id=espacio_fisico_id;
        this.solicitudId = solicitudId;
        this.terceroId= terceroId;
        this.usurio_administrador= usurio_administrador;
    }

}
