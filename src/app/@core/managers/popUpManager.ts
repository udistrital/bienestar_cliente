import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
    providedIn: 'root',
})
export class PopUpManager {
    constructor(
        private toast: NbToastrService,
        private translate: TranslateService,
    ) { }
    /**
     * showToast
     */
    public showToast(status, message: string, tittle = '') {
        this.toast.show(message, tittle, { status });
    }

    public showErrorToast(message: string) {
        const status: any = 'danger';
        this.toast.show(message, this.translate.instant('GLOBAL.error'), { status });
    }

    public showInfoToast(message: string) {
        const status: any = 'info';
        const duration: any = 0;
        this.toast.show(message, this.translate.instant('GLOBAL.info'), { status, duration });
    }

    public showAlert(status: any, title: string, text: string) {
        return Swal.fire({
            type: status,
            title: title,
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            showCancelButton: true,
            cancelButtonText: this.translate.instant('GLOBAL.cancelar')
        });
    }

    public showAlertInput(status: any, title: string, text: string, text_validtador: string, input: any) {
        return Swal.fire({
            type: status,
            title: title,
            text: text,
            input: input,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            showCancelButton: true,
            cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
            inputValidator: (value) => {
                if (!value) {
                  return text_validtador;
                }
              }
        });
    }

    public showAlertRadio(title: string, options: any, text_validator?: string) {
        return Swal.fire({
            title: title,
            input: 'radio',
            inputOptions: options,
            inputValidator: (value) => {
                if (!value) {
                    return text_validator;
                }
            }
        });
    }

    public showSuccessAlert(text, tittle?) {
        Swal.fire({
            type: 'success',
            title: tittle ? this.translate.instant(tittle) : this.translate.instant('GLOBAL.operacion_exitosa'),
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
    }

    public showInfoAlert(text: string, tittle?: string) {
        Swal.fire({
            type: 'info',
            title: tittle ? this.translate.instant(tittle) : this.translate.instant('GLOBAL.operacion_exitosa'),
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
    }

    public showSuccessTemplate(template) {
        Swal.fire({
            type: 'success',
            title: this.translate.instant('GLOBAL.operacion_exitosa'),
            html: template,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
    }

    public showErrorAlert(text) {
        Swal.fire({
            type: 'error',
            title: this.translate.instant('GLOBAL.error'),
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            cancelButtonText: this.translate.instant('GLOBAL.cancelar')
        });
    }
}
