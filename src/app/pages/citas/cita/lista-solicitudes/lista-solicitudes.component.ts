import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';

@Component({
  selector: 'ngx-lista-solicitudes',
  templateUrl: './lista-solicitudes.component.html',
  styleUrls: ['./lista-solicitudes.component.scss']
})
export class ListaSolicitudesComponent implements OnInit {
  displayedColumns = ['documento', 'nombre','telefono','facultad','plataforma', 'servicio', 'especialista'];
  datasource: any[]=[];

  constructor(private est: EstudiantesService) { }

  ngOnInit() {
    this.obtenerSolicitudes();
  }
  obtenerSolicitudes(){
    this.est.obtenerSolicitudes().subscribe((data: any) => {;
      let array = [];
      for (let i in data){
        let json = JSON.parse(data[i].Referencia);
        array.push(json);
      }
      this.datasource = array;
      console.log(this.datasource);
    })
  }
}
