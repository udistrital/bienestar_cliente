import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//import { GrupoCultural } from '../../../../shared/models/Cultura/grupoCultural.model';
import { GrupoCultural } from '../../../../@core/data/models/cultura/grupo_cultural';
import { MatDialog } from '@angular/material';
import { DialogoEliminacionReunionesComponent } from './dialogo-eliminacion-reuniones/dialogo-eliminacion-reuniones.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'ngx-form-grup-cult',
  templateUrl: './form-grup-cult.component.html',
  styleUrls: ['./form-grup-cult.component.scss']
})
export class FormGrupCultComponent implements OnInit {

  optInscripcion: boolean = false;
  disableDateIni: boolean = true;
  disableDateFin: boolean = true;
  fechaIni: Date = new Date();
  fechaFormateada: string;

  fechaActual = new Date();

  dias: any[] = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
  crearGrupo: FormGroup;
  grupoCultural: GrupoCultural = new GrupoCultural();

  constructor(private fb: FormBuilder, private router: Router,
    private aRoute: ActivatedRoute, private toastr: ToastrService, 
    private dialog: MatDialog, private datePipe: DatePipe) { 
      
  }

  ngOnInit() {
    this.inicializarFormulario();
    this.fechaActual.setDate(this.fechaActual.getDate() +1);
  }

  inicializarFormulario(){
    this.crearGrupo = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: ['', Validators.required],
      necesitaInscripcion: ['', Validators.required],
      enlaceInscripcion: ['', Validators.required],
      fechaIniInscripcion: ['', Validators.required],
      fechaFinInscripcion: ['', Validators.required],
      reuniones: this.fb.array([])
    });

    this.agregarFila();
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

  guardarDatosGrupo(){
    this.grupoCultural.Nombre = this.crearGrupo.value.nombre;
    this.grupoCultural.Estado = 1;
    this.grupoCultural.Descripcion = this.crearGrupo.value.descripcion;
    this.grupoCultural.Email = this.crearGrupo.value.correo;
    this.grupoCultural.Imagen = this.crearGrupo.value.imagen;
    this.grupoCultural.NecesitaInscripcion = 1;
    this.grupoCultural.EnlaceInscripcion = this.crearGrupo.value.enlaceInscripcion;

    this.fechaFormateada = this.datePipe.transform(this.grupoCultural.FechaInicioInscr, 'yyyy-MM-ddTHH:mm:ssZ');
    console.log(this.fechaFormateada);
  }

  agregarGrupo(){
    this.guardarDatosGrupo();

    this.mostrarDatos();
    
  }

  onChange(cambio: boolean){
    this.optInscripcion = cambio;
  }

  mostrarDatos(){
    console.log(this.crearGrupo.value);
  }

  mostrarDialogo(){
    this.dialog.open( DialogoEliminacionReunionesComponent, {width: '400px'});
  }
}
