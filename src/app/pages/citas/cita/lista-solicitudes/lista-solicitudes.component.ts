import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';

@Component({
  selector: 'ngx-lista-solicitudes',
  templateUrl: './lista-solicitudes.component.html',
  styleUrls: ['./lista-solicitudes.component.scss']
})
export class ListaSolicitudesComponent implements OnInit {
  displayedColumns = ['documento', 'nombre', 'telefono', 'facultad', 'plataforma', 'servicio', 'especialista', 'acciones'];
  datasource = new MatTableDataSource([]);
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;

  constructor(private est: EstudiantesService) { }

  ngOnInit() {
    this.obtenerSolicitudes();
  }
  obtenerSolicitudes() {
    this.est.obtenerSolicitudes().subscribe((data: any) => {
      let array = [];
      for (let i in data) {
        let json = JSON.parse(data[i].Referencia);
        json.id = data[i].Id;
        array.push(json);
      }
      this.datasource.data = array;
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
      console.log(this.datasource.data);
    })
  }
}
