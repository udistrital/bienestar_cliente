import { Component, OnInit, ViewChild,  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CulturaService } from '../../../shared/services/cultura.service';
import { MatDialog,  } from '@angular/material/dialog';
import { GrupoCultural } from '../../../@core/data/models/cultura/grupo_cultural';
import { DialogoGruposCulturalesComponent } from './dialogo-grupos-culturales/dialogo-grupos-culturales.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort'; 

@Component({
  selector: 'ngx-grupo-cultural',
  templateUrl: './grupo-cultural.component.html',
  styleUrls: ['./grupo-cultural.component.scss']
  
})
export class GrupoCulturalComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private ListCultura: CulturaService, private dialog: MatDialog, private router: Router) { }

  grupos: boolean;

  gruposCulturales: any[] = [];
  dataSource = new MatTableDataSource();
  columnas = ['Nombre', 'Estado', 'Descripcion', 'Acciones'];

  ngOnInit() {

    this.obtenerGruposCulturales();
    this.dataSource.data = this.gruposCulturales;
    this.dataSource.sort = this.sort;
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

            let grupoCultural: GrupoCultural = new GrupoCultural();
            grupoCultural.Id = data['Data'][i].Id;
            grupoCultural.Nombre = data['Data'][i].Nombre;
            grupoCultural.Estado = data['Data'][i].Estado;
            grupoCultural.Descripcion = data['Data'][i].Descripcion;

            this.gruposCulturales.push(grupoCultural);
          }

          console.log(this.gruposCulturales);

        }
        else {
          this.grupos = false 
        }
      
    });
  }

  truncarContenido(texto: string, longitudMaxima: number): string {
    if (texto.length > longitudMaxima) {
      return texto.substring(0, longitudMaxima) + '...'; 
    } else {
      return texto;
    }
  }

  convertirNumEstado(estado: number){
    if (estado == 1) {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }

  mostrarDialogo(id: number){
    let message = {idGrupo: id};
    this.dialog.open( DialogoGruposCulturalesComponent, {height: '1100px' ,width: '500px', data: {
      mensaje: message
    }});
  }

}
