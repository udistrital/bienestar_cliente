import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {

  public terminosAceptados = false;
  public resultado;

  constructor(private translate: TranslateService, ) {
   }

  ngOnInit() {
    this.contrato();
  }


contrato() {
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
