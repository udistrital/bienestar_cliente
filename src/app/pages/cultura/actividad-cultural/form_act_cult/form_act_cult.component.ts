import { Component, OnInit } from '@angular/core';
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
import { Documento } from '../../../../shared/models/Salud/documento.model';
import { Observable, ReplaySubject } from 'rxjs';

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
  FechaDiaMas = new Date();

  fechaFormateadaIni: Date = null;
  fechaFormateadaFin: Date = null;

  //Variables correspondientes a la fecha de inicio de la actividad en formato yyyy-MM-ddThh:mm:ss-05:00
  fechaInicio: string;
  horaInicio: string;
  fechaCompletaInicio: string;

  //Variables correspondientes a la fecha de finalizacion de la actividad en formato yyyy-MM-ddThh:mm:ss-05:00
  fechaFin: string;
  horaFin: string;
  fechaCompletaFin: string;

  //Variables correspondientes a los parametros de la tabla actividad_cultural de la base de datos
  necesitaInscripcion: number = 0;
  mayorInfo: number = 0;
  estadoNuevo: number;

  //Variables booleanas para habilitar y deshabilitar campos
  ifCrear: boolean = true;
  disableEnlaceInscripcion: boolean = false;
  disableCorreoContacto: boolean = false;
  disableEnlaceMayorInfo: boolean = false;
  disableImagen: boolean = false;

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

  //Variables utilizadas para los archivos
  base64:any = null;
  enlace : string;
  nombreArchivo = 'Seleccione la imagen del grupo';
  extension: string;
  ifImagen: boolean;

  constructor(private fb: FormBuilder, private router: Router,
    private toastr: ToastrService, private route: ActivatedRoute,
    private dialog: MatDialog, private ListCultura: CulturaService,
    private utilService: UtilService) {
      
    }

  ngOnInit() {
    this.usuario = this.utilService.getUsuarioWSO2();

    this.fechaActual.setDate(this.fechaActual.getDate());
    this.FechaDiaMas.setDate(this.FechaDiaMas.getDate()+1);
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.inicializarFormularioCreacion();

    if(this.id){
      this.consultarActividadCultural(this.id);
    }  else {
      this.inicializarFormularioCreacion();
    }

    this.consultarGruposCulturalesActivos();
    //this.inicializarFormulario();
    this.mostrarComponentesCreacion();

  }

  //Metodos para crear actividades culturales
  inicializarFormularioCreacion(){

    this.crearActividad = this.fb.group({
      Nombre: ['', [Validators.required, Validators.maxLength(50)] ],
      Descripcion: ['', [Validators.required, Validators.maxLength(300)]],
      Estado: [1],
      TipoActividad: ['', Validators.required],
      FechaInicio: [''],
      HoraInicio: [''],
      FechaFin: [''],
      HoraFin: [''],
      Lugar: [''],
      EnlaceInscripcion: [''],
      EnlaceMayorInfo: [''],
      UsuarioRegistra: [this.usuario],
      Activo: [true],
      FechaCreacion: [this.fechaActual],
      FechaModificacion: [this.fechaActual],
      GruposCulturales: this.fb.array([])
    });

  }

  crearActividadCultural(){

    this.convertirTipoActividadANumero(this.crearActividad.value.TipoActividad);

    this.actividadCultural.Nombre = this.crearActividad.value.Nombre;
    this.actividadCultural.Descripcion = this.crearActividad.value.Descripcion;
    this.actividadCultural.Estado = this.crearActividad.value.Estado;
    this.actividadCultural.TipoActividad = this.idTipoActividad;
    this.actividadCultural.UsuarioRegistra = this.crearActividad.value.UsuarioRegistra;
    this.actividadCultural.Activo = this.crearActividad.value.Activo;
    this.actividadCultural.FechaCreacion = this.crearActividad.value.FechaCreacion;
    this.actividadCultural.FechaModificacion = this.crearActividad.value.FechaModificacion;

    this.ListCultura.postActividadCultural(this.actividadCultural).subscribe((data) => {

      this.toastr.success('El actividad cultural '+ data['Data'].Nombre +' fue creada con exito');

      this.router.navigate(['/pages/cultura/actividad-cultural']);

    });

  }

  ////Metodos para crear actividades culturales
  consultarActividadCultural(idActividad: number){
    if(this.id){
      this.ListCultura.getActividadCultural(idActividad).subscribe((data) => {
        this.ListCultura.getGruposCulturalesParticipantes(idActividad).subscribe((res) => {

          //console.log(res['Data']);

          let auxFechaInicio, auxHoraInicio, auxFechaFin, auxHoraFin;
          
          if(data['Data'].FechaInicio == '0001-01-01T00:00:00Z'){
            auxFechaInicio = '';
            auxHoraInicio = '';
          } else {
            auxFechaInicio = new Date(data['Data'].FechaInicio);
            auxHoraInicio = formatDate(auxFechaInicio, 'HH:mm' , 'en');
          }

          if(data['Data'].FechaFin == '0001-01-01T00:00:00Z'){
            auxFechaFin = '';
            auxHoraInicio = '';
          } else {
            auxFechaFin = new Date(data['Data'].FechaFin);
            auxHoraFin = formatDate(auxFechaFin, 'HH:mm' , 'en');
          }

          if(data['Data'].NecesitaInscripcion == 1){
            this.disableEnlaceInscripcion = true;
            this.disableCorreoContacto = false;
          } else {
            this.disableEnlaceInscripcion = false;
            this.disableCorreoContacto = true;
          }

          this.onChangeInscripcion(this.disableEnlaceInscripcion);
          
          if(data['Data'].PoseeMayorInfo == 1){
            this.disableEnlaceMayorInfo = true;
          } else {
            this.disableEnlaceMayorInfo = false;
          }

          this.onChangeMayorInfo(this.disableEnlaceMayorInfo);

          this.disableImagen = true;

          if(data['Data'].Imagen){

            this.ListCultura.getDocumento(data['Data'].Imagen).subscribe((aux) => {
              this.nombreArchivo = aux['dc:title'];
            });
          } else {
            this.ifImagen = true;
          }
          
          

          if(data['Data'].Estado == 1 || data['Data'].Estado == 2) {

            this.ifImagen = true;

            this.crearActividad = this.fb.group({
            Nombre: [data['Data'].Nombre, [Validators.required, Validators.maxLength(50)] ],
            Descripcion: [data['Data'].Descripcion, [Validators.required, Validators.maxLength(300)]],
            Estado: [data['Data'].Estado],
            TipoActividad: [this.convertirNumeroATipoActividad(data['Data'].TipoActividad), Validators.required],
            FechaInicio: [auxFechaInicio],
            HoraInicio: [auxHoraInicio],
            FechaFin: [auxFechaFin],
            HoraFin: [auxHoraFin],
            Lugar: [data['Data'].Lugar, Validators.maxLength(50)],
            NecesitaInscripcion: data['Data'].NecesitaInscripcion,
            EnlaceInscripcion: [data['Data'].EnlaceInscripcion, Validators.maxLength(300)],
            PoseeMayorInfo: data['Data'].PoseeMayorInfo,
            EnlaceMayorInfo: [data['Data'].EnlaceMayorInfo],
            Imagen: [data['Data'].Imagen],
            FechaCreacion: [data['Data'].FechaCreacion],
            Activo: [data['Data'].Activo],
            FechaModificacion: [this.fechaActual],
            GruposCulturales: this.fb.array([])
            });

            if(JSON.stringify(res['Data'][0]) == '{}'){

              this.agregarFila();

            } else {

              for(let i in res['Data']){

                const nuevaFila = this.fb.group({
                  NombreGrupo: [res['Data'][i].IdGrupoCultural.Id + '. '+ res['Data'][i].IdGrupoCultural.Nombre]
                });

                this.GruposCulturales.push(nuevaFila);
                
              }
              
            }
          } 
        })
        
      });
      
    }
  }
  
  actualizarActividadCultural(){

    if((this.crearActividad.value.FechaInicio && !this.crearActividad.value.HoraInicio) || 
      (!this.crearActividad.value.FechaInicio && this.crearActividad.value.HoraInicio)){

      this.toastr.error('Si ingresa la fecha de inicio tambien debe agregar la hora de inicio y viceversa');

    } else if ((this.crearActividad.value.FechaFin && !this.crearActividad.value.HoraFin) || 
      (!this.crearActividad.value.FechaFin && this.crearActividad.value.HoraFin)){

      this.toastr.error('Si ingresa la fecha de finalización tambien debe agregar la hora de inicio y viceversa');

    } else {

    this.concatenarFechaInicio(this.crearActividad.value.FechaInicio ,this.crearActividad.value.HoraInicio);
    this.concatenarFechaFin(this.crearActividad.value.FechaFin, this.crearActividad.value.HoraFin);

    if((this.fechaFormateadaIni < this.fechaFormateadaFin) || (this.fechaFormateadaIni == null) || (this.fechaFormateadaFin == null) ){

        if(this.mayorInfo == 1 && (this.crearActividad.value.EnlaceMayorInfo == '' || this.crearActividad.value.EnlaceMayorInfo == null)){

          this.toastr.error('Si la actividad cultural posee enlace para mayor información, debe ingresar dicho enlace.');

        } else {

          if(this.fechaFormateadaIni && this.fechaFormateadaFin){
            this.estadoNuevo = 2;
          } else {
            this.estadoNuevo = 1;
          }

          if(this.ifImagen = true && this.base64 != null){

            const documento :Documento ={
              IdTipoDocumento : 84,
              nombre : 'banner_' + this.crearActividad.value.Nombre.replace(/\s/g, "") +'.'+ this.extension.split("/")[1],
              metadatos :{},
              descripcion:"Imagen representativa de la actividad: " + this.crearActividad.value.Nombre,
              file : this.base64      
            }
            
            let array = [documento];
            if(this.crearActividad.value.Imagen == '' || this.crearActividad.value.Imagen == null){
              this.ListCultura.postDocumento(array).subscribe((res) => {
  
                let auxFechaInicio : any;
                if(this.fechaFormateadaIni == null){
                  auxFechaInicio = this.fechaFormateadaIni;
                } else {
                  auxFechaInicio = this.fechaFormateadaIni.toISOString(); 
                }
  
                let auxFechaFin : any;
                if(this.fechaFormateadaFin == null){
                  auxFechaFin = this.fechaFormateadaIni;
                } else {
                  auxFechaFin = this.fechaFormateadaFin.toISOString(); 
                }
  
                this.enlace = res['res'].Enlace;
                this.convertirTipoActividadANumero(this.crearActividad.value.TipoActividad);
                        
                this.actividadCultural.Nombre = this.crearActividad.value.Nombre;
                this.actividadCultural.Descripcion = this.crearActividad.value.Descripcion;
                this.actividadCultural.Estado = this.estadoNuevo;
                this.actividadCultural.TipoActividad = this.idTipoActividad;
                this.actividadCultural.FechaInicio = auxFechaInicio; 
                this.actividadCultural.FechaFin = auxFechaFin;
                this.actividadCultural.Lugar = this.crearActividad.value.Lugar;
                this.actividadCultural.NecesitaInscripcion = this.necesitaInscripcion;
                this.actividadCultural.EnlaceInscripcion = this.crearActividad.value.EnlaceInscripcion;
                this.actividadCultural.PoseeMayorInfo = this.mayorInfo;
                this.actividadCultural.EnlaceMayorInfo = this.crearActividad.value.EnlaceMayorInfo;
                this.actividadCultural.Imagen = this.enlace;
                this.actividadCultural.UsuarioRegistra = this.usuario;
                this.actividadCultural.Activo = this.crearActividad.value.Activo;
                this.actividadCultural.FechaCreacion = this.crearActividad.value.FechaCreacion;
                this.actividadCultural.FechaModificacion = this.crearActividad.value.FechaModificacion;
                
                
                this.ListCultura.putActividadCultural(this.actividadCultural, this.id).subscribe((data) => {
                
                  this.toastr.success('El actividad cultural '+ data['Data'].Nombre +' fue editada con exito');
                  
                  if(this.GruposCulturales.length > 0){
                    this.guardarGruposCulturalesParticipantes(data['Data'].Id);
                  }
                  
                  this.router.navigate(['/pages/cultura/actividad-cultural']);
                
                });
                  
              });
            } else {
  
              this.ListCultura.deleteDocumento(this.crearActividad.value.Imagen).subscribe((data) => {
  
                this.ListCultura.postDocumento(array).subscribe((res) => {
  
                  let auxFechaInicio : any;
                  if(this.fechaFormateadaIni == null){
                    auxFechaInicio = this.fechaFormateadaIni;
                  } else {
                    auxFechaInicio = this.fechaFormateadaIni.toISOString(); 
                  }
  
                  let auxFechaFin : any;
                  if(this.fechaFormateadaFin == null){
                    auxFechaFin = this.fechaFormateadaIni;
                  } else {
                    auxFechaFin = this.fechaFormateadaFin.toISOString(); 
                  }
  
                  this.enlace = res['res'].Enlace;
                  this.convertirTipoActividadANumero(this.crearActividad.value.TipoActividad);
                          
                  this.actividadCultural.Nombre = this.crearActividad.value.Nombre;
                  this.actividadCultural.Descripcion = this.crearActividad.value.Descripcion;
                  this.actividadCultural.Estado = 1;
                  this.actividadCultural.TipoActividad = this.idTipoActividad;
                  this.actividadCultural.FechaInicio = auxFechaInicio; 
                  this.actividadCultural.FechaFin = auxFechaFin;
                  this.actividadCultural.Lugar = this.crearActividad.value.Lugar;
                  this.actividadCultural.NecesitaInscripcion = this.necesitaInscripcion;
                  this.actividadCultural.EnlaceInscripcion = this.crearActividad.value.EnlaceInscripcion;
                  this.actividadCultural.PoseeMayorInfo = this.mayorInfo;
                  this.actividadCultural.EnlaceMayorInfo = this.crearActividad.value.EnlaceMayorInfo;
                  this.actividadCultural.Imagen = this.enlace;
                  this.actividadCultural.UsuarioRegistra = this.usuario;
                  this.actividadCultural.Activo = this.crearActividad.value.Activo;
                  this.actividadCultural.FechaCreacion = this.crearActividad.value.FechaCreacion;
                  this.actividadCultural.FechaModificacion = this.crearActividad.value.FechaModificacion;
                  
                  
                  this.ListCultura.putActividadCultural(this.actividadCultural, this.id).subscribe((data) => {
                  
                    this.toastr.success('El actividad cultural '+ data['Data'].Nombre +' fue editada con exito');
                    
                    if(this.GruposCulturales.length > 0){
                      this.guardarGruposCulturalesParticipantes(data['Data'].Id);
                    }
      
                    this.router.navigate(['/pages/cultura/actividad-cultural']);
                  
                  });
                    
                });
              });
            }
            
          } else {
            let auxFechaInicio : any;
                if(this.fechaFormateadaIni == null){
                  auxFechaInicio = this.fechaFormateadaIni;
                } else {
                  auxFechaInicio = this.fechaFormateadaIni.toISOString(); 
                }
  
                let auxFechaFin : any;
                if(this.fechaFormateadaFin == null){
                  auxFechaFin = this.fechaFormateadaIni;
                } else {
                  auxFechaFin = this.fechaFormateadaFin.toISOString(); 
                }
  
                this.convertirTipoActividadANumero(this.crearActividad.value.TipoActividad);
                        
                this.actividadCultural.Nombre = this.crearActividad.value.Nombre;
                this.actividadCultural.Descripcion = this.crearActividad.value.Descripcion;
                this.actividadCultural.Estado = this.estadoNuevo;
                this.actividadCultural.TipoActividad = this.idTipoActividad;
                this.actividadCultural.FechaInicio = auxFechaInicio; 
                this.actividadCultural.FechaFin = auxFechaFin;
                this.actividadCultural.Lugar = this.crearActividad.value.Lugar;
                this.actividadCultural.NecesitaInscripcion = this.necesitaInscripcion;
                this.actividadCultural.EnlaceInscripcion = this.crearActividad.value.EnlaceInscripcion;
                this.actividadCultural.PoseeMayorInfo = this.mayorInfo;
                this.actividadCultural.EnlaceMayorInfo = this.crearActividad.value.EnlaceMayorInfo;
                this.actividadCultural.Imagen = this.crearActividad.value.Imagen;
                this.actividadCultural.UsuarioRegistra = this.usuario;
                this.actividadCultural.Activo = this.crearActividad.value.Activo;
                this.actividadCultural.FechaCreacion = this.crearActividad.value.FechaCreacion;
                this.actividadCultural.FechaModificacion = this.crearActividad.value.FechaModificacion;
                
                
                this.ListCultura.putActividadCultural(this.actividadCultural, this.id).subscribe((data) => {
                
                  this.toastr.success('El actividad cultural '+ data['Data'].Nombre +' fue editada con exito');
                  
                  if(this.GruposCulturales.length > 0){
                    this.guardarGruposCulturalesParticipantes(data['Data'].Id);
                  }
                  
                  this.router.navigate(['/pages/cultura/actividad-cultural']);
                
                });
          }
        }
        
      } else {
        console.log(this.fechaFormateadaIni);
        this.toastr.error('La fecha de inicio de la actividad debe ser menor que la fecha de finalizacion');
      }
      
    } 

  }

  guardarGruposCulturalesParticipantes(idActividad: number){

    //const registros = this.GruposCulturales.value;
    const registros = this.eliminarRepetidosGruposCulturalesParticipantes(this.GruposCulturales.value, 'NombreGrupo');
    const auxActividadCultural: ActividadCultural = new ActividadCultural();
    auxActividadCultural.Id = idActividad;

    this.ListCultura.getGruposCulturalesParticipantes(idActividad).subscribe((data) => {
      if(JSON.stringify(data['Data'][0]) == '{}'){
        registros.forEach((registro) => {
      
          const auxGrupoCultural: GrupoCultural = new GrupoCultural();
          auxGrupoCultural.Id = parseInt(registro['NombreGrupo'].split(".")[0]);

          this.actividadGrupoCultural.IdActividadCultural = auxActividadCultural;
          this.actividadGrupoCultural.IdGrupoCultural = auxGrupoCultural;
          this.actividadGrupoCultural.Activo = true;
          this.actividadGrupoCultural.FechaCreacion = this.fechaActual.toISOString();
          this.actividadGrupoCultural.FechaModificacion = this.fechaActual.toISOString();
          
          this.ListCultura.postActividadGrupoCultural(this.actividadGrupoCultural).subscribe((aux) => {
            console.log('Grupo cultural relacionado a la actividad');
          });

        });
      } else {

        for(let i in data['Data']){
          this.ListCultura.deleteActividadGrupoCultural(data['Data'][i].Id).subscribe((res) => {});
        }

          registros.forEach((registro) => {
        
            const auxGrupoCultural: GrupoCultural = new GrupoCultural();
            auxGrupoCultural.Id = parseInt(registro['NombreGrupo'].split(".")[0]);
  
            this.actividadGrupoCultural.IdActividadCultural = auxActividadCultural;
            this.actividadGrupoCultural.IdGrupoCultural = auxGrupoCultural;
            this.actividadGrupoCultural.Activo = true;
            this.actividadGrupoCultural.FechaCreacion = this.fechaActual.toISOString();
            this.actividadGrupoCultural.FechaModificacion = this.fechaActual.toISOString();
            
            this.ListCultura.postActividadGrupoCultural(this.actividadGrupoCultural).subscribe((aux) => {
              console.log('Grupo cultural relacionado a la actividad');
            });
  
          });
      }
      
    });

  }

  get GruposCulturales() {
    return this.crearActividad.get('GruposCulturales') as FormArray;
  }

  agregarFila(){
    const nuevaFila = this.fb.group({
      NombreGrupo: ['']
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
            this.gruposCulturalesActivos.push(data['Data'][i].Id + '. ' + data['Data'][i].Nombre);
            this.idGruposCulturalesParticipantes.push({IdGrupoParticipante: data['Data'][i].Id});
          }           
        }

      }
      
    });
  }

  mostrarDialogo(){
    this.dialog.open( DialogoEliminacionGruposCulturalesComponent, {width: '400px'});
  }

  concatenarFechaInicio(fecha: string, hora: string){

    if(typeof fecha === 'object'){
      this.fechaCompletaInicio = formatDate(fecha, 'yyyy-MM-dd', 'en') + 'T' + hora +':00';
      this.formatearFechaInicio(this.fechaCompletaInicio);
    }
    
  }

  concatenarFechaFin(fecha: string, hora: string){

    if(typeof fecha === 'object'){
      this.fechaCompletaFin = formatDate(fecha, 'yyyy-MM-dd', 'en') + 'T' + hora +':00';
      this.formatearFechaFin(this.fechaCompletaFin);
    }
  }

  formatearFechaInicio(data: any) {

    this.fechaFormateadaIni = new Date(data);
    
  }

  formatearFechaFin(data: any) {

    this.fechaFormateadaFin = new Date(data);

  }

  onChangeInscripcion(cambio: boolean){
    this.disableEnlaceInscripcion = cambio;
    this.disableCorreoContacto = !cambio;
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

  eliminarRepetidosGruposCulturalesParticipantes(array: any[], parametro: string): any[] {
    return array.filter((obj, index, self) =>
      index === self.findIndex((t) => (
        t[parametro] === obj[parametro]
      ))
    );
  }
  
  mostrarComponentesCreacion(){
    if(this.id == null){
      this.ifCrear = true;
    } else {
      this.ifCrear = false;
    }
  }

  capturarFile(event):any{
    this.extension = event.target.files[0].type;
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/png") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.nombreArchivo = 'Imagen seleccionada: ' + event.target.files[0].name;
          this.base64= base64;
          this.ifImagen = true;
        });
      } else {
        this.base64 = null;
        this.nombreArchivo = 'Ingrese nuevamente';
        this.toastr.error('Solo se reciben imagenes de tipo png o jpg.');
      }
    }
    else {
      this.base64 = null;
    }
    
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target["result"].toString()));
    return result;
  }

  validarFormularios(){
    if(this.crearActividad.valid && (!this.id || this.ifImagen)){
      return true;
    } else {
      return false;
    }
  }
}

