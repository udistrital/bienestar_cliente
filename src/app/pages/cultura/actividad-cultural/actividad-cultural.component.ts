import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadCultural } from '../../../@core/data/models/cultura/actividad_cultural';
@Component({
  selector: 'ngx-actividad-cultural',
  templateUrl: './actividad-cultural.component.html',
  styleUrls: ['./actividad-cultural.component.scss']
})
export class ActividadCulturalComponent implements OnInit {

  constructor(private router: Router,) { }

  columnas = ['nombre', 'fecha', 'lugar','estado'];
  actividades: boolean;
  actividades_culturales = [{nombre: 'Taller 1', fecha: '2023-10-29T00:00:00-00:00', lugar: 'Facultad de ingenieria', estado: 'Pendiente'},
                            {nombre: 'Actividad 1', fecha: '2024-01-29T00:00:00-00:00', lugar: 'Facultad de ciencias', estado: 'En desarrollo'},
                            {nombre: 'Taller 2', fecha: '2024-02-29T00:00:00-00:00', lugar: 'Facultad de educacion', estado: 'Finalizada'}];
  
  // actividades: ActividadCultural[]
  ngOnInit() {
  }

  obtenerActividades(){
    if (this.actividades_culturales.length < 1) {
      this.actividades = false;
    } else {
      this.actividades = true;
    }
    
  }
}
