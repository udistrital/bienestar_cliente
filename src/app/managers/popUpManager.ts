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

    public showAlert(status, title, text) {
        return Swal.fire({
            type: status,
            title: title,
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            showCancelButton: true,
        });
    }

    public showSuccessAlert(text) {
        Swal.fire({
            type: 'success',
            title: this.translate.instant('GLOBAL.operacion_exitosa'),
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
    }

    public showErrorAlert(text) {
        Swal.fire({
            type: 'error',
            title: this.translate.instant('GLOBAL.error'),
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
    }
}
