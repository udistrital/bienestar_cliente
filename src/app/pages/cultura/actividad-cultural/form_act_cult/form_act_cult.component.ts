import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActividadCultural } from '../../../../@core/data/models/cultura/actividad_cultural';
import { Parametro } from '../../../../@core/data/models/parametro/parametro';
//import {NbThemeModule,NbLayoutModule} from '@nebular/theme';




@Component({
  selector: 'ngx-form_act_cult',
  templateUrl: './form_act_cult.component.html',
  styleUrls: ['./form_act_cult.component.scss']
})
export class FormActCultComponent implements OnInit {
  crearActividadCultural: FormGroup;
  actividadCultural: ActividadCultural;
  tipoActividad: Parametro;
  tiposActividad: String[] = ['Evento', 'Ensayo'];

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
      FechaCreacion: new Date(),
      FechaInicio: this.unirFecha(this.crearActividadCultural.controls.FechaInicio.value, this.crearActividadCultural.controls.HoraInicio.value),
      FechaFin: this.unirFecha(this.crearActividadCultural.controls.FechaFin.value, this.crearActividadCultural.controls.HoraFin.value),
      FechaModificacion: new Date(),
      LugarActividad: this.crearActividadCultural.controls.LugarActividad.value,
      NecesitaInscripcion: 0,
      MayorInf: 0,
      UsuarioCreador: '',
      
    }
    console.log(this.actividadCultural)
  }

}

