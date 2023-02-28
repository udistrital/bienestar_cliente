import { Component, EventEmitter, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { DocumentoG } from '../../../@core/data/models/documento/documento_Gestion';

@Component({
  selector: 'ngx-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
})
export class ResultadosComponent implements OnInit{

  private paginator: MatPaginator;
  private sort: MatSort;
 
  @Input() documentos: any [] = [];
  // Carga de MatPaginator y MatSort para que no sean undefine al iniciar el modulo
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatSort, { static: false }) set matSort(mp: MatSort) {
    this.sort = mp;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  dataSource: any;
  // TODO: Este se tomaria del servicio del OAS, validar
  columnas: string[]=[];

  constructor() { }


  ngOnInit(): void {
    this.documentos = []
    // inicializar dataSource para la tabla vació (evitar que sea undefine)
    this.dataSource = new MatTableDataSource<any>(this.documentos);
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort= this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    // Actualizar informacion luego de que documentos llegue de la consulta al servicio
    if (changes.documentos.currentValue != undefined){
      this.columnas=[];
      this.dataSource = new MatTableDataSource<any>(changes.documentos.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort= this.sort;
      this.obtenerColumnas();
    }
  }

  // Se añaden las columnas que se mostraran en la tabla de acuerdo a el primer elemento de los documentos
  obtenerColumnas(){
    let array = Object.entries(this.documentos[0]);
    array.forEach( element => {
      // Elimina las columnas que no son necesarias en la busqueda
      if(element[0] !== '_id' && element[0]!=='Id' && element[0]!=='Enlace')
        this.columnas.push(element[0]);
    });
    this.columnas.push('Ver');
    this.columnas.push('Editar');
  }
  
  // Evalua un documento y obtener el valor de una columna para mostrarlo en la tabla
  evaluar(documento, columna){
    let array = Object.entries(documento);
    for (let i= 0; i<array.length; i++) {
      if(array[i][0] === columna ){
        return array[i][1];
      }
    };
    return null;
  }
  
  //boton de visualizar documento en resultados    
  visualizar(documento){
    console.log("boton visualizar");
  }

  // boton de editar documento en resultados
  editar(documento){
    console.log("boton editar");
  }
}
