import { Component, OnInit,  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CulturaService } from '../../../shared/services/cultura.service';
import { MatDialog,  } from '@angular/material/dialog';
import { DialogoGruposCulturalesComponent } from './dialogo-grupos-culturales/dialogo-grupos-culturales.component';

@Component({
  selector: 'ngx-grupo-cultural',
  templateUrl: './grupo-cultural.component.html',
  styleUrls: ['./grupo-cultural.component.scss']
  
})
export class GrupoCulturalComponent implements OnInit {

  constructor(private ListCultura: CulturaService, private dialog: MatDialog, private router: Router) { }

  grupos: boolean;

  grupos_culturales: any[] = [];
  columnas = ['nombre', 'estado', 'descripcion', 'acciones'];

  ngOnInit() {

    this.obtenerGruposCulturales();
  }

  obtenerGruposCulturales(){
    this.ListCultura.getGruposCulturales().subscribe((data) => {

        if (JSON.stringify(data['Data'][0]) != '{}') {
          this.grupos = true;
          for (let i in data['Data']){
            let estado = '';
            if (data['Data'][i].Estado == 1){
              estado = 'Activo';
            } else {
              estado = 'Inactivo';
            }
            this.grupos_culturales = [...this.grupos_culturales, {id: data['Data'][i].Id, nombre: data['Data'][i].Nombre, 
                                    estado: estado, descripcion: data['Data'][i].Descripcion}];
          }
        }
        else {
          this.grupos = false 
        }
      
    });
  }

  truncarContenido(texto: string, longitudMaxima: number): string {
    if (texto.length > longitudMaxima) {
      return texto.substring(0, longitudMaxima) + '...'; // Agrega elipsis (...) si el texto se truncó
    } else {
      return texto;
    }
  }

  mostrarDialogo(id: number){
    let message = {idGrupo: id};
    this.dialog.open( DialogoGruposCulturalesComponent, {height: '1100px' ,width: '500px', data: {
      mensaje: message
    }});
  }

  /*
  mostrarDialogo(id:any){
    for (let i in this.grupos_cultural){
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
  }*/
}
