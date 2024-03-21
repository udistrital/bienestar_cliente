import { Component, OnInit,  } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActividadCultural } from '../../../../@core/data/models/cultura/actividad_cultural';
import { DialogoEliminacionGruposCulturalesComponent } from './dialogo-eliminacion-grupos-culturales/dialogo-eliminacion-grupos-culturales.component';
import { MatDialog } from '@angular/material';
import { formatDate } from '@angular/common';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { GrupoCultural } from '../../../../@core/data/models/cultura/grupo_cultural';
import { ActividadGrupoCultural } from '../../../../@core/data/models/cultura/actividad_grupo_cultural';
import { UtilService } from '../../../../shared/services/utilService';

@Component({
  selector: 'ngx-form_act_cult',
  templateUrl: './form_act_cult.component.html',
  styleUrls: ['./form_act_cult.component.scss']
})
export class FormActCultComponent implements OnInit {

  //Id de la actividad cultural a consultar para editar
  id: number;

  //Fecha actual
  fechaActual = new Date();

  //Variables correspondientes a la fecha de inicio de la actividad en formato yyyy-MM-ddThh:mm:ss-05:00
  fechaInicio: string;
  fechaCompletaInicio: string;

  //Variables correspondientes a la fecha de finalizacion de la actividad en formato yyyy-MM-ddThh:mm:ss-05:00
  fechaFin: string;
  fechaCompletaFin: string;

  //Variables correspondientes a los parametros de la tabla actividad_cultural de la base de datos
  necesitaInscripcion: number = 0;
  mayorInfo: number = 0;

  //Variables booleanas para habilitar y deshabilitar campos
  ifDivCrearEditar: boolean = true;
  ifCrear: boolean = true;
  ifEditarRegistradoPlaneacion: boolean = true;
  ifEditarEnEjecucionFinalizado: boolean = true;
  ifEditarCerrado: boolean = true;
  ifEditarSuspendido: boolean = true;
  ifEditarCancelado: boolean = true;
  disableEnlaceInscripcion: boolean = false;
  disableEnlaceMayorInfo: boolean = false;
  disableCamposCreacion: boolean = true;

  //Formulario utilizado para recibir informacion de la pagina html
  crearActividad: FormGroup;

  //Variables correspondientes a la actividad cultural y grupos participantes para realizar creacion o edicion
  actividadCultural: ActividadCultural = new ActividadCultural();
  actividadGrupoCultural: ActividadGrupoCultural = new ActividadGrupoCultural();

  //Arreglo con los tipos de actividades implementadas
  tipoActividad: any[] = ["Evento", "Ensayo", "Taller", "Conversatorio"];
  idTipoActividad: number;

  //Variable para almacenar el usuario activo
  usuario: string;

  //Arreglos correcpondientes a los grupos participantes de una actividad cultural para creacion o eliminacion
  gruposCulturalesActivos: any[] = [];
  idGruposCulturalesParticipantes: any[] = [];

  constructor(private fb: FormBuilder, private router: Router,
    private toastr: ToastrService, private route: ActivatedRoute,
    private dialog: MatDialog, private ListCultura: CulturaService,
    private utilService: UtilService) {
      
    }

  ngOnInit() {
    this.usuario = this.utilService.getUsuarioWSO2();

    this.fechaActual.setDate(this.fechaActual.getDate());
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.inicializarFormularioCreacion();

    if(this.id){
      this.consultarActividadCultural(this.id);
    }  else {
      this.disableCamposCreacion = false;
      this.inicializarFormularioCreacion();
    }

    //this.consultarGruposCulturalesActivos();
    //this.inicializarFormulario();
    this.establecerNombreBoton();

  }

  //Metodos para crear actividades culturales
  inicializarFormularioCreacion(){
    this.crearActividad = this.fb.group({
      Nombre: ['', [Validators.required, Validators.maxLength(50)] ],
      Descripcion: ['', [Validators.required, Validators.maxLength(300)]],
      Estado: [1],
      TipoActividad: [''],
      FechaInicio: [''],
      HoraInicio: [''],
      FechaFin: [''],
      HoraFin: [''],
      Lugar: [''],
      EnlaceInscripcion: [''],
      EnlaceMayorInfo: [''],
      Imagen: [],
      GruposCulturales: this.fb.array([])
    });

    this.agregarFila();

    /*
    this.crearActividad = this.fb.group({
      Nombre: ['', [Validators.required, Validators.maxLength(50)] ],
      Descripcion: ['', [Validators.required, Validators.maxLength(300)]],
      Estado: [1],
      TipoActividad: ['', Validators.required]
      *7
    });*/
  }

