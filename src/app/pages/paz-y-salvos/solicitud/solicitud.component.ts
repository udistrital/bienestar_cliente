import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ReferenciaSolicitudPazySalvo } from '../../../@core/data/models/solicitud/referencia-solicitud-pazysalvos';
import { ListService } from '../../../@core/store/list.service';
import { DateCustomPipePipe } from '../../../shared/pipes/date-custom-pipe.pipe';
import { EstudiantesService } from '../../../shared/services/estudiantes.service';


@Component({
  selector: 'ngx-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {
  estudiante: any=[];
  rolesActivos: any = {};
  email: string= "";
  solicitarpyz: FormGroup;
  referencia: ReferenciaSolicitudPazySalvo = new ReferenciaSolicitudPazySalvo();

  MotivoAdministrativo: string[] = ["Retiro", "Aplazamiento", "Cancelacion", "Programa CYE", "Grado"];
  MotivoPersonal: string[] = ["Socioeconomico", "Psicológico", "Salud", "Grado", "Otras"];
  CausaPrincipal: string[] = ["Laboral", "Familiar", "Personal", "Cambio de Proyecto Académico", "Cambio de institucion", "Cambio de Ciudad/País","Cuestión Económica","Grado","Otras"];



  constructor( 
    private fb: FormBuilder,
    private est: EstudiantesService,
    private route: ActivatedRoute,
    private listService: ListService,
    private dateCustomPipe: DateCustomPipePipe,) { 
    this.solicitarpyz = this.fb.group({
      telefono: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{7,10}$'),
      ]),],
      MotivoAdministrativo: ['', Validators.required],
      MotivoPersonal: ['', Validators.required],
      CausaPrincipal: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.obtenerDataIngreso();
    this.obtenerInfoUsuario();
  }


//----------------------------Sacar datos del estudiante del cliente-------------------
//esto se podria pasar a un helper  que maneje los datos del estudiante y llamarlos aqui
  obtenerDataIngreso() {
    if (this.route.snapshot.data['roles']) {
      for (const rol of this.route.snapshot.data['roles']) {
        this.rolesActivos[rol] = true;
      }

    }
  }

  obtenerInfoUsuario() {
    this.listService.getInfoEstudiante().then((resp) => {
      this.email = resp.email;
      this.est.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        this.estudiante = res[0].TerceroId;
        this.estudiante.documento = res[0].Numero;
        this.estudiante.documento_compuesto = res[0].TipoDocumentoId.CodigoAbreviacion + " " + this.estudiante.documento;
        this.est.getVinculacion(this.estudiante.Id).subscribe((res) => {
          this.est.getDependencia(res[0].DependenciaId).subscribe((res) => {
            this.estudiante.proyecto = res['Nombre'];
          });
        });
      });
    });
 
  }
///------------------------------MANEJO DEL FORMULARIO---------------------------------------------



guardarDatosFormulario() {

  this.referencia.Nombrecompleto = this.estudiante.NombreCompleto;
  this.referencia.estamento = '';
  this.referencia.tercero = this.estudiante.Id;
  this.referencia.codigo = null;
  this.est.getCodigoTercero(this.estudiante.Id, 14).subscribe((data) => { if (data) { this.referencia.codigo = data[0].Numero; } });
  this.referencia.documento = this.estudiante.documento;
  this.referencia.proyecto = this.estudiante.proyecto;
  this.referencia.telefono = null;
  this.est.getInfoComplementaria(this.estudiante.Id, 51).subscribe((data) => {if (data) { this.referencia.telefono = data[0].Dato; }});
  this.referencia.correo = this.email;
  this.referencia.MotivoAdministrativo = this.solicitarpyz.value.MotivoAdministrativo;
  this.referencia.telefonoAdicional = this.solicitarpyz.value.telefono;
  this.referencia.MotivoPersonal = this.solicitarpyz.value.MotivoPersonal;
  this.referencia.CausaPrincipal = this.solicitarpyz.value.CausaPrincipal;
}


//----------------------Solicitud-------------------------


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

  console.table("solicitante",solicitante);
  this.est.grabarSolicitante(solicitante).subscribe((res) => {
    //mostrar datos solicitante
  });
}

  guardarSolicitud() {
    this.guardarDatosFormulario();
    console.log(this.referencia);
    
    const solicitud: any = {};
    solicitud.Id = null;
    solicitud.EstadoTipoSolicitudId ={Id: environment.IDS.IDTIPOSOLICITUDPAZYSALVOS }
    solicitud.Referencia = JSON.stringify(this.referencia);
    solicitud.FechaCreacion = this.dateCustomPipe.transform(new Date());
    solicitud.FechaModificacion = this.dateCustomPipe.transform(new Date());
    solicitud.FechaRadicacion = this.dateCustomPipe.transform(new Date());
    solicitud.Resultado = '';
    solicitud.SolicitudFinalizada = false;
    solicitud.SolicitudPadreId = null;
    solicitud.Activo = true;
    console.table("solicitud",solicitud);
    
    this.est.grabarSolicitud(solicitud).subscribe((res) => {
      const sol = res.Data;
      this.grabarSolicitante(sol);
    });
  }

}
