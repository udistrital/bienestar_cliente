import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConsultaFisioterapia } from '../../../../shared/models/Salud/consultaFisioterapia.model';
import { Evolucion } from '../../../../shared/models/Salud/evolucion.model';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';

@Component({
  selector: 'ngx-fisioterapia',
  templateUrl: './fisioterapia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class FisioterapiaComponent implements OnInit {
  @Input() nombre: string;
  idHistoria: number | null;
  fisioterapia: ConsultaFisioterapia | null;
  evolucion: Evolucion[] = [];
  paciente: string;
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
  constructor(private fb: FormBuilder, private toastr: ToastrService, private saludService: SaludService, private estudianteService: EstudiantesService) { }
  ngOnInit() {
    this.cargarInformacion();
    this.estudianteService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
    });
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
        this.evolucion.push({ ...evolucion });
        let evolucion2: any = this.evolucion[0].evolucion;
        for (let i = 0; i < evolucion2.length; i++) {
          this.evolucionFisioArr.push(new FormControl(evolucion2[i], Validators.required));
        }
      }
      );
    });
  }

  guardarHistoriaFisioterapia() {
    let evolucionCorregida = JSON.stringify(this.evolucionFisioArr.value);
    let evolucion = evolucionCorregida.slice(1, evolucionCorregida.length - 1);
    let evolucion2 = evolucion.replace(/]/g, "").replace(/\[/g, "");
    // console.log('{"evolucion":[' + evolucion2 + ']}');

    if (!this.fisioterapia.HojaHistoria.Id) {
      const historiaFisio: any = {
        HojaHistoria: null,
        Historiaclinica: null,
        MotivoConsulta: this.fisioterapiaForm.get('motivoConsultaFisio').value,
        Valoracion: this.fisioterapiaForm.get('valoracion').value,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        PlanManejo: this.fisioterapiaForm.get('planDeManejoFisio').value,
        Observaciones: this.fisioterapiaForm.get('observacionesFisioterapia').value,
      };
      // console.log(historiaFisio);
      this.saludService.postFisioterapia(historiaFisio).subscribe(data => {
        console.log(data);
        this.toastr.success(`Ha registrado con éxito la historia clínica de fisioterapia para: ${this.paciente}`, '¡Guardado!');
      }, error => {
        this.toastr.error(error, '¡ERROR!');
      }
      );
    } if (this.fisioterapia.HojaHistoria.Id) {
      const historiaFisio: any = {
        HojaHistoria: this.fisioterapia.HojaHistoria,
        HistoriaClinica: this.fisioterapia.HistoriaClinica,
        MotivoConsulta: this.fisioterapiaForm.get('motivoConsultaFisio').value,
        Valoracion: this.fisioterapiaForm.get('valoracion').value,
        PlanManejo: this.fisioterapiaForm.get('planDeManejoFisio').value,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        Observaciones: this.fisioterapiaForm.get('observacionesFisioterapia').value,
      };
      console.log(historiaFisio);
      this.saludService.putFisioterapia(this.fisioterapia.HojaHistoria.Id, historiaFisio).subscribe(data => {
        // console.log(data);

        this.toastr.success(`Ha registrado con éxito la historia clínica de fisioterapia para: ${this.paciente}`, '¡Guardado!');
      }, error => {
        this.toastr.error(error, '¡ERROR!');
      }
      );
    }

  }
}
