import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-grupo-cultural',
  templateUrl: './grupo-cultural.component.html',
  styleUrls: ['./grupo-cultural.component.scss']
})
export class GrupoCulturalComponent implements OnInit {

  constructor() { }

  grupos: boolean;
  grupos_culturales = [{nombre: 'La Tuna UD', estado: 'Activo', descripcion: 'Grupo universitario musical'},
                        {nombre: 'Grupo Danzas UD', estado: 'Inactivo', descripcion: 'Grupo universitario de danzas'},
                        {nombre: 'Parranda Vallenata', estado: 'Pendiente', descripcion: 'Grupo universitario musical'} ];
  /*data = {'Data' : {
    nombre: 'La Tuna UD',
    estado: 'Activo',
    description:'Este es un grupo perteneciente a la UD'
  }}*/

  columnas = ['nombre', 'estado', 'descripcion'];

  ngOnInit() {
    
    //this.grupos_culturales.push(this.data['Data'][0]);
    this.obtenerGrupos();
  }

  obtenerGrupos(){
    if (this.grupos_culturales.length < 1) {
      this.grupos = false;
    } else {
      this.grupos = true;
    }
    
  }
}
