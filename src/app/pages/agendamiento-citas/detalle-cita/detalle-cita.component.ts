import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'ngx-detalle-cita',
  templateUrl: './detalle-cita.component.html',
  styleUrls: ['./detalle-cita.component.scss']
})
export class DetalleCitaComponent implements OnInit {
  tipoEspecialidadesData: Array<any>;
  sedesData: Array<any>;
  estudiante: any[];

  constructor(private http: HttpClient) { }

  

  ngOnInit() {
    //Conexión con estudiantes
    var httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'authorization': `Bearer ${window.localStorage.getItem('access_token')}`,
      }),
    };
    var path = environment.ACADEMICA_JBPM_SERVICE;
    var endpoint = 'datos_basicos_estudiante';
    this.http.get(path + endpoint + '/' + '20131020056', httpOptions)
    .subscribe((data: any[])=>{
      this.estudiante = data;
      console.log(data);
    });

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
