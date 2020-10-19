import { Component, OnInit } from '@angular/core';
import { Estudiante } from '../../estudiante';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-home-estudiante',
  templateUrl: './home-estudiante.component.html',
  styleUrls: ['./home-estudiante.component.scss']
})
export class HomeEstudianteComponent implements OnInit {

  estudiante: Estudiante = {
    codigo: 1,
    nombre: "Estefanía Pérez", 
    documentoIdentidad: 745896321,
    edad: 21,
    facultad: "Ingeniería",
    proyecto: "Bienestar",
    direccion: "Cll 3 # 3 - 3",
    telefono: 3008887777,
    estadoCivil: "Soltera",
    personasCargo: false
  }
  
  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }
  

}
