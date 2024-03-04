import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActividadCultural } from '../../../../@core/data/models/cultura/actividad_cultural';
import { Parametro } from '../../../../@core/data/models/parametro/parametro';
//import {NbThemeModule,NbLayoutModule} from '@nebular/theme';




@Component({
  selector: 'ngx-form_act_cult',
  templateUrl: './form_act_cult.component.html',
  styleUrls: ['./form_act_cult.component.scss']
})
export class FormActCultComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  
  crearActividadCultural: FormGroup;
  actividadCultural: ActividadCultural;
  tipoActividad: Parametro;
  tiposActividad: String[] = ['Evento', 'Ensayo'];
  tieneEnlaceInscripcion = false;
  enlaceInscripcion: string = '';

  constructor(private fb: FormBuilder,) {
    this.crearActividadCultural = this.fb.group({
      Nombre: ['', Validators.required],
      TipoActividad: ['', Validators.required],
      Descripcion: ['', Validators.required],
      FechaInicio: [new Date(), Validators.required],
      FechaFin: ['', Validators.required],
      HoraInicio: ['', Validators.required],
      HoraFin: ['', Validators.required],
      LugarActividad: ['', Validators.required],
      NecesitaInscripcion: ['', Validators.required],
      MayorInf: ['', Validators.required],

    })
  }
   

  ngOnInit() {
    this.crearActividadCultural = new FormGroup({
      tieneEnlaceInscripcion: new FormControl(false),
      enlaceInscripcion: new FormControl({ value: '', disabled: true }),
    });
  }

  unirFecha(fecha: Date, hora: String) {
    return new Date();
  }
  agregarActividad() {

    this.actividadCultural = {
      IdActividadCultural: 0,
      Nombre: this.crearActividadCultural.controls.Nombre.value,
      IdTipoActividad: 666,
      Descripcion: this.crearActividadCultural.controls.Descripcion.value,
      Estado: 1,
      /*
      FechaCreacion: new Date(),
      FechaInicio: this.unirFecha(this.crearActividadCultural.controls.FechaInicio.value, this.crearActividadCultural.controls.HoraInicio.value),
      FechaFin: this.unirFecha(this.crearActividadCultural.controls.FechaFin.value, this.crearActividadCultural.controls.HoraFin.value),
      FechaModificacion: new Date(),
      */
      FechaCreacion: '',
      FechaInicio: '',
      FechaFin: '',
      FechaModificacion: '',
      LugarActividad: this.crearActividadCultural.controls.LugarActividad.value,
      NecesitaInscripcion: 0,
      MayorInf: 0,
      UsuarioCreador: '',
      
    }
    console.log(this.actividadCultural)
  }

  // Función que se ejecuta al seleccionar una imagen
  onFileSelected(event: any): void {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      // Aquí puedes realizar cualquier lógica con el archivo seleccionado
      console.log('Archivo seleccionado:', fileInput.files[0].name);
    }
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

}

