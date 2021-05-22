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
  usuarios: any[] = [];
  empleados: any[] = [];
  tipocitas: any[] = [];
  crearCita: FormGroup;
  nombre='';
  submit = false;
  loading = false;
  id: string;
  titulo = 'Agregar Cita';

  constructor(private fb: FormBuilder, private estudianteService: EstudiantesService,
    private router: Router,
    private aRoute: ActivatedRoute) {
    this.crearCita = this.fb.group({
      nombre:['',Validators.required],
      codigo: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      facultad: ['', Validators.required],
      tipocita: ['', Validators.required],
      especialista: ['', Validators.required],
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    //this.getUsuarios();
  }

  buscarPaciente() {
    this.estudianteService.getEstudiante(this.crearCita.value.codigo)
      .subscribe((data: any) => {
        console.log(data);
        var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
        this.nombre = paciente.nombre;

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
