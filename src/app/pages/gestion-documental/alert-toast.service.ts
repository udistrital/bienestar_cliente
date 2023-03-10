import { Injectable } from "@angular/core";
import { NbComponentStatus, NbToastrService } from "@nebular/theme";

@Injectable()
export class AlertToastService {
    constructor(private toastrService: NbToastrService){}
    mostrarAlerta(mensaje: string, status?: NbComponentStatus){
        if(!status === undefined)
            this.toastrService.show(status, `${mensaje}`,  { status: status, destroyByClick: true, duration: 15000 } );
        else{
            this.toastrService.show(status, `${mensaje}`,  { status: status, destroyByClick: true, duration: 15000 } );
            this.toastrService.show(mensaje);
            this.toastrService.warning(mensaje);
            this.toastrService.success(mensaje);
            this.toastrService.danger(mensaje);
            this.toastrService.info(mensaje);
            this.toastrService.primary(mensaje);
            this.toastrService.default(mensaje);
        }
    }
}