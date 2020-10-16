import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AcademicaJbpmService } from '../services/academica-jbpm.service';

@Component({
  selector: 'ngx-detalle-paciente',
  templateUrl: './detalle-paciente.component.html',
  styleUrls: ['./detalle-paciente.component.scss']
})
export class DetallePacienteComponent implements OnInit {

  nomEstudiante = '';
  nomCarrera = '';
  nomEstado = '';

  constructor(public  academicaws: AcademicaJbpmService) { }

  ngOnInit() {
  }

  formGroup = new FormGroup({
    codigoEstudiante: new FormControl(null, Validators.required),
  });

  buscarEstudiante() {
    this.academicaws.getDatosBasicosEstudiante(this.formGroup.value.codigoEstudiante)
    .subscribe((data: any)=>{
      var estudiante = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.nomEstudiante = estudiante.nombre;
      this.nomCarrera = estudiante.carrera;
      this.academicaws.getCarrera(estudiante.carrera)
      .subscribe((data: any)=>{
        this.nomCarrera = data.carrerasCollection.carrera[0].nombre;
    });
      this.nomEstado = estudiante.estado;
    });
  }

}
