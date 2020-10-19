import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'ngx-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {


  public resultado;
  estadoApoyo: string[] = ['Nuevo', 'Antiguo'];

  solicitudAAFormulario = this.formBuilder.group({
    nombres: [''],
    apellidos: [''],
    identificacion: [''],
    direccion: [''],
    tipoDoc: [''],
    estado: [''],
    url: ['']
  });


  constructor(private formBuilder: FormBuilder, private translate: TranslateService, ) {
   }

  ngOnInit() {
  }

guardar() {
  // aca se envia la información a un servicio
  console.log('quedo papu');
}





}
