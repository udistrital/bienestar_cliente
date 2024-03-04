import { Component, OnInit,  } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//import { GrupoCultural } from '../../../../shared/models/Cultura/grupoCultural.model';
import { GrupoCultural } from '../../../../@core/data/models/cultura/grupo_cultural';
import { MatDialog } from '@angular/material';
import { DialogoEliminacionReunionesComponent } from './dialogo-eliminacion-reuniones/dialogo-eliminacion-reuniones.component';
import { DatePipe, formatDate } from '@angular/common';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { HorarioGrupoCultural } from '../../../../@core/data/models/cultura/horarios_grupo_cultural';


@Component({
  selector: 'ngx-form-grup-cult',
  templateUrl: './form-grup-cult.component.html',
  styleUrls: ['./form-grup-cult.component.scss']
})
export class FormGrupCultComponent implements OnInit {

  disableEnlaceInscripcion = false;
  fechaFormateadaIni: string;
  fechaFormateadaFin: string;
  ifCrearEditar: boolean = true;
  id: number;

  fechaActual = new Date();
  necesitaInscripcion: number = 0;

  dias: any[] = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
  estados: any[] = ["Activo", "Inactivo"];
  crearGrupo: FormGroup;
  grupoCultural: GrupoCultural = new GrupoCultural();
  horarioGrupoCultural: HorarioGrupoCultural = new HorarioGrupoCultural();

  constructor(private fb: FormBuilder, private router: Router,
    private toastr: ToastrService, private route: ActivatedRoute,
    private dialog: MatDialog, private ListCultura: CulturaService) { 
      
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.establecerNombreBoton();
    this.consultarGrupoCultural(this.id);
    this.inicializarFormulario();
    this.fechaActual.setDate(this.fechaActual.getDate() +1);
  }

