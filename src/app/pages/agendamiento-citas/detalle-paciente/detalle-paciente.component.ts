import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-detalle-paciente',
  templateUrl: './detalle-paciente.component.html',
  styleUrls: ['./detalle-paciente.component.scss']
})
export class DetallePacienteComponent implements OnInit {

  nomEstudiante = '';
  nomCarrera = '';
  nomEstado = '';

  constructor() { }

  ngOnInit() {
  }

  formGroup = new FormGroup({
    codigoEstudiante: new FormControl(null, Validators.required),
  });

  buscarEstudiante() {
    this.nomEstudiante = this.formGroup.value.codigoEstudiante;
  }

}
