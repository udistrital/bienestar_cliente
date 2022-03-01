import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';

@Component({
  selector: 'ngx-crear-cita',
  templateUrl: './crear-cita.component.html',
  styleUrls: ['./crear-cita.component.scss']
})
export class CrearCitaComponent implements OnInit {
  facultades: any[] = ["Facultad de Ingeniería", "Sede Bosa", "Facultad del Medio Ambiente y Recursos Naturales (Vivero)",
    "Facultad Tecnológica", "Facultad de Ciencias y Educación (Macarena)", "Facultad de Artes - ASAB"];
  empleados: any[] = [];
  tipocitas: any[] = [{ id: 766, nombre: "Medicina" }, { id: 765, nombre: "Enfermería" }, { id: 767, nombre: "Psicología" }, { id: 768, nombre: "Odontología" }, { id: 769, nombre: "Fisioterapia" }];
  crearCita: FormGroup;
  nombre = '';
  submit = false;
  loading = false;
  terceroId: any;
  solicitudId: any;
  titulo = 'Agregar Cita';

  constructor(private fb: FormBuilder, private estudianteService: EstudiantesService,
    private router: Router,
    private aRoute: ActivatedRoute, private saludService: SaludService, private toastr: ToastrService) {
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
        // console.log(data);
        let solicitud = JSON.parse(data.Referencia);
        this.crearCita.controls['codigo'].setValue(solicitud.documento);
        this.crearCita.controls['nombre'].setValue(solicitud.Nombrecompleto);
        this.crearCita.controls['facultad'].setValue(solicitud.facultad);
        this.crearCita.controls['tipocita'].setValue(solicitud.servicio);
      });
  }

  consultarEspecialistas(dato: any) {
    //console.log(dato);
    this.estudianteService.getEspecialistas(dato).subscribe((data: any) => {
      //console.log(data);
      this.empleados = data;
    });
  }

  agregarCita() {
    const cita: any = {
      IdCita: 0,
      IdProfesional: this.crearCita.controls.especialista.value,
      IdPaciente: Number(this.terceroId),
      Fecha: this.crearCita.controls.fecha.value,
      Hora: this.crearCita.controls.hora.value,
      IdSolicitud: Number(this.solicitudId),
      TipoServicio: this.crearCita.controls.tipocita.value,
      Sede: this.crearCita.controls.facultad.value,
    }
    this.saludService.postCita(cita).subscribe((data: any) => {
      this.estudianteService.getSolicitudCompleta(Number(this.solicitudId)).subscribe((res: any) => {
        //console.log(res[0]);
        const solicitud = {
          Id: res[0].Id,
          EstadoTipoSolicitudId: {
            Id: 46
          },
          Referencia: res[0].Referencia,
          Resultado: res[0].Resultado,
          FechaRadicacion: res[0].FechaRadicacion,
          FechaCreacion: res[0].FechaCreacion,
          FechaModificacion: res[0].FechaModificacion,
          SolicitudFinalizada: res[0].SolicitudFinalizada,
          Activo: res[0].Activo,
          SolicitudPadreId: res[0].SolicitudPadreId
        }
        this.estudianteService.actualizarEstadoSolicitud(this.solicitudId, solicitud).subscribe((resp: any) => {
          this.toastr.success(`Ha registrado con éxito la cita médica`, '¡Guardado!');
          setTimeout(() => {
            this.router.navigate(['pages/citas/solicitudes']);;
          },
            500);
        });
        //console.log(data);
      });
    });
  }

}
