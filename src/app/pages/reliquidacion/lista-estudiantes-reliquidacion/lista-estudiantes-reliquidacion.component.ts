import { Component, OnInit } from '@angular/core';

import { EstudianteService } from '../../../@core/data/estudiante.service'
import { Estudiante } from '../../../@core/data/models/estudiante'

@Component({
  selector: 'ngx-lista-estudiantes-reliquidacion',
  templateUrl: './lista-estudiantes-reliquidacion.component.html',
  styleUrls: ['./lista-estudiantes-reliquidacion.component.scss']
})
export class ListaEstudiantesReliquidacionComponent implements OnInit {
  access_token: string;
  textStudents: string;
  estudiantes: Estudiante[] = [];

  constructor(private estudianteService: EstudianteService) { 
    this.access_token = window.localStorage.getItem('access_token');
  }

  ngOnInit() {
  }

  consultarEstudiantes(event){
    this.consultarSolicitudes();
  }

  verSolicitud(estudiante){
    console.log('verSolicitud');
    console.log(estudiante);
  }

  consultarSolicitudes() {
    this.estudianteService.obtenerEstudiantes().subscribe((data: Estudiante[]) => {
      this.estudiantes = data as Estudiante[];
    });
  }

}
