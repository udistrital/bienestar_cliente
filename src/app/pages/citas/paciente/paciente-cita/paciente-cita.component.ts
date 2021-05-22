import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-paciente-cita',
  templateUrl: './paciente-cita.component.html',
  styleUrls: ['./paciente-cita.component.scss']
})
export class PacienteCitaComponent implements OnInit {

  constructor(private fb: FormBuilder, private toastr: ToastrService) { }
  cita: any[] = [
    { id: 1, fecha: '15-04-2021', hora: '10:30', especialidad: 'Odontología', lugar: 'Calle 40', especialista: 'Diana Montoya' },
    { id: 2, fecha: '15-04-2021', hora: '16:00', especialidad: 'Psicología', lugar: 'Macarena A', especialista: 'Jesús Zoa' },
  ];

  ngOnInit() {
  }
  cancelarCita(i: number) {
    // this.citaService.cancelarCita(id).then(() => {
    this.cita.splice(0, i);
    this.toastr.success('La cita se canceló con éxito', 'Cita Cancelada');
    // }).cath(error => {
    // this.toastr.error('No fue posible cancelar la cita', 'Error');
    // })


  }
}
