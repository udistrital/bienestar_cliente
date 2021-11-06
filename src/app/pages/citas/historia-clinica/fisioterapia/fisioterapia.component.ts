import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConsultaFisioterapia } from '../../../../shared/models/Salud/consultaFisioterapia.model';
import { SaludService } from '../../../../shared/services/salud.service';

@Component({
  selector: 'ngx-fisioterapia',
  templateUrl: './fisioterapia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class FisioterapiaComponent implements OnInit {
  idHistoria: number | null;
  fisioterapia: ConsultaFisioterapia | null;
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
  constructor(private fb: FormBuilder, private toastr: ToastrService, private saludService: SaludService) { }
  ngOnInit() {
    this.cargarInformacion();
    this.idHistoria = this.saludService.IdHistoria;
    console.log(this.saludService.IdHistoria);

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
  cargarInformacion() {
    this.saludService.getHojaHistoria(this.saludService.IdPersona).subscribe(data => {
      this.idHistoria = data[0].Id;
      this.saludService.getConsultaFisioterapia(this.idHistoria).subscribe(data => {
        // console.log(data);
        this.fisioterapia = data[0];
        this.fisioterapiaForm.controls.motivoConsultaFisio.setValue(this.fisioterapia.MotivoConsulta);
        this.fisioterapiaForm.controls.valoracion.setValue(this.fisioterapia.Valoracion);
        this.fisioterapiaForm.controls.planDeManejoFisio.setValue(this.fisioterapia.PlanManejo);
        this.fisioterapiaForm.controls.observacionesFisioterapia.setValue(this.fisioterapia.Observaciones);
        let evolucion = JSON.parse(this.fisioterapia.Evolucion);
        this.evolucionFisioArr.push(new FormControl(evolucion.Evolución));
      });
    });

  }
}