  crearActividadCultural(){
    /*
    this.fechaCompletaInicio = this.fechaInicio + 'T' + this.crearActividad.value.HoraInicio + ':00-05:00';
    this.fechaCompletaFin = this.fechaFin + 'T' + this.crearActividad.value.HoraFin + ':00-05:00';

    if(this.mayorInfo == 1 && (this.crearActividad.value.EnlaceMayorInfo == '' || this.crearActividad.value.EnlaceMayorInfo == null)){

      this.toastr.error('Si la actividad cultural posee mayor información debe llevar enlace para obtener mayor información');

    } else {
      if(this.fechaCompletaInicio < this.fechaCompletaFin){

        this.convertirTipoActividadANumero(this.crearActividad.value.TipoActividad);

        this.actividadCultural.Nombre = this.crearActividad.value.Nombre;
        this.actividadCultural.Descripcion = this.crearActividad.value.Descripcion;
        this.actividadCultural.Estado = this.crearActividad.value.Estado;
        this.actividadCultural.TipoActividad = this.idTipoActividad;
        this.actividadCultural.FechaInicio = this.fechaCompletaInicio;
        this.actividadCultural.FechaFin = this.fechaCompletaFin;
        this.actividadCultural.Lugar = this.crearActividad.value.Lugar;
        this.actividadCultural.NecesitaInscripcion = this.necesitaInscripcion;
        this.actividadCultural.EnlaceInscripcion = this.crearActividad.value.EnlaceInscripcion;
        this.actividadCultural.PoseeMayorInfo = this.mayorInfo;
        this.actividadCultural.EnlaceMayorInfo = this.crearActividad.value.EnlaceMayorInfo;
        this.actividadCultural.Imagen = this.crearActividad.value.Imagen;
        this.actividadCultural.FechaCreacion = formatDate(this.fechaActual , 'yyyy-MM-ddThh:mm:ss-05:00', 'en');
        this.actividadCultural.FechaModificacion = null;
        this.actividadCultural.UsuarioRegistra = this.usuario;


        this.ListCultura.postActividadCultural(this.actividadCultural).subscribe((data) => {

          this.guardarGruposCulturalesParticipantes(data['Data'].Id);

          this.toastr.success('El actividad cultural '+ data['Data'].Nombre +' fue creada con exito');

          this.router.navigate(['/pages/cultura/actividad-cultural']);

        });
      } else {
        this.toastr.error('La fecha y hora de inicio deben ser menores a la fecha y hora de finalizacion');
      }
    }*/

    this.convertirTipoActividadANumero(this.crearActividad.value.TipoActividad);

    this.actividadCultural.Nombre = this.crearActividad.value.Nombre;
    this.actividadCultural.Descripcion = this.crearActividad.value.Descripcion;
    this.actividadCultural.Estado = this.crearActividad.value.Estado;
    this.actividadCultural.TipoActividad = this.idTipoActividad;
    this.actividadCultural.FechaCreacion = formatDate(this.fechaActual , 'yyyy-MM-ddThh:mm:ss-05:00', 'en');

    this.actividadCultural.UsuarioRegistra = this.usuario;

    this.ListCultura.postActividadCultural(this.actividadCultural).subscribe((data) => {

      this.toastr.success('El actividad cultural '+ data['Data'].Nombre +' fue creada con exito');

      this.router.navigate(['/pages/cultura/actividad-cultural']);

    });

  }

  ////Metodos para crear actividades culturales
  consultarActividadCultural(idActividad: number){
    if(this.id){
      this.ListCultura.getActividadCultural(idActividad).subscribe((data) => {
        console.log(data);
        this.crearActividad = this.fb.group({
          Nombre: [data['Data'].Nombre, [Validators.required, Validators.maxLength(50)] ],
          Descripcion: [data['Data'].Descripcion, [Validators.required, Validators.maxLength(300)]],
          Estado: [data['Data'].Estado],
          TipoActividad: [this.convertirNumeroATipoActividad(data['Data'].TipoActividad), Validators.required],
          FechaInicio: ['', Validators.required],
          HoraInicio: ['', Validators.required],
          FechaFin: ['', Validators.required],
          HoraFin: ['', Validators.required],
          Lugar: ['', [Validators.required, Validators.maxLength(50)]],
          EnlaceInscripcion: ['', [Validators.required, Validators.maxLength(300)]],
          EnlaceMayorInfo: [{value: '', disabled: true}],
          Imagen: ['', Validators.required]
          //GruposCulturales: this.fb.array([])
        });
      });
    }
  }


