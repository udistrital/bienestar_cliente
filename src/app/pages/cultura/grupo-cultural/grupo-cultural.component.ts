import { Component, OnInit,  } from '@angular/core';
import { CulturaService } from '../../../shared/services/cultura.service';
import { MatDialog,  } from '@angular/material/dialog';
import { DialogoGruposCulturalesComponent } from './dialogo-grupos-culturales/dialogo-grupos-culturales.component';

@Component({
  selector: 'ngx-grupo-cultural',
  templateUrl: './grupo-cultural.component.html',
  styleUrls: ['./grupo-cultural.component.scss']
  
})
export class GrupoCulturalComponent implements OnInit {

  constructor(private ListCultura: CulturaService, private dialog: MatDialog) { }

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
            this.grupos_culturales = [...this.grupos_culturales, {id: data['Data'][i].Id, nombre: data['Data'][i].Nombre, 
                                    estado: data['Data'][i].Estado, descripcion: data['Data'][i].Descripcion}];
          }
        }
        else {
          this.grupos = false 
        }
      
    });
  }

  mostrarDialogo(){
    let message = {nombre: 'Tuna UD', estado: 'Activo'};
    this.dialog.open( DialogoGruposCulturalesComponent, {width: '400px', data: {
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
