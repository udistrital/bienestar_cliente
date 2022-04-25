import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogoSolicitudesComponent } from './dialogo-solicitudes/dialogo-solicitudes.component'; 

@Component({
  selector: 'ngx-lista-solicitudes',
  templateUrl: './lista-solicitudes.component.html',
  styleUrls: ['./lista-solicitudes.component.scss']
})
export class ListaSolicitudesComponent implements OnInit {
  displayedColumns = ['documento', 'nombre', 'telefono', 'facultad', 'plataforma', 'servicio', 'acciones'];
  datasource = new MatTableDataSource([]);
  solicitudes: boolean;
  nombreEst: string;
  correoEst: string;
  proyectoCurr: string;
  motivo: string;
  especialista: string;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;

  constructor(private est: EstudiantesService, public dialogo: MatDialog) { }

  ngOnInit() {
    this.obtenerSolicitudes();
  }
  obtenerSolicitudes() {
    this.est.obtenerSolicitudes().subscribe((data: any) => {
      //console.log(data);
      if (JSON.stringify(data[0]) === '{}') {
        this.solicitudes = false;
      }
      else {
        this.solicitudes = true;
        let array = [];
        for (let i in data) {
          let json = JSON.parse(data[i].Referencia);
          json.id = data[i].Id;
          array.push(json);
        }
        for (let i in array){
          this.est.getParametro(array[i].servicio).subscribe((res) => {
            array[i].nombreEspecialidad = res['Data'].Nombre;
          });
        }
        console.log(array);
        this.datasource.data = array;
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      }
      //console.log(this.datasource.data);
    })
  }
  mostrarDialogo(id:any){
    for (let i in this.datasource.data){
      if (this.datasource.data[i].servicio==id){
        let message = {
          nombre: this.datasource.data[i].Nombrecompleto,
          correo: this.datasource.data[i].correo,
          proyecto: this.datasource.data[i].proyecto,
          especialista: this.datasource.data[i].profesional,
          motivo: this.datasource.data[i].observaciones
        }
        this.dialogo
      .open(DialogoSolicitudesComponent, {
        data: message
      });
      }
    }
  }
}