  guardarGruposCulturalesParticipantes(idActividad: number){

    const grParticipantes = this.GruposCulturales.value;
    const auxActividadCultural: ActividadCultural = new ActividadCultural();
    const auxGrupoCultural: GrupoCultural = new GrupoCultural();
    auxActividadCultural.Id = idActividad;

    grParticipantes.forEach((gr) => {
      this.idGruposCulturalesParticipantes.push(gr['GrupoParticipante'].IdGrupoParticipante);
    });

    this.idGruposCulturalesParticipantes = this.eliminarRepetidosGruposCulturalesParticipantes(this.idGruposCulturalesParticipantes);

    const grParticipantesNoRepetidos = this.idGruposCulturalesParticipantes;

   
    grParticipantesNoRepetidos.forEach((gr) => {

      auxGrupoCultural.Id = gr;

      this.actividadGrupoCultural.IdActividadCultural = auxActividadCultural;
      this.actividadGrupoCultural.IdGrupoCultural = auxGrupoCultural;

      this.ListCultura.postActividadGrupoCultural(this.actividadGrupoCultural).subscribe((data) => {
        console.log('Grupo asociado a la actividad cultural');
      });
    });
    

    
  }

  //Generalidades
  establecerNombreBoton(){
    if(this.id){
      this.ifDivCrearEditar = false;
    } else {
      this.ifDivCrearEditar = true;
    }
  }

  get GruposCulturales() {
    return this.crearActividad.get('GruposCulturales') as FormArray;
  }

  agregarFila(){
    const nuevaFila = this.fb.group({
      GrupoParticipante: ['', Validators.required]
    });
    this.GruposCulturales.push(nuevaFila);
  }

  quitarFila(index: number){
    if(this.GruposCulturales.length > 1){
      this.GruposCulturales.removeAt(index);
    } else {
      this.mostrarDialogo();
    }
    
  }

  consultarGruposCulturalesActivos(){

    this.ListCultura.getGruposCulturales().subscribe((data) => {

      if (JSON.stringify(data['Data'][0]) != '{}') {
        for (let i in data['Data']){
          if (data['Data'][i].Estado == 1){
            this.gruposCulturalesActivos = [...this.gruposCulturalesActivos, 
              {IdGrupoParticipante: data['Data'][i].Id, GrupoParticipante: data['Data'][i].Nombre}];
          }           
        }
      }
      
    });
  }

  mostrarDialogo(){
    this.dialog.open( DialogoEliminacionGruposCulturalesComponent, {width: '400px'});
  }

  onChangeInscripcion(cambio: boolean){
    this.disableEnlaceInscripcion = cambio;
    if (this.disableEnlaceInscripcion == true){
      this.necesitaInscripcion = 1;
    } else {
      this.necesitaInscripcion = 0;
    }
  }

  onChangeMayorInfo(cambio: boolean){
    this.disableEnlaceMayorInfo = cambio;
    if (this.disableEnlaceMayorInfo == true){
      this.crearActividad.controls['EnlaceMayorInfo'].enable();
      this.mayorInfo = 1;
    } else {
      this.crearActividad.controls['EnlaceMayorInfo'].disable();
      this.mayorInfo = 0;
    }
  }

  formatearFechaInicio(data: any){
    this.fechaInicio = formatDate(data, 'yyyy-MM-dd', 'en');
  }

  formatearFechaFin(data: any){
    this.fechaFin = formatDate(data, 'yyyy-MM-dd', 'en');
  }

  convertirNumeroATipoActividad(actividad: number){
    if(actividad == 1){
      return 'Evento';
    } else if (actividad == 2) {
      return 'Ensayo';
    } else if (actividad == 3) {
      return 'Taller';
    } else if (actividad == 4) {
      return 'Conversatorio';
    }
  }

  convertirTipoActividadANumero(actividad: String){
    if(actividad == 'Evento'){
      this.idTipoActividad = 1;
    } else if (actividad == 'Ensayo') {
      this.idTipoActividad = 2;
    } else if (actividad == 'Taller') {
      this.idTipoActividad = 3;
    } else if (actividad == 'Conversatorio') {
      this.idTipoActividad = 4;
    }
  }

  
  eliminarRepetidosGruposCulturalesParticipantes(array: any[]): any[] {
    return [...new Set(array)];
  }
  
  validarFormularioCreacionEdicion(estado: number){
    //if(this.crearActividad.valid && this.GruposCulturales.value.GrupoParticipante != ''){
    if(estado == 1 && this.crearActividad.valid){
      this.ifCrear = false;
    } else {
      return false;
    }
    return this.ifCrear && this.ifCrear;
  }

}

