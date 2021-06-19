import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesConstanst } from '../../../../shared/constants/roles.constants';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { ImplicitAutenticationService } from '../../../../@core/utils/implicit_autentication.service';
import { DateCustomPipePipe } from '../../../../shared/pipes/date-custom-pipe.pipe';
import { ReferenciaSolicitudCita } from "../../../../@core/data/models/solicitud/referencia-solicitud-cita";

@Component({
  selector: 'ngx-solicitar-cita',
  templateUrl: './solicitar-cita.component.html',
  styleUrls: ['./solicitar-cita.component.scss']
})
export class SolicitarCitaComponent implements OnInit {
  date = new Date();
  dateToday = this.date.setHours(this.date.getHours() + 1);
  servicios: any[] = ["Medicina", "Enfermería", "Psicología", "Odontología", "Fisioterapia"];
  facultades: any[] = [];
  plataformas: any[] = ["Teléfono", "Meet", "Zoom", "Presencial"];
  referencia: ReferenciaSolicitudCita = new ReferenciaSolicitudCita();
  solicitarCita: FormGroup;
  hideForm = true;
  tipoId: any;
  rolesActivos: any = {};
  estudiante: any;
  ROLES_CONSTANTS = RolesConstanst;
  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private est: EstudiantesService,
    private dateCustomPipe: DateCustomPipePipe,
    private autenticacion: ImplicitAutenticationService) {
    this.solicitarCita = this.fb.group({
      telefono: [''],
      servicio: ['', Validators.required],
      facultad: ['', Validators.required],
      plataforma: ['', Validators.required],
      especialista: ['', Validators.required],
      observacion: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.obtenerDataIngreso();
    this.obtenerInfoUsuario();
    this.obtenerFacultades();
    console.log(this.route.snapshot.data['roles']);
  }
  calcularEdad(fechaNacimiento): number {
    if (fechaNacimiento) {
      const actual = new Date();
      const fechaNacimientoCal = new Date(fechaNacimiento);
      let edad = actual.getFullYear() - fechaNacimientoCal.getFullYear();
      const mes = actual.getMonth() - fechaNacimientoCal.getMonth();
      if (mes < 0 || (mes === 0 && actual.getDate() < fechaNacimientoCal.getDate())) {
        edad--;
      }
      return edad;
    } else {
      return null;
    }
  }
  consentimiento(dato: any) {
    if (dato == "SI") {
      this.hideForm = false;
    } else {
      this.hideForm = true;
    }
  }
  obtenerFacultades() {
    this.est.getFacultades().subscribe((data: any) => {
      for (let i in data) {
        this.facultades.push(data[i].DependenciaId.Nombre);
      }
    });
  }

  obtenerDataIngreso() {
    if (this.route.snapshot.data['roles']) {
      for (const rol of this.route.snapshot.data['roles']) {
        this.rolesActivos[rol] = true;
      }

    }
  }

  obtenerInfoUsuario() {
    this.est.getEstudiantePorUser(this.autenticacion.getPayload().sub).subscribe((res) => {
      this.estudiante = res[0].TerceroId;
      this.estudiante.documento = this.autenticacion.getPayload().documento;
      this.estudiante.documento_compuesto = this.autenticacion.getPayload().documento_compuesto;
    });
  }
  guardarDatosFormulario() {
    this.referencia.Nombrecompleto = this.estudiante.NombreCompleto;
    this.referencia.estamento = '';
    this.est.getCodigoTercero(this.estudiante.Id, 14).subscribe((data) => {
      if (data) {
        this.referencia.codigo = data[0].Numero;
      } else {
        this.referencia.codigo = '';
      }
    });
    this.referencia.documento = this.estudiante.documento;
    this.referencia.facultad = this.solicitarCita.value.facultad;
    this.referencia.proyecto = '';
    this.referencia.edad = this.calcularEdad(this.estudiante.FechaNacimiento).toString();
    this.est.getInfoComplementaria(this.estudiante.Id, 51).subscribe((data) => {
      if (data) {
        this.referencia.telefono = data[0].Dato;
      } else {
        this.referencia.telefono = '';
      }
    });
    this.est.getInfoComplementaria(this.estudiante.Id, 53).subscribe((data) => {
      if (data) {
        this.referencia.correo = data[0].Dato;
      } else {
        this.referencia.correo = '';
      }
    });
    this.referencia.telefonoAdicional = this.solicitarCita.value.telefono;
    this.referencia.profesional = this.solicitarCita.value.especialista;
    this.referencia.plataforma = this.solicitarCita.value.plataforma;
    this.referencia.observaciones = this.solicitarCita.value.observacion;
    console.log(this.referencia);
  }
  guardarSolicitud() {
    this.guardarDatosFormulario();
    const solicitud: any = {};
    solicitud.Id = null;
    solicitud.EstadoTipoSolicitudId = '31';
    solicitud.Referencia = JSON.stringify(this.referencia);;
    solicitud.FechaCreacion = this.dateCustomPipe.transform(new Date());
    solicitud.FechaModificacion = this.dateCustomPipe.transform(new Date());
    solicitud.FechaRadicacion = this.dateCustomPipe.transform(new Date());
    solicitud.Resultado = '';
    solicitud.SolicitudFinalizada = false;
    solicitud.SolicitudPadreId = null;
    console.log(solicitud);
    this.est.grabarSolicitud(JSON.stringify(solicitud)).subscribe((solicitud) => {
    });
  }

}
