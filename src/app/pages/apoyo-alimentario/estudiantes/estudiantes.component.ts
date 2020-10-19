import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { EstudiantesService } from '../../../@core/helpers/estudiantes/estudiantes.service';
import { Estudiante } from '../../../@core/data/models/estudiante';

@Component({
  selector: 'ngx-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {


  public resultado;
  estadoApoyo: string[] = ['Nuevo', 'Antiguo'];
  estudiantes: Estudiante[] = [];

  solicitudAAFormulario = this.formBuilder.group({
    nombres: [''],
    apellidos: [''],
    identificacion: [''],
    direccion: [''],
    tipoDoc: [''],
    estado: [''],
    url: ['']
  });


  constructor(
    private formBuilder: FormBuilder, 
    private translate: TranslateService, 
    private estudiantesService: EstudiantesService 
    ) {
   }

  ngOnInit() {
    this.consultarEstudiantes();
  }

  guardar() {
    // aca se envia la información a un servicio
    console.log('quedo papu');
    console.log(this.estudiantes);
  }

  consultarEstudiantes() {
    this.estudiantesService.getEstudiantesInfo().subscribe((data) => this.estudiantes = data.estudiantes.estudiante);
  }
}
