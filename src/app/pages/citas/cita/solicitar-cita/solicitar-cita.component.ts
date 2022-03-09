import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesConstanst } from '../../../../shared/constants/roles.constants';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { ImplicitAutenticationService } from '../../../../@core/utils/implicit_autentication.service';
import { DateCustomPipePipe } from '../../../../shared/pipes/date-custom-pipe.pipe';
import { ReferenciaSolicitudCita } from "../../../../@core/data/models/solicitud/referencia-solicitud-cita";
import { ToastrService } from 'ngx-toastr';
import { ListService } from '../../../../@core/store/list.service';

@Component({
  selector: 'ngx-solicitar-cita',
  templateUrl: './solicitar-cita.component.html',
  styleUrls: ['./solicitar-cita.component.scss']
})
export class SolicitarCitaComponent implements OnInit {
  date = new Date();
  dateToday = this.date.setHours(this.date.getHours() + 1);
  servicios: any[] = [{ id: 766, nombre: "Medicina" }, { id: 765, nombre: "Enfermería" }, { id: 767, nombre: "Psicología" }, { id: 768, nombre: "Odontología" }, { id: 769, nombre: "Fisioterapia" }];
  facultades: any[] = ["Facultad de Ingeniería", "Sede Bosa", "Facultad del Medio Ambiente y Recursos Naturales (Vivero)",
    "Facultad Tecnológica", "Facultad de Ciencias y Educación (Macarena)", "Facultad de Artes - ASAB"];
  plataformas: any[] = ["Teléfono", "Meet", "Zoom", "Presencial"];
  referencia: ReferenciaSolicitudCita = new ReferenciaSolicitudCita();
  solicitarCita: FormGroup;
  hideForm = true;
  tipoId: any;
  rolesActivos: any = {};
  estudiante: any;
  email: any;
  ROLES_CONSTANTS = RolesConstanst;
  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private est: EstudiantesService,
    private dateCustomPipe: DateCustomPipePipe,
    private autenticacion: ImplicitAutenticationService,
    private toastr: ToastrService, private listService: ListService) {
    this.solicitarCita = this.fb.group({
      telefono: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{7,10}$'),
      ]),],
      servicio: ['', Validators.required],
      facultad: ['', Validators.required],
      plataforma: ['', Validators.required],
      especialista: ['', Validators.required],
      observacion: ['', Validators.required],
      proyecto: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.obtenerDataIngreso();
    this.obtenerInfoUsuario();
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

  obtenerDataIngreso() {
    if (this.route.snapshot.data['roles']) {
      for (const rol of this.route.snapshot.data['roles']) {
        this.rolesActivos[rol] = true;
      }

    }
  }

  obtenerInfoUsuario() {
    this.listService.getInfoEstudiante().then((resp) => {
      console.log(resp);
      this.email = resp.email;
      this.est.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        //console.log(res);
        this.estudiante = res[0].TerceroId;
        this.estudiante.documento = res[0].Numero;
        this.estudiante.documento_compuesto = res[0].TipoDocumentoId.CodigoAbreviacion + " " + this.estudiante.documento;
      });
    });
  }
  guardarDatosFormulario() {
    this.referencia.Nombrecompleto = this.estudiante.NombreCompleto;
    this.referencia.estamento = '';
    this.referencia.tercero = this.estudiante.Id;
    this.referencia.codigo = null;
    this.est.getCodigoTercero(this.estudiante.Id, 14).subscribe((data) => {
      if (data) {
        this.referencia.codigo = data[0].Numero;
      }
    });
    this.referencia.documento = this.estudiante.documento;
    this.referencia.facultad = this.solicitarCita.value.facultad;
    this.referencia.proyecto = this.solicitarCita.value.proyecto;
    this.referencia.edad = this.calcularEdad(this.estudiante.FechaNacimiento).toString();
    this.referencia.telefono = null;
    this.est.getInfoComplementaria(this.estudiante.Id, 51).subscribe((data) => {
      if (data) {
        this.referencia.telefono = data[0].Dato;
      }
    });
    this.referencia.correo = this.email;
    this.referencia.servicio = this.solicitarCita.value.servicio;
    this.referencia.telefonoAdicional = this.solicitarCita.value.telefono;
    this.referencia.profesional = this.solicitarCita.value.especialista;
    this.referencia.plataforma = this.solicitarCita.value.plataforma;
    this.referencia.observaciones = this.solicitarCita.value.observacion;
  }
  guardarSolicitud() {
    this.guardarDatosFormulario();
    const solicitud: any = {};
    solicitud.Id = null;
    solicitud.EstadoTipoSolicitudId =
    {
      Id: 31
    }
    solicitud.Referencia = JSON.stringify(this.referencia);
    solicitud.FechaCreacion = this.dateCustomPipe.transform(new Date());
    solicitud.FechaModificacion = this.dateCustomPipe.transform(new Date());
    solicitud.FechaRadicacion = this.dateCustomPipe.transform(new Date());
    solicitud.Resultado = '';
    solicitud.SolicitudFinalizada = false;
    solicitud.SolicitudPadreId = null;
    solicitud.Activo = true;
    this.est.grabarSolicitud(solicitud).subscribe((res) => {
      const sol = res.Data;
      this.grabarSolicitante(sol);
    });
  }
  grabarSolicitante(solicitud: any) {
    console.log(solicitud.Id);
    const solicitante: any = {};
    solicitante.Id = null;
    solicitante.TerceroId = this.estudiante.Id;
    solicitante.SolicitudId =
    {
      Id: solicitud.Id
    }
    solicitante.FechaCreacion = this.dateCustomPipe.transform(new Date());
    solicitante.FechaModificacion = this.dateCustomPipe.transform(new Date());
    solicitante.Activo = true;
    this.est.grabarSolicitante(solicitante).subscribe((res) => {
      this.grabarEvolucionSolicitud(solicitud);
    });
  }
  grabarEvolucionSolicitud(solicitud: any) {
    const evolucionSolicitud: any = {};
    evolucionSolicitud.Id = null;
    evolucionSolicitud.TerceroId = this.estudiante.Id;
    evolucionSolicitud.SolicitudId = {
      Id: solicitud.Id
    }
    evolucionSolicitud.EstadoTipoSolicitudIdAnterior = null;
    evolucionSolicitud.EstadoTipoSolicitudId = {
      Id: solicitud.EstadoTipoSolicitudId.Id
    }
    evolucionSolicitud.FechaLimite = this.dateCustomPipe.transform(new Date());
    evolucionSolicitud.FechaCreacion = this.dateCustomPipe.transform(new Date());
    evolucionSolicitud.FechaModificacion = this.dateCustomPipe.transform(new Date());
    evolucionSolicitud.Activo = true;
    this.est.grabarSolicitudEvolucion(evolucionSolicitud).subscribe((res) => {
      this.toastr.success("Solicitud hecha satisfactoriamente");
      setTimeout(() => {
        window.location.reload();
      },
        500);
    });
  }
}
