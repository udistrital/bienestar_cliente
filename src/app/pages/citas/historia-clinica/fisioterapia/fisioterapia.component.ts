import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConsultaFisioterapia } from '../../../../shared/models/Salud/consultaFisioterapia.model';
import { Especialidad } from '../../../../shared/models/Salud/especialidad.model';
import { Evolucion } from '../../../../shared/models/Salud/evolucion.model';
import { HistoriaClinica } from '../../../../shared/models/Salud/historiaClinica.model';
import { HojaHistoria } from '../../../../shared/models/Salud/hojaHistoria.model';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';

@Component({
  selector: 'ngx-fisioterapia',
  templateUrl: './fisioterapia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class FisioterapiaComponent implements OnInit {
  firstOne: any;
  hideHistory: boolean = false;
  listaHojas: any = [];
  estado: string;
  especialidad: Especialidad;
  @Input() nombre: string;
  historiaNueva: HistoriaClinica;
  hojahistoria: HojaHistoria;
  idHistoria: number | null;
  terceroId: any;
  fisioterapia: ConsultaFisioterapia | null;
  evolucion: Evolucion[] = [];
  paciente: string;
  nuevaEvolucionFisio: FormControl = this.fb.control('');
  fisioterapiaForm: FormGroup = this.fb.group({
    motivoConsultaFisio: [null],
    valoracion: [null],
    planDeManejoFisio: [null],
    observacionesFisioterapia: [null],
    evolucionFisio: this.fb.array([]),
  })
  pruebaEspecialista = {
    nombre: 'NOMBRE1 APELLIDO1',
    especialidad: 'ESPECIALIDAD 1',
  }
  constructor(private fb: FormBuilder, private toastr: ToastrService, private saludService: SaludService, private personaService: EstudiantesService, private aRoute: ActivatedRoute) { }
  ngOnInit() {
    this.terceroId = this.aRoute.snapshot.paramMap.get('terceroId');
    this.personaService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
    });
    this.cargarInformacion();
  }
  get evolucionFisioArr() {
    return this.fisioterapiaForm.get('evolucionFisio') as FormArray;
  }
  agregarEvolucionFisio() {
    if (this.nuevaEvolucionFisio.invalid) {
      return
    }
    this.evolucionFisioArr.push(new FormControl(this.nuevaEvolucionFisio.value));
    this.nuevaEvolucionFisio.reset();
  }
  borrarEvolucionFisio(i: number) {
    this.evolucionFisioArr.removeAt(i);
  }
  buscarEspecialista() {
    // TODO
  }

  cargarInformacion() {

    this.saludService.getEspecialidad(2).subscribe((data: any) => {
      this.especialidad = data;
    });
    this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {
      this.idHistoria = data[0].Id;
      this.saludService.getHojaHistoria(parseInt(this.terceroId), 2).subscribe(data => {
        if (JSON.stringify(data[0]) === '{}') {
          this.estado = "nueva";
          this.hideHistory = true;
        } else {
          this.listaHojas = data;
          this.firstOne = data[0].Id;
          this.estado = "vieja";
          this.hideHistory = false;
          this.hojahistoria = data[0];
          this.fisioterapiaForm.controls.motivoConsultaFisio.setValue(this.hojahistoria.Motivo);
          this.fisioterapiaForm.controls.observacionesFisioterapia.setValue(this.hojahistoria.Observacion);
          this.evolucion = [];
          let evolucion = JSON.parse(this.hojahistoria.Evolucion) || [];
          this.evolucion.push({ ...evolucion });
          let evolucion2: any = this.evolucion[0].evolucion;
          for (let i = 0; i < evolucion2.length; i++) {
            this.evolucionFisioArr.push(new FormControl(evolucion2[i]));
          }
          this.saludService.getConsultaFisioterapia(this.hojahistoria.Id).subscribe(data => {
            // console.log(data);
            this.fisioterapia = data[0] || '';
            this.fisioterapiaForm.controls.valoracion.setValue(this.fisioterapia.Valoracion);
            this.fisioterapiaForm.controls.planDeManejoFisio.setValue(this.fisioterapia.PlanManejo);
          }
          );
        }
      });
    });
  }

  guardarHistoriaFisioterapia() {
    let evolucionCorregida = JSON.stringify(this.evolucionFisioArr.value);
    let evolucion = evolucionCorregida.slice(1, evolucionCorregida.length - 1);
    let evolucion2 = evolucion.replace(/]/g, "").replace(/\[/g, "");
    if (this.estado == "nueva") {
      let fechaActual = new (Date);
      fechaActual.setHours(fechaActual.getHours() - 5);
      const hojaHistoria: HojaHistoria = {
        Id: 0,
        HistoriaClinica: { Id: this.saludService.historia, Tercero: parseInt(this.terceroId) },
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        FechaConsulta: fechaActual,
        Especialidad: this.especialidad,
        Persona: this.saludService.IdPersona,
        Profesional: null,
        Motivo: this.fisioterapiaForm.get('motivoConsultaFisio').value,
        Observacion: this.fisioterapiaForm.get('observacionesFisioterapia').value,
      }
      this.saludService.postHojaHistoria(hojaHistoria).subscribe(data => {
        //console.log(data);
        this.hojahistoria = data;
        console.log('Hoja historia: ' + data);
        this.saludService.falloMedicina = false;
        const consultaFisio: ConsultaFisioterapia = {
          Id: 0,
          HojaHistoria: this.hojahistoria,
          HistoriaClinica: { Id: this.saludService.historia, Tercero: parseInt(this.terceroId) },
          Valoracion: this.fisioterapiaForm.get('valoracion').value,
          PlanManejo: this.fisioterapiaForm.get('planDeManejoFisio').value,
        };
        // console.log(historiaFisio);
        this.saludService.postFisioterapia(consultaFisio).subscribe(data => {
          console.log('Fisioterapia: ' + data);
          this.toastr.success(`Ha registrado con éxito la historia clínica de fisioterapia para: ${this.paciente}`, '¡Guardado!');
        }, error => {
          this.toastr.error(error, '¡ERROR!');
        }
        );
      });
    }
    else if (this.estado == "vieja") {
      const hojaHistoria: HojaHistoria = {
        Id: this.hojahistoria.Id,
        HistoriaClinica: this.hojahistoria.HistoriaClinica,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        FechaConsulta: new Date(this.hojahistoria.FechaConsulta),
        Especialidad: this.hojahistoria.Especialidad,
        Persona: this.saludService.IdPersona,
        Profesional: null,
        Motivo: this.fisioterapiaForm.get('motivoConsultaFisio').value,
        Observacion: this.fisioterapiaForm.get('observacionesFisioterapia').value,
      }
      // console.log(hojaHistoria);
      this.saludService.putHojaHistoria(this.hojahistoria.Id, hojaHistoria).subscribe(data => {
        console.log('Hoja historia: ' + data);
        this.saludService.falloMedicina = false;
      }, error => {
        this.saludService.falloMedicina = true;
      });
      const consultaFisio: ConsultaFisioterapia = {
        Id: this.fisioterapia.Id,
        HojaHistoria: this.hojahistoria,
        HistoriaClinica: { Id: this.saludService.historia, Tercero: parseInt(this.terceroId) },
        Valoracion: this.fisioterapiaForm.get('valoracion').value,
        PlanManejo: this.fisioterapiaForm.get('planDeManejoFisio').value,
      };
      // console.log(historiaFisio);
      this.saludService.putFisioterapia(this.fisioterapia.Id, consultaFisio).subscribe(data => {
        //console.log(data);
        this.toastr.success(`Ha registrado con éxito la historia clínica de fisioterapia para: ${this.paciente}`, '¡Guardado!');
        setTimeout(() => {
          window.location.reload();
        },
          1500);
        // window.location.reload();
      }, error => {
        this.toastr.error(error, '¡ERROR!');
      }
      );
    }

  }
  cambiarHoja(data: any) {
    this.evolucionFisioArr.clear();
    this.getHojaEspecifica(data);
  }
  getHojaEspecifica(Id: any) {
    this.saludService.getHojaHistoriaEspecifica(Id).subscribe(data => {//Reemplazar por terceroId
      //console.log(data);
      this.hojahistoria = data;
      this.fisioterapiaForm.controls.motivoConsultaFisio.setValue(this.hojahistoria.Motivo);
      this.fisioterapiaForm.controls.observacionesFisioterapia.setValue(this.hojahistoria.Observacion);
      this.evolucion = [];
      let evolucion = JSON.parse(this.hojahistoria.Evolucion) || [];
      this.evolucion.push({ ...evolucion });
      let evolucion2: any = this.evolucion[0].evolucion;
      for (let i = 0; i < evolucion2.length; i++) {
        this.evolucionFisioArr.push(new FormControl(evolucion2[i]));
      }
      this.saludService.getConsultaFisioterapia(this.hojahistoria.Id).subscribe(data => {
        // console.log(data);
        this.fisioterapia = data[0] || '';
        this.fisioterapiaForm.controls.valoracion.setValue(this.fisioterapia.Valoracion);
        this.fisioterapiaForm.controls.planDeManejoFisio.setValue(this.fisioterapia.PlanManejo);
      }
      );
    }
    );
  }
  crearNuevaHoja() {
    this.fisioterapiaForm.reset();
    this.estado = "nueva";
    this.evolucionFisioArr.clear();
    this.hideHistory = true;
  }
}
