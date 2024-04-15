import { Component, OnInit, ViewChild,  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { CulturaService } from '../../../shared/services/cultura.service';
import { MatDialog,  } from '@angular/material/dialog';
import { GrupoCultural } from '../../../@core/data/models/cultura/grupo_cultural';
import { DialogoGruposCulturalesComponent } from './dialogo-grupos-culturales/dialogo-grupos-culturales.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort'; 
import { MatPaginator } from '@angular/material';
import { RolesConstanst } from '../../../shared/constants/roles.constants';
import { ListService } from '../../../@core/store/list.service';

@Component({
  selector: 'ngx-grupo-cultural',
  templateUrl: './grupo-cultural.component.html',
  styleUrls: ['./grupo-cultural.component.scss']
  
})
export class GrupoCulturalComponent implements OnInit {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private ListCultura: CulturaService,
              private dialog: MatDialog, 
              private router: Router,
              private route: ActivatedRoute,
              private test: ListService) { }

  grupos: boolean = true;

  gruposCulturales: GrupoCultural[] = [];

  dataSource = new MatTableDataSource();
  displayedColumns = ['Nombre', 'Estado', 'Descripcion', 'Acciones'];

  ROLES_CONSTANTS = RolesConstanst;
  rolesActivos: any = {};

  ngOnInit() {

    /*
    this.test.getInfoEstudiante().then((resp) => {
      console.log(resp);}
    )

    this.test.loadTerceroByWSO2('jgcastellanos').then((data) => {
      console.log(data);
    });

    if (this.route.snapshot.data['roles']) {
      for (const rol of this.route.snapshot.data['roles']) {
          this.rolesActivos[rol] = true;
      }
    }
    */
    this.obtenerGruposCulturales();

  }

  obtenerGruposCulturales(){

    console.log('Hola');
    console.log(this.route.snapshot);
    console.log(this.rolesActivos);

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

            const grupoCultural: GrupoCultural = new GrupoCultural();
            grupoCultural.Id = data['Data'][i].Id;
            grupoCultural.Nombre = data['Data'][i].Nombre;
            grupoCultural.Estado = data['Data'][i].Estado;
            grupoCultural.Descripcion = data['Data'][i].Descripcion;

            this.gruposCulturales.push(grupoCultural);
          }

          this.dataSource.data = this.gruposCulturales;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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

  castearEstado(estado: number){
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
