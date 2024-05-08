import { Component, OnInit,  } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GrupoCultural } from '../../../../@core/data/models/cultura/grupo_cultural';
import { MatDialog } from '@angular/material';
import { DialogoEliminacionReunionesComponent } from './dialogo-eliminacion-reuniones/dialogo-eliminacion-reuniones.component';
import { formatDate } from '@angular/common';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { HorarioGrupoCultural } from '../../../../@core/data/models/cultura/horarios_grupo_cultural';
import { Documento } from '../../../../shared/models/Salud/documento.model';
import { Observable, ReplaySubject } from 'rxjs';


@Component({
  selector: 'ngx-form-grup-cult',
  templateUrl: './form-grup-cult.component.html',
  styleUrls: ['./form-grup-cult.component.scss']
})
export class FormGrupCultComponent implements OnInit {

  fechaFormateadaIni: Date;
  fechaFormateadaFin: Date;
  fechaFormateadaIni2: string;
  fechaFormateadaFin2: string;
  auxEnlace: string;
  id: number;

  disableEnlaceInscripcion:boolean = false;
  ifCrearEditar: boolean = true;
  valFormularios: boolean = false;

  fechaActual = new Date();
  necesitaInscripcion: number = 0;

  dias: any[] = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
  estados: any[] = ["Activo", "Inactivo"];
  crearGrupo: FormGroup;
  grupoCultural: GrupoCultural = new GrupoCultural();
  horarioGrupoCultural: HorarioGrupoCultural = new HorarioGrupoCultural();

  base64:any = null;
  enlace : string;
  nombreArchivo = 'Seleccione la imagen del grupo';
  extension: string;
  ifImagen: boolean;

  constructor(private fb: FormBuilder, private router: Router,
    private toastr: ToastrService, private route: ActivatedRoute,
    private dialog: MatDialog, private ListCultura: CulturaService) { 
      
  }

  ngOnInit() {
    this.fechaActual.setDate(this.fechaActual.getDate());
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.inicializarFormulario();

    if(this.id){
      this.consultarGrupoCultural(this.id);
    }  else {
      this.inicializarFormulario();
    }
    this.establecerNombreBoton();
    
  }

