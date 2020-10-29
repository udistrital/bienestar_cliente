import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-apoyo-alimentario',
  templateUrl: './apoyo-alimentario.component.html',
  styleUrls: ['./apoyo-alimentario.component.scss']
})
export class ApoyoAlimentarioComponent implements OnInit {

  public terminosAceptados = true;
  constructor(private translate: TranslateService,) { }

  ngOnInit() {
    this.contratoPopUp();
  }

  contratoPopUp() {
    if (!this.terminosAceptados) {
      Swal.fire({
        title: 'Activación apoyo alimentario',
        text: 'Para solicitar el apoyo necesario debe aceptar los siguientes terminos y condicones',
        input: 'checkbox',
        inputPlaceholder: 'Acepto los terminos y condiciones',
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        showCancelButton: true,
        cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
        inputValidator: (value) => {
          if (!value) {
            return 'Marca la casilla de confirmación, para aceptar';
          }
        }
      }).then((result) => {
        if (result.value) {
          this.terminosAceptados = true;
        }
      });
    }
  }

}
