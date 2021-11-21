import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';

@Component({
  selector: 'ngx-crear-cita',
  templateUrl: './crear-cita.component.html',
  styleUrls: ['./crear-cita.component.scss']
})
export class CrearCitaComponent implements OnInit {
  facultades: any[] = ["Facultad de Ingeniería", "Sede Bosa","Facultad del Medio Ambiente y Recursos Naturales (Vivero)",
  "Facultad Tecnológica", "Facultad de Ciencias y Educación (Macarena)", "Facultad de Artes - ASAB"];
  empleados: any[] = [];
  tipocitas: any[] = ["Medicina", "Enfermería", "Psicología", "Odontología", "Fisioterapia"];
  crearCita: FormGroup;
  nombre = '';
  submit = false;
  loading = false;
  terceroId: any;
  solicitudId: any;
  titulo = 'Agregar Cita';

  constructor(private fb: FormBuilder, private estudianteService: EstudiantesService,
    private router: Router,
    private aRoute: ActivatedRoute) {
    this.crearCita = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      facultad: ['', Validators.required],
      tipocita: ['', Validators.required],
      especialista: ['', Validators.required],
    })
    this.aRoute.params.subscribe(params => {
      this.terceroId = params['tercero'];
      this.solicitudId = params['solicitud'];
    });
  }

  ngOnInit() {
    this.buscarPaciente();
  }

  buscarPaciente() {
    this.estudianteService.getSolicitud(this.solicitudId)
      .subscribe((data: any) => {
        console.log(data);
        let solicitud = JSON.parse(data.Referencia);
        this.crearCita.controls['codigo'].setValue(solicitud.documento);
        this.crearCita.controls['nombre'].setValue(solicitud.Nombrecompleto);
        this.crearCita.controls['facultad'].setValue(solicitud.facultad);
        this.crearCita.controls['tipocita'].setValue(solicitud.servicio);
      })


  }

  agregarCita() {
    const cita: any = {
      nombre: this.crearCita.value.nombre,
      fecha: this.crearCita.value.fecha,
      hora: this.crearCita.value.hora,
      facultad: this.crearCita.value.facultad,
      tipocita: this.crearCita.value.tipocita,
      especialista: this.crearCita.value.especialista,
      fechaCreacion: new Date()
    }
    //   this.loading = true;
    //   this._citaService.agregarCita(cita).then(() => {
    //     this.toastr.success('La cita fue creada con éxito', 'Cita creada');
    //     this.loading = false;
    //     this.router.navigate(['/listarCitas']);
    //   }).catch(error => {
    //     this.toastr.error('No sé qué pasó xd', 'Error');
    //     this.loading = false;
    //   })
    // }
  }

}
