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

  actividades: boolean;

  actividadesCulturales: any[] = [];
  displayedColumns: string[] = ['Nombre', 'Descripcion', 'Estado',  'FechaInicio', 'FechaFin', 'UsuarioRegistra', 'Acciones'];

  constructor(private ListCultura: CulturaService, 
    private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.obtenerActividadesCulturales();
  }

  obtenerActividadesCulturales(){
    this.ListCultura.getActividadesCulturales().subscribe((data) => {
      
      if (JSON.stringify(data['Data'][0]) != '{}') {
        this.actividades = true;
        for (let i in data['Data']){

          let estado = this.obtenerEstado(data['Data'][i].Estado);
          let fechaInicio = this.castearFecha(data['Data'][i].FechaInicio);
          let fechaFin = this.castearFecha(data['Data'][i].FechaFin);
          this.actividadesCulturales = [...this.actividadesCulturales, 
                                      {Id: data['Data'][i].Id, 
                                      Nombre: data['Data'][i].Nombre, 
                                      Descripcion: data['Data'][i].Descripcion,
                                      Estado: estado,
                                      FechaInicio: fechaInicio,
                                      FechaFin: fechaFin,
                                      UsuarioRegistra: data['Data'][i].UsuarioRegistra, 
                                      }];
        }
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

  mostrarDialogo(id: number, estado: string){
    console.log(estado);
    let message = {idActividad: id};
    if(estado == 'Registrado'){
      this.dialog.open( DialogoActividadesCulturalesComponent, {height: '700px' ,width: '500px', data: {
        mensaje: message
      }});
    } else {
      this.dialog.open( DialogoActividadesCulturalesComponent, {height: '1100px' ,width: '500px', data: {
        mensaje: message
      }});
    }
    
  }
  
}
