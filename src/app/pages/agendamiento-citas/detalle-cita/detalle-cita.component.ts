import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-detalle-cita',
  templateUrl: './detalle-cita.component.html',
  styleUrls: ['./detalle-cita.component.scss']
})
export class DetalleCitaComponent implements OnInit {
  tipoEspecialidadesData: Array<any>;
  sedesData: Array<any>;
  estudiante: any[];

  constructor() { }


  ngOnInit() {
    //Variables
    this.tipoEspecialidadesData = [
      {'Id': 1,'Nombre': 'Medicina general'},
      {'Id': 2,'Nombre': 'Odontología'},
      {'Id': 3,'Nombre': 'Psicología'}
    ];

    this.sedesData = [
      {'Id': 1,'Nombre': 'Ingeniería'},
      {'Id': 2,'Nombre': 'Macarena'},
      {'Id': 3,'Nombre': 'ASAB'}
    ];
  }

}
