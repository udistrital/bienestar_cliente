import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadCultural } from '../../../@core/data/models/cultura/actividad_cultural';
import { CulturaService } from '../../../shared/services/cultura.service';
import { MatDialog } from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort'
import { formatDate } from '@angular/common';
import { DialogoActividadesCulturalesComponent } from './dialogo-actividades-culturales/dialogo-actividades-culturales.component';
@Component({
  selector: 'ngx-actividad-cultural',
  templateUrl: './actividad-cultural.component.html',
  styleUrls: ['./actividad-cultural.component.scss']
})
export class ActividadCulturalComponent implements OnInit {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private ListCultura: CulturaService, private dialog: MatDialog, private router: Router) { }

  actividades: boolean;

  actividadesCulturales: any[] = [];

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['Nombre', 'Descripcion', 'Estado',  'FechaInicio', 'FechaFin', 'UsuarioRegistra', 'Acciones'];

  

  ngOnInit() {

    this.obtenerActividadesCulturales();
  
  }

  obtenerActividadesCulturales(){
    this.ListCultura.getActividadesCulturales().subscribe((data) => {
      
      if (JSON.stringify(data['Data'][0]) != '{}') {
        this.actividades = true;
        for (let i in data['Data']){

          const actividadCultural: ActividadCultural = new ActividadCultural();
          actividadCultural.Id = data['Data'][i].Id;
          actividadCultural.Nombre = data['Data'][i].Nombre;
          actividadCultural.Descripcion = data['Data'][i].Descripcion;
          actividadCultural.Estado = data['Data'][i].Estado;
          actividadCultural.FechaInicio = this.castearFecha(data['Data'][i].FechaInicio);
          actividadCultural.FechaFin = this.castearFecha(data['Data'][i].FechaFin);
          actividadCultural.UsuarioRegistra = data['Data'][i].UsuarioRegistra;

          this.actividadesCulturales.push(actividadCultural);
        }

        this.dataSource.data = this.actividadesCulturales;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
      else {
        this.actividades = false;
      }
      
    });
  }

  obtenerEstado(estado: number){

    if (estado == 1) {
      return 'Registrado';
    } else if (estado == 2) {
      return 'En planeación';
    } else if (estado == 3) {
      return 'En ejecución';
    } else if (estado == 4) {
      return 'Finalizado';
    } else if (estado == 5) {
      return 'Cerrado';
    } else if (estado == 6) {
      return 'Suspendido';
    } else {
      return 'Cancelado';
    }

  }

  castearFecha(fecha: string){

    if(formatDate(fecha, 'yyyy-MM-dd', 'en') == '0001-12-31') {
      return 'No registra';
    } else {
      return formatDate(fecha, 'yyyy-MM-dd HH:mm', 'en');
    }
    
  }

  truncarContenido(texto: string, longitudMaxima: number): string {
    if (texto.length > longitudMaxima) {
      return texto.substring(0, longitudMaxima) + '...';
    } else {
      return texto;
    }
  }

  mostrarDialogo(id: number){

    let message = {idActividad: id};
      this.dialog.open( DialogoActividadesCulturalesComponent, {height: '1100px' ,width: '500px', data: {
        mensaje: message
      }});  
        
  }
  
}
