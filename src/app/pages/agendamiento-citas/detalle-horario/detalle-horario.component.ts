import { Component, OnInit } from '@angular/core';
import { TURNOS_ESPECIALISTAS } from '../../../@core/data/bienestar-simulated-data/turnos-especialistas'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ESPECIALIDADES } from '../../../@core/data/bienestar-simulated-data/especialidades'

@Component({
  selector: 'ngx-detalle-horario',
  templateUrl: './detalle-horario.component.html',
  styleUrls: ['./detalle-horario.component.scss']
})
export class DetalleHorarioComponent implements OnInit {
  tipoEspecialidadesData: Array<any>;
  turnos: Array<any>;

  constructor() { }

  ngOnInit() {
    this.turnos = TURNOS_ESPECIALISTAS;
    this.tipoEspecialidadesData = ESPECIALIDADES;
  }

  formGroup = new FormGroup({
    tipoEspecialidad: new FormControl(null, Validators.required),
    lunes: new FormControl(null, Validators.required),
    martes: new FormControl(null, Validators.required),
    miercoles: new FormControl(null, Validators.required),
    jueves: new FormControl(null, Validators.required),
    viernes: new FormControl(null, Validators.required),
    sabado: new FormControl(null, Validators.required),
  });

  guardar(){
    //TODO
  }

}
