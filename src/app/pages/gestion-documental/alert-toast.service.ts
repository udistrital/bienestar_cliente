import { Injectable } from "@angular/core";
import { NbComponentStatus, NbToastrService } from "@nebular/theme";

@Injectable()
export class AlertToastService {
    constructor(private toastrService: NbToastrService){}
    mostrarAlerta(mensaje: string, status?: NbComponentStatus){
        if(status !== undefined)
            this.toastrService.show(status, `${mensaje}`,  { status: status, destroyByClick: true, duration: 3000 } );
        else{
            this.toastrService.show('info', `${mensaje}`,  { status: 'info', destroyByClick: true, duration: 3000 } );
            
        }
    }
}