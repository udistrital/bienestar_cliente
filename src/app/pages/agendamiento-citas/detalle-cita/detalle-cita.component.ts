import { Component, OnInit } from '@angular/core';
import { ESPECIALIDADES } from '../../../@core/data/bienestar-simulated-data/especialidades'
import { SEDES } from '../../../@core/data/bienestar-simulated-data/sedes'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AcademicaJbpmService } from '../../../@core/data/academica-jbpm.service';

@Component({
  selector: 'ngx-detalle-cita',
  templateUrl: './detalle-cita.component.html',
  styleUrls: ['./detalle-cita.component.scss']
})
export class DetalleCitaComponent implements OnInit {
  tipoEspecialidadesData: Array<any>;
  sedesData: Array<any>;
  estudiante: any[];
  nomEstudiante = '';
  nomCarrera = '';
  nomEstado = '';

  constructor(public  academicaws: AcademicaJbpmService) { }


  ngOnInit() {
    this.tipoEspecialidadesData = ESPECIALIDADES;
    this.sedesData = SEDES;
  }

  formGroup = new FormGroup({
    codigoEstudiante: new FormControl(null, Validators.required),
    tipoEspecialidad: new FormControl(null, Validators.required),
    sede: new FormControl(null, Validators.required),
    fecha: new FormControl(null, Validators.required),
  });

  guardar(){
    
  }

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