  //Para crear grupos culturales
  inicializarFormulario(){
    this.crearGrupo = this.fb.group({
      nombre: ['', Validators.required],
      estado: ['', Validators.required],
      correo: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: ['', Validators.required],
      necesitaInscripcion: ['', Validators.required],
      enlaceInscripcion: [{value: '', disabled: true}, Validators.required],
      fechaIniInscripcion: [{value: '', disabled: true}, Validators.required],
      fechaFinInscripcion: [{value: '', disabled: true}, Validators.required],
      reuniones: this.fb.array([])
    });

    this.agregarFila();
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

  //Para editar grupos culturales
  consultarGrupoCultural(id: number){
    if(id){
      this.ListCultura.getGrupoCultural(id).subscribe((data) => { 
        //console.log(data);
        
          this.ListCultura.getHorariosGrupoCultural(this.id).subscribe((res) => { 

            let auxFechaIni, auxFechaFin, auxEstado;

            if(data['Data'].FechaInicioInscripcion == '0001-01-01T00:00:00Z'){
              auxFechaIni = '';
            } else {
              auxFechaIni = data['Data'].FechaInicioInscripcion;
            }

            if(data['Data'].FechaFinInscripcion == '0001-01-01T00:00:00Z'){
              auxFechaFin = '';
            } else {
              auxFechaFin = data['Data'].FechaFinInscripcion;
            }

            if(data['Data'].Estado == 1){
              auxEstado = 'Activo';
            } else {
              auxEstado = 'Inactivo'
            }

            this.crearGrupo = this.fb.group({
              nombre: [data['Data'].Nombre, Validators.required],
              estado: [auxEstado, Validators.required],
              correo: [data['Data'].EMail, Validators.required],
              descripcion: [data['Data'].Descripcion, Validators.required],
              imagen: [data['Data'].Imagen, Validators.required],
              necesitaInscripcion: [data['Data'].NecesitaInscripcion, Validators.required],
              enlaceInscripcion: [{value: data['Data'].EnlaceInscripcion, disabled: this.disableEnlaceInscripcion}, Validators.required],
              fechaIniInscripcion: [{value: auxFechaIni, disabled: this.disableEnlaceInscripcion}, Validators.required],
              fechaFinInscripcion: [{value: auxFechaFin, disabled: this.disableEnlaceInscripcion}, Validators.required],
              reuniones: this.fb.array([])
            });

            if(data['Data'].NecesitaInscripcion == 1){
              this.disableEnlaceInscripcion = true;
            } else {
              this.disableEnlaceInscripcion = false;
            }

            this.onChange(this.disableEnlaceInscripcion);

            for (let i in res['Data']){
                const nuevaFila = this.fb.group({
                  dia: [res['Data'][i].DiaReunion, Validators.required],
                  hora: [res['Data'][i].HoraReunion, Validators.required],
                  lugar: [res['Data'][i].LugarReunion, Validators.required],
                });
                this.reuniones.push(nuevaFila);
              
            }
            
          });
          
        
      });

    } else {
      console.log('No hay un id seleccionado');
    }
    
  }

  guardarDatosGrupo(){
    this.grupoCultural.Nombre = this.crearGrupo.value.nombre;
    this.grupoCultural.Estado = 1;
    this.grupoCultural.Descripcion = this.crearGrupo.value.descripcion;
    this.grupoCultural.Email = this.crearGrupo.value.correo;
    this.grupoCultural.Imagen = this.crearGrupo.value.imagen;
    this.grupoCultural.NecesitaInscripcion = this.necesitaInscripcion;
    this.grupoCultural.EnlaceInscripcion = this.crearGrupo.value.enlaceInscripcion;
    this.grupoCultural.FechaInicioInscripcion = this.fechaFormateadaIni;
    this.grupoCultural.FechaFinInscripcion = this.fechaFormateadaFin; 

    this.ListCultura.postGrupoCultural(this.grupoCultural).subscribe((data: any) => {

      this.guardarReunionesGrupo(data['Data'].Id);

      this.toastr.success('El grupo cultural fue creado con exito');
      setTimeout(() => {
        window.location.reload();
      },
        500);

    });

  }

  guardarReunionesGrupo(idGrupo: number){

    const registros = this.reuniones.value;
    const auxGrupoCultural: GrupoCultural = new GrupoCultural();
    auxGrupoCultural.Id = idGrupo;

    registros.forEach((registro, index) => {

      this.horarioGrupoCultural.IdGrupoCultural = auxGrupoCultural;
      this.horarioGrupoCultural.DiaReunion = registro['dia'];
      this.horarioGrupoCultural.HoraReunion = registro['hora'];
      this.horarioGrupoCultural.LugarReunion = registro['lugar'];

      this.ListCultura.postHorarioGrupoCultural(this.horarioGrupoCultural).subscribe((data) => {
        console.log(data);
        console.log('Horario creado '+index);
      });

    });
  }

  formatearFechaIni(data: any) {

    this.fechaFormateadaIni = formatDate(data, 'yyyy-MM-ddT12:00:00-05:00', 'en');
    
  }

  formatearFechaFin(data: any) {

    this.fechaFormateadaFin = formatDate(data, 'yyyy-MM-ddT12:00:00-05:00', 'en');

  }
  
  agregarGrupo(){
    this.guardarDatosGrupo();
    this.router.navigate(['/pages/cultura/grupo-cultural']);
  }

  editarGrupo(){

    let auxEstado;

    if(this.crearGrupo.value.estado == 'Activo'){
      auxEstado = 1;
    } else {
      auxEstado = 0;
    }

    this.grupoCultural.Nombre = this.crearGrupo.value.nombre;
    this.grupoCultural.Estado = auxEstado;
    this.grupoCultural.Descripcion = this.crearGrupo.value.descripcion;
    this.grupoCultural.Email = this.crearGrupo.value.correo;
    this.grupoCultural.Imagen = this.crearGrupo.value.imagen;
    this.grupoCultural.NecesitaInscripcion = this.necesitaInscripcion;
    this.grupoCultural.EnlaceInscripcion = this.crearGrupo.value.enlaceInscripcion;
    this.grupoCultural.FechaInicioInscripcion = this.fechaFormateadaIni;
    this.grupoCultural.FechaFinInscripcion = this.fechaFormateadaFin; 

    this.ListCultura.putGrupoCultural(this.grupoCultural, this.id).subscribe((data) => {
      console.log(data);
      console.log('Grupo actualizado');

      this.toastr.success('El grupo cultural fue actualizado con exito');
      setTimeout(() => {
        window.location.reload();
      },
        500);

    });

    this.router.navigate(['/pages/cultura/grupo-cultural']);
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

  mostrarDialogo(){
    this.dialog.open( DialogoEliminacionReunionesComponent, {width: '400px'});
  }
}
