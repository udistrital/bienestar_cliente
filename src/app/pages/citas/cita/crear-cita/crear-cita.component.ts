import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ngx-crear-cita',
  templateUrl: './crear-cita.component.html',
  styleUrls: ['./crear-cita.component.scss']
})
export class CrearCitaComponent implements OnInit {
  facultades: any[] = ["Facultad de Ingeniería", "Sede Bosa", "Facultad del Medio Ambiente y Recursos Naturales (Vivero)",
    "Facultad Tecnológica", "Facultad de Ciencias y Educación (Macarena)", "Facultad de Artes - ASAB", "Teléfono", "Meet", "Zoom"];
  empleados: any[] = [];
  tipocitas: any[] = [{ id: environment.IDS.IDMEDICINA, nombre: "Medicina" }, { id: environment.IDS.IDENFERMERIA, nombre: "Enfermería" }, { id: environment.IDS.IDPSICOLOGIA, nombre: "Psicología" }, { id: environment.IDS.IDODONTOLOGIA, nombre: "Odontología" }, { id: environment.IDS.IDFISIOTERAPIA, nombre: "Fisioterapia" }];
  crearCita: FormGroup;
  nombre = '';
  submit = false;
  loading = false;
  terceroId: any;
  disableDate = true;
  disableHour = true;
  solicitudId: any;
  titulo = 'Agregar Cita';
  fechaActual = new Date();
  fechasEstudiante: any[] = [];
  fechasEspecialista: any[] = [];
  fechaCita: string;
  fechaCompletaCita: string;
  horarioInicial: string;
  horarioFinal: string;

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
      this.saludService.getCita(this.terceroId).subscribe((data) => {
        if (JSON.stringify(data['Data'][0]) != '{}') {
          for (let i in data['Data']) {
            let separadorFecha = data['Data'][i].Fecha.split("T");
            let separadorHora = data['Data'][i].Hora.split(" ");
            separadorHora[1] = separadorHora[1].slice(0, -3);
            let fechaCompleta = separadorFecha[0] + " " + separadorHora[1];
            this.fechasEstudiante.push(fechaCompleta);
          }
          //console.log(this.fechasEstudiante);
        }
      });
    });
  }

  ngOnInit() {
    this.buscarPaciente();
    this.estudianteService.getParametro(environment.IDS.IDHORARIOINICIO).subscribe((res) => {
      this.horarioInicial = res['Data'].Nombre;
      //console.log(this.horarioInicial);
    });
    this.estudianteService.getParametro(environment.IDS.IDHORARIOFINAL).subscribe((res) => {
      this.horarioFinal = res['Data'].Nombre;
      //console.log(this.horarioFinal);
    });
    this.fechaActual.setDate(this.fechaActual.getDate() + 1);
  }

  consultarFecha(data: any) {
    this.crearCita.controls['hora'].setValue("");
    this.fechaCompletaCita = "";
    if (data == "") {
      this.disableHour = true;
    } else {
      let mes = "";
      let dia = "";
      if (data.getMonth() + 1 < 10) {
        mes = "0" + (data.getMonth() + 1).toString();
      } else {
        mes = (data.getMonth() + 1).toString();
      }
      if (data.getDate() < 10) {
        dia = "0" + data.getDate().toString();
      } else {
        dia = data.getDate().toString();
      }
      this.fechaCita = data.getFullYear() + "-" + mes + "-" + dia;
      //console.log(this.fechaCita);
      this.disableHour = false;

    }
  }

  consultarHora(data: any) {
    //console.log(data);
    if (data != "") {
      this.fechaCompletaCita = this.fechaCita + " " + data;
      for (let i in this.fechasEstudiante) {
        if (this.fechaCompletaCita == this.fechasEstudiante[i]) {
          this.crearCita.controls['hora'].setValue("");
          this.toastr.error("El estudiante ya tiene una cita médica a esta hora");
          break;
        }
      }
      for (let i in this.fechasEspecialista) {
        if (this.fechaCompletaCita == this.fechasEspecialista[i]) {
          this.crearCita.controls['hora'].setValue("");
          this.toastr.error("El especialista ya tiene una cita médica a esta hora");
          break;
        }
      }
      // console.log(this.fechaCompletaCita);
      this.fechaCompletaCita = "";
    }
  }

  buscarPaciente() {
    this.estudianteService.getSolicitud(this.solicitudId)
      .subscribe((data: any) => {
        //console.log(data);
        if (data['EstadoTipoSolicitudId']['Id'] == environment.IDS.IDESTADOSOLICITUDAGENDADA) {
          this.crearCita.disable();
          this.toastr.error("Solicitud ya fue manejada. Por favor intente con otra");
        } else {
          let solicitud = JSON.parse(data.Referencia);
          this.crearCita.controls['codigo'].setValue(solicitud.documento);
          this.crearCita.controls['nombre'].setValue(solicitud.Nombrecompleto);
          this.crearCita.controls['facultad'].setValue(solicitud.facultad);
          this.crearCita.controls['tipocita'].setValue(solicitud.servicio);
          this.consultarEspecialistas(solicitud.servicio);
        }
      });
  }

  consultarEspecialistas(dato: any) {
    //console.log(dato);
    this.estudianteService.getEspecialistas(dato).subscribe((data: any) => {
      //console.log(data);
      this.empleados = data;
    });
  }
  consultarCitasEspecialistas(dato: any) {
    this.fechasEspecialista = [];
    //console.log(dato);
    this.crearCita.controls['fecha'].setValue("");
    if (dato == "") {
      this.disableDate = true;
    } else {
      this.disableDate = false;
      this.saludService.getCitaEspecialista(dato).subscribe((data) => {
        if (JSON.stringify(data['Data'][0]) != '{}') {
          for (let i in data['Data']) {
            let separadorFecha = data['Data'][i].Fecha.split("T");
            let separadorHora = data['Data'][i].Hora.split(" ");
            separadorHora[1] = separadorHora[1].slice(0, -3);
            let fechaCompleta = separadorFecha[0] + " " + separadorHora[1];
            this.fechasEspecialista.push(fechaCompleta);
          }
          // console.log(this.fechasEspecialista);
        }
      });
    }
  }

  agregarCita() {
    this.estudianteService.getSolicitudCompleta(Number(this.solicitudId)).subscribe((res: any) => {
      if (res[0].EstadoTipoSolicitudId.Id == environment.IDS.IDESTADOSOLICITUDAGENDADA) {
        this.crearCita.disable();
        this.toastr.error("Solicitud ya fue manejada. Por favor intente con otra");
      } else {
        let fecha = new Date(this.crearCita.controls.fecha.value);
        const cita: any = {
          IdCita: 0,
          IdProfesional: this.crearCita.controls.especialista.value,
          IdPaciente: Number(this.terceroId),
          Fecha: fecha,
          Hora: this.crearCita.controls.hora.value,
          IdSolicitud: Number(this.solicitudId),
          TipoServicio: this.crearCita.controls.tipocita.value,
          Sede: this.crearCita.controls.facultad.value,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        this.saludService.postCita(cita).subscribe((data: any) => {
          //console.log(data);

          //console.log(res[0]);
          const solicitud = {
            Id: res[0].Id,
            EstadoTipoSolicitudId: {
              Id: environment.IDS.IDESTADOSOLICITUDAGENDADA
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
            this.crearCita.disable();
            this.toastr.success(`Ha registrado con éxito la cita médica`, '¡Guardado!');
            setTimeout(() => {
              this.router.navigate(['pages/citas/solicitudes']);
            },
              1000);
          });

        });
      }
    });
  }

}
