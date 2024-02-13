import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { CulturaService } from '../../../shared/services/cultura.service';

@Component({
  selector: 'ngx-grupo-cultural',
  templateUrl: './grupo-cultural.component.html',
  styleUrls: ['./grupo-cultural.component.scss']
})
export class GrupoCulturalComponent implements OnInit {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  constructor(private ListCultura: CulturaService) { }

  grupos: boolean;
  grupos_culturales: any[] = [];
  /*grupos_culturales = [{id: 1, nombre: 'La Tuna UD', estado: 'Activo', descripcion: 'Grupo universitario musical'},
                        {id: 2, nombre: 'Grupo Danzas UD', estado: 'Inactivo', descripcion: 'Grupo universitario de danzas'},
                        {id: 3, nombre: 'Parranda Vallenata', estado: 'Pendiente', descripcion: 'Grupo universitario musical'} ];
  */
  
  columnas = ['nombre', 'estado', 'descripcion'];

  ngOnInit() {

    this.obtenerGruposCulturales();
  }

  obtenerGruposCulturales(){
    this.ListCultura.getGruposCulturales().subscribe((data) => {

        if (JSON.stringify(data['Data'][0]) != '{}') {
          this.grupos = true;
          for (let i in data['Data']){
            this.grupos_culturales = [...this.grupos_culturales, {id: data['Data'][i].Id, nombre: data['Data'][i].Nombre, 
                                    estado: data['Data'][i].Estado, descripcion: data['Data'][i].Descripcion}];
          }
        }
        else {
          this.grupos = false 
        }
      
    });
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