  //Para crear grupos culturales
  inicializarFormulario(){
    this.crearGrupo = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      estado: [1],
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      enlaceInscripcion: [{value: '', disabled: true}, [Validators.maxLength(300)]],
      fechaIniInscripcion: [{value: '', disabled: true}],
      fechaFinInscripcion: [{value: '', disabled: true}],
      liderGrupo: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      activo: [true],
      fechaCreacion: [this.fechaActual],
      fechaModificacion: [this.fechaActual],
      reuniones: this.fb.array([])
    });

    this.agregarFila();
  }

  agregarGrupo(){
    this.guardarDatosGrupo();
  }

  guardarDatosGrupo(){
    if(this.crearGrupo.value.liderGrupo.split("@")[1] == 'udistrital.edu.co'){
      if(this.necesitaInscripcion == 1 &&
        (this.crearGrupo.value.enlaceInscripcion == '' || this.crearGrupo.value.enlaceInscripcion == null ||
        this.crearGrupo.value.fechaIniInscripcion == '' || this.crearGrupo.value.fechaIniInscripcion == null ||
        this.crearGrupo.value.fechaFinInscripcion == '' || this.crearGrupo.value.fechaFinInscripcion == null)){
  
          this.toastr.error('Si el grupo cultural necesita inscripcion debe llevar enlace, fecha de inicio y de finalizaciòn para la inscripciòn');
  
      } else {
  
        if((this.necesitaInscripcion == 0 ) || ( this.necesitaInscripcion == 1 && (formatDate(this.fechaFormateadaIni, 'yyyy-MM-dd', 'en') < formatDate(this.fechaFormateadaFin, 'yyyy-MM-dd', 'en') || 
        formatDate(this.fechaFormateadaIni, 'yyyy-MM-dd', 'en') == formatDate(this.fechaFormateadaFin, 'yyyy-MM-dd', 'en'))) ){
  
          this.eliminarInfoNoInscripcion(this.necesitaInscripcion);
  
          const documento :Documento ={
            IdTipoDocumento : 83,
            nombre : 'logo_' + this.crearGrupo.value.nombre.replace(/\s/g, "") +'.'+ this.extension.split("/")[1],
            metadatos :{},
            descripcion:"Imagen representativa del grupo: " + this.crearGrupo.value.nombre,
            file : this.base64      
          }
  
          let array = [documento];
          this.ListCultura.postDocumento(array).subscribe((data)=>{
  
            this.convertirFechaInicioString(this.fechaFormateadaIni);
            this.convertirFechafinString(this.fechaFormateadaFin);

            this.grupoCultural.Nombre = this.crearGrupo.value.nombre;
            this.grupoCultural.Estado = this.crearGrupo.value.estado;
            this.grupoCultural.Descripcion = this.crearGrupo.value.descripcion;
            this.grupoCultural.Email = this.crearGrupo.value.correo;
            this.grupoCultural.Imagen = data['res'].Enlace;
            this.grupoCultural.NecesitaInscripcion = this.necesitaInscripcion;
            this.grupoCultural.EnlaceInscripcion = this.crearGrupo.value.enlaceInscripcion;
            this.grupoCultural.FechaInicioInscripcion = this.fechaFormateadaIni2;
            this.grupoCultural.FechaFinInscripcion = this.fechaFormateadaFin2 
            this.grupoCultural.LiderGrupo = this.crearGrupo.value.liderGrupo;
            this.grupoCultural.Activo = this.crearGrupo.value.activo;
            this.grupoCultural.FechaCreacion = this.crearGrupo.value.fechaCreacion;
            this.grupoCultural.FechaModificacion = this.crearGrupo.value.fechaModificacion;
        
            this.ListCultura.postGrupoCultural(this.grupoCultural).subscribe((res: any) => {
        
              this.guardarReunionesGrupo(res['Data'].Id);
        
              this.toastr.success('El grupo cultural '+ res['Data'].Nombre +' fue creado con exito');
  
              this.router.navigate(['/pages/cultura/grupo-cultural']);
        
            });
          });
  
          
  
        } else {
  
          this.toastr.error('Fecha de inicio de inscripciones no puede ser mayor a la fecha de finalizacion de inscripciones');
  
        }
  
      }
    } else {
      this.toastr.error('Correo no valido. Debe ingresarse correo institucional en este campo');
    }    

  }

  guardarReunionesGrupo(idGrupo: number){

    const registros = this.reuniones.value;
    const auxGrupoCultural: GrupoCultural = new GrupoCultural();
    auxGrupoCultural.Id = idGrupo;

    registros.forEach((registro) => {

      this.horarioGrupoCultural.IdGrupoCultural = auxGrupoCultural;
      this.horarioGrupoCultural.DiaReunion = registro['dia'];
      this.horarioGrupoCultural.HoraReunion = registro['hora'];
      this.horarioGrupoCultural.LugarReunion = registro['lugar'];
      this.horarioGrupoCultural.Activo = registro['activo'];
      this.horarioGrupoCultural.FechaCreacion = registro['fechaCreacion'];
      this.horarioGrupoCultural.FechaModificacion = registro['fechaModificacion'];

      this.ListCultura.postHorarioGrupoCultural(this.horarioGrupoCultural).subscribe((data) => {
        console.log('Horario creado ');
      });

    });
  }

  //Para editar grupos culturales
  consultarGrupoCultural(id: number){
    if(id){
      this.ListCultura.getGrupoCultural(id).subscribe((data) => { 

          this.ListCultura.getHorariosGrupoCultural(this.id).subscribe((res) => { 

            let auxFechaIni, auxFechaFin, auxEstado;
            
            if(data['Data'].FechaInicioInscripcion == '0001-01-01T00:00:00Z'){
              auxFechaIni = '';
            } else {
              auxFechaIni = data['Data'].FechaInicioInscripcion;
              this.formatearFechaIni(auxFechaIni);
            }

            if(data['Data'].FechaFinInscripcion == '0001-01-01T00:00:00Z'){
              auxFechaFin = '';
            } else {
              auxFechaFin = data['Data'].FechaFinInscripcion;
              this.formatearFechaFin(auxFechaFin);
            }

            if(data['Data'].Estado == 1){
              auxEstado = 'Activo';
            } else {
              auxEstado = 'Inactivo'
            }

            if(data['Data'].NecesitaInscripcion == 1){
              this.disableEnlaceInscripcion = true;
            } else {
              this.disableEnlaceInscripcion = false;
            }
            
            this.onChange(this.disableEnlaceInscripcion);
            this.auxEnlace = data['Data'].EnlaceInscripcion;

            this.ListCultura.getDocumento(data['Data'].Imagen).subscribe((res) => {
              this.nombreArchivo = res['dc:title'];
            });

            this.ifImagen = true;

            this.crearGrupo = this.fb.group({
              nombre: [data['Data'].Nombre, Validators.required],
              estado: [auxEstado, Validators.required],
              correo: [data['Data'].EMail, [Validators.required, Validators.email, Validators.maxLength(50)]],
              descripcion: [data['Data'].Descripcion, Validators.required],
              imagen: [data['Data'].Imagen, Validators.required],
              necesitaInscripcion: [data['Data'].NecesitaInscripcion, Validators.required],
              enlaceInscripcion: [{value: this.auxEnlace, disabled: true}, Validators.required],
              fechaIniInscripcion: [{value: auxFechaIni, disabled: false}],
              fechaFinInscripcion: [{value: auxFechaFin, disabled: false}],
              liderGrupo: [data['Data'].LiderGrupo, [Validators.required, Validators.email, Validators.maxLength(50)]],
              activo: [data['Data'].Activo],
              fechaCreacion: [data['Data'].FechaCreacion],
              fechaModificacion: [this.fechaActual],
              reuniones: this.fb.array([])
            });

            for (let i in res['Data']){
                const nuevaFila = this.fb.group({
                  id: [res['Data'][i].Id],
                  dia: [res['Data'][i].DiaReunion, Validators.required],
                  hora: [res['Data'][i].HoraReunion, Validators.required],
                  lugar: [res['Data'][i].LugarReunion, Validators.required],
                  activo: [res['Data'][i].Activo],
                  fechaCreacion: [res['Data'][i].FechaCreacion],
                  fechaModificacion: [this.fechaActual],
                });
                this.reuniones.push(nuevaFila);
              
            }
            
          });
          
        
      });

    } else {
      console.log('No hay un id seleccionado');
    }
    
  }

  editarGrupo(){
    if(this.crearGrupo.value.liderGrupo.split("@")[1] == 'udistrital.edu.co'){
      if(this.necesitaInscripcion == 1 &&
        (this.auxEnlace == '' || this.auxEnlace == null ||
        this.crearGrupo.value.fechaIniInscripcion == '' || this.crearGrupo.value.fechaIniInscripcion == null ||
        this.crearGrupo.value.fechaFinInscripcion == '' || this.crearGrupo.value.fechaFinInscripcion == null)){
  
          this.toastr.error('Si el grupo cultural necesita inscripcion debe llevar enlace, fecha de inicio y de finalizaciòn para la inscripciòn');
  
      } else {
  
        if((this.necesitaInscripcion == 0 ) || 
        ( this.necesitaInscripcion == 1 && (formatDate(this.fechaFormateadaIni, 'yyyy-MM-dd', 'en') < formatDate(this.fechaFormateadaFin, 'yyyy-MM-dd', 'en') || 
          formatDate(this.fechaFormateadaIni, 'yyyy-MM-dd', 'en') == formatDate(this.fechaFormateadaFin, 'yyyy-MM-dd', 'en'))) ){
            
          let auxEstado;
  
          if(this.crearGrupo.value.estado == 'Activo'){
            auxEstado = 1;
          } else {
            auxEstado = 0;
          }
  
          this.eliminarInfoNoInscripcion(this.necesitaInscripcion);

          if(this.ifImagen = true && this.base64 != null){
  
            this.ListCultura.deleteDocumento(this.crearGrupo.value.imagen).subscribe((data) => {
  
              const documento :Documento ={
                IdTipoDocumento : 83,
                nombre : 'logo_' + this.crearGrupo.value.nombre.replace(/\s/g, "") +'.'+ this.extension.split("/")[1],
                metadatos :{},
                descripcion:"Imagen representativa del grupo: " + this.crearGrupo.value.nombre,
                file : this.base64      
              }
      
              let array = [documento];
  
              this.ListCultura.postDocumento(array).subscribe((res: any) => {
                this.enlace = res['res'].Enlace;

                this.convertirFechaInicioString(this.fechaFormateadaIni);
                this.convertirFechafinString(this.fechaFormateadaFin);
  
                this.grupoCultural.Nombre = this.crearGrupo.value.nombre;
                this.grupoCultural.Estado = auxEstado;
                this.grupoCultural.Descripcion = this.crearGrupo.value.descripcion;
                this.grupoCultural.Email = this.crearGrupo.value.correo;
                this.grupoCultural.NecesitaInscripcion = this.necesitaInscripcion;
                this.grupoCultural.EnlaceInscripcion = this.auxEnlace;
                this.grupoCultural.FechaInicioInscripcion = this.fechaFormateadaIni2;
                this.grupoCultural.FechaFinInscripcion = this.fechaFormateadaFin2; 
                this.grupoCultural.LiderGrupo = this.crearGrupo.value.liderGrupo;
                this.grupoCultural.Imagen = this.enlace;
                this.grupoCultural.Activo = this.crearGrupo.value.activo;
                this.grupoCultural.FechaCreacion = this.crearGrupo.value.fechaCreacion;
                this.grupoCultural.FechaModificacion = this.crearGrupo.value.fechaModificacion;
            
                this.ListCultura.putGrupoCultural(this.grupoCultural, this.id).subscribe((data) => {
            
                  this.toastr.success('Grupo '+ data['Data'].Nombre +' actualizado con exito');
            
                  this.actualizarHorarios(data['Data'].Id);
  
                });
  
              });
  
            });
      
            this.router.navigate(['/pages/cultura/grupo-cultural']);
  
          } else {
  
            this.convertirFechaInicioString(this.fechaFormateadaIni);
            this.convertirFechafinString(this.fechaFormateadaFin);

            this.grupoCultural.Nombre = this.crearGrupo.value.nombre;
            this.grupoCultural.Estado = auxEstado;
            this.grupoCultural.Descripcion = this.crearGrupo.value.descripcion;
            this.grupoCultural.Email = this.crearGrupo.value.correo;
            this.grupoCultural.NecesitaInscripcion = this.necesitaInscripcion;
            this.grupoCultural.EnlaceInscripcion = this.auxEnlace;
            this.grupoCultural.FechaInicioInscripcion = this.fechaFormateadaIni2;
            this.grupoCultural.FechaFinInscripcion = this.fechaFormateadaFin2; 
            this.grupoCultural.LiderGrupo = this.crearGrupo.value.liderGrupo;
            this.grupoCultural.Imagen = this.crearGrupo.value.imagen;
            this.grupoCultural.Activo = this.crearGrupo.value.activo;
            this.grupoCultural.FechaCreacion = this.crearGrupo.value.fechaCreacion;
            this.grupoCultural.FechaModificacion = this.crearGrupo.value.fechaModificacion;
          
            this.ListCultura.putGrupoCultural(this.grupoCultural, this.id).subscribe((data) => {
          
              this.toastr.success('Grupo '+ data['Data'].Nombre +' actualizado con exito');
          
              this.actualizarHorarios(data['Data'].Id);
  
              this.router.navigate(['/pages/cultura/grupo-cultural']);
            });
  
          }
          
        } else {
  
          this.toastr.error('Fecha de inicio de inscripciones no puede ser mayor a la fecha de finalizacion de inscripciones');
  
        }
      }
    } else {
      this.toastr.error('Correo no valido. Debe ingresarse correo institucional en este campo');
    } 

  }

  actualizarHorarios(idGrupo: number){

    const registros = this.reuniones.value;

    this.ListCultura.getHorariosGrupoCultural(this.id).subscribe((data) => {

      const auxData = data['Data'];

      if(JSON.stringify(data['Data'][0]) != '{}'){
        for(let i in auxData){
          this.ListCultura.deleteHorarioGrupoCultural(auxData[i].Id).subscribe((data) => {
            console.log('Horario eliminado')
          });
        }
      }

      this.guardarReunionesGrupo(idGrupo);
      
    });

  }

  eliminarHorarios(){

  }

  //Generalidades

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

  eliminarInfoNoInscripcion(auxInscripcion: number){
    if (auxInscripcion == 0){
      this.auxEnlace = null;
      this.fechaFormateadaIni = null;
      this.fechaFormateadaFin = null;
    }
  }

  establecerNombreBoton(){
    if(this.id){
      this.ifCrearEditar = false;
    } else {
      this.ifCrearEditar = true;
    }
  }

  get reuniones() {
    return this.crearGrupo.get('reuniones') as FormArray;
  }

  agregarFila(){
    const nuevaFila = this.fb.group({
      dia: ['', Validators.required],
      hora: ['', Validators.required],
      lugar: ['', Validators.required],
      activo: [true],
      fechaCreacion: [this.fechaActual],
      fechaModificacion: [this.fechaActual]
    });
    this.reuniones.push(nuevaFila);
  }

  quitarFila(index: number){
    if(this.reuniones.length > 1){
      this.reuniones.removeAt(index);
    } else {
      this.mostrarDialogo();
    }
    
  }

  formatearEnlaceInscripcion(data: any) {

    this.auxEnlace = data;
    
  }

  formatearFechaIni(data: any) {
    
    this.fechaFormateadaIni = new Date(data);
    
  }

  convertirFechaInicioString(fecha: Date){
    if(fecha != null){
      this.fechaFormateadaIni2 = fecha.toISOString();
    } else {
      this.fechaFormateadaIni2 = null;
    }
  }

  formatearFechaFin(data: any) {

    this.fechaFormateadaFin = new Date(data);

  }

  convertirFechafinString(fecha: Date){
    if(fecha != null){
      this.fechaFormateadaFin2 = fecha.toISOString();
    } else {
      this.fechaFormateadaFin2 = null;
    }
  }

  mostrarDialogo(){
    this.dialog.open( DialogoEliminacionReunionesComponent, {width: '400px'});
  }


  onChange(cambio: boolean){
    this.disableEnlaceInscripcion = cambio;
    if (this.disableEnlaceInscripcion == true){
      this.crearGrupo.controls['enlaceInscripcion'].enable();
      this.crearGrupo.controls['fechaIniInscripcion'].enable();
      this.crearGrupo.controls['fechaFinInscripcion'].enable();
      this.necesitaInscripcion = 1;
    } else {
      this.crearGrupo.controls['enlaceInscripcion'].disable();
      this.crearGrupo.controls['fechaIniInscripcion'].disable();
      this.crearGrupo.controls['fechaFinInscripcion'].disable();
      this.necesitaInscripcion = 0;
    }
  }

  clearFechaInicio(event) {
    event.stopPropagation();
    this.crearGrupo.controls['fechaIniInscripcion'].setValue(null);
  }

  clearFechaFin(event) {
    event.stopPropagation();
    this.crearGrupo.controls['fechaFinInscripcion'].setValue(null);
  }

  validarFormularios(){
    if(this.crearGrupo.valid && this.reuniones.value.dia != '' && this.ifImagen){
      return true;
    } else {
      return false;
    }
    
  }

}
  
