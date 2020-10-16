import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-detalle-horario',
  templateUrl: './detalle-horario.component.html',
  styleUrls: ['./detalle-horario.component.scss']
})
export class DetalleHorarioComponent implements OnInit {
  turnos: Array<any>;

  constructor() { }

  ngOnInit() {
    //Variables
    this.turnos = [
      {'Id': 1,'Nombre': 'Mañana'},
      {'Id': 2,'Nombre': 'Tarde'},
    ];
  }

}
