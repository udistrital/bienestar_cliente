import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-fisioterapia',
  templateUrl: './fisioterapia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class FisioterapiaComponent implements OnInit {
  nuevaEvolucionFisio: FormControl = this.fb.control('', Validators.required);
  fisioterapiaForm: FormGroup = this.fb.group({
    motivoConsultaFisio: [null, Validators.required],
    valoracion: [null, Validators.required],
    planDeManejoFisio: [null, Validators.required],
    observacionesFisioterapia: [null, Validators.required],
    evolucionFisio: this.fb.array([]),
  })
  pruebaEspecialista = {
    nombre: 'NOMBRE1 APELLIDO1',
    especialidad: 'ESPECIALIDAD 1',
  }
  constructor(private fb: FormBuilder, private toastr: ToastrService) { }
  ngOnInit() {
  }
  get evolucionFisioArr() {
    return this.fisioterapiaForm.get('evolucionFisio') as FormArray;
  }
  agregarEvolucionFisio() {
    if (this.nuevaEvolucionFisio.invalid) {
      return
    }
    this.evolucionFisioArr.push(new FormControl(this.nuevaEvolucionFisio.value, Validators.required));
    this.nuevaEvolucionFisio.reset();
  }
  borrarEvolucionFisio(i: number) {
    this.evolucionFisioArr.removeAt(i);
  }
  buscarEspecialista() {
    // TODO
  }
  guardarHistoriaFisioterapia() {
    const historiaFisio: any = {
      motivoConsulta: this.fisioterapiaForm.get('motivoConsultaFisio').value,
      valoracion: this.fisioterapiaForm.get('valoracion').value,
      planDeManejo: this.fisioterapiaForm.get('planDeManejoFisio').value,
      evolucion: this.fisioterapiaForm.get('evolucionFisio').value,
      observaciones: this.fisioterapiaForm.get('observacionesFisioterapia').value,

    }
    this.toastr.success('Ahora conecta todos los servicios xD', '¡Funciona!');
  }
}
