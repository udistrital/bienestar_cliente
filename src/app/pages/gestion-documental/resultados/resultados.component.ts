import { Component, EventEmitter, HostListener, Input, OnInit, Pipe, PipeTransform, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NbGlobalLogicalPosition, NbToastrService, NbWindowRef, NbWindowService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { DocumentoGestion } from '../../../@core/data/models/documento/documento_Gestion';
import { GestionService } from '../gestion-documental.service';

@Component({
  selector: 'ngx-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
})

export class ResultadosComponent implements OnInit{

  // Paginas y organizacion de la tabla de resultados
  private paginator: MatPaginator;
  private sort: MatSort;

  private visualizando =false;
  private editando=false;
  private urlSafe: SafeResourceUrl;
  private descripcion: any;
  private documentoEditar: any;
  private nombreArchivo: any;
 
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
  @ViewChild('visualizarDoc',{ static: false }) vizualizarDocTemplate: TemplateRef<HTMLElement>;
  @ViewChild('editarDoc',{ static: false }) editarDocTemplate: TemplateRef<HTMLElement>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    let height = window.innerHeight;
    let width = window.innerWidth;
    let frame = document.getElementById('iframe');
    let hostElement= document.getElementById('containerEditar');
    // Modifica el alto de el contenedor de comonente cargar (cuando se edita)
    if(hostElement){  
      hostElement.style.display='block';
      hostElement.style.height=(height-height*0.3)+ 'px';
    }

    // Modifica el alto y ancho del iframe de visualizar
    if(frame){
      frame.style.height = 
      (height-height*0.3)+ 'px';
      frame.style.width  = 
      (width-width*0.1)+'px';
    }
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  dataSource: any;
  // TODO: Este se tomaria del servicio del OAS, validar
  columnas: string[]=[];

  private windowRef: any;

  constructor(
    private gestionService: GestionService, 
    private sanitizer: DomSanitizer,
    private windowService: NbWindowService){}


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
    if (this.documentos.length !== 0){
      let array = Object.entries(this.documentos[0]);
      array.forEach( element => {
        // Elimina las columnas que no son necesarias en la busqueda
        if(element[0] !== '_id' && element[0]!=='Id' && element[0]!=='Enlace')
          this.columnas.push(element[0]);
      });
      this.columnas.push('Ver');
      this.columnas.push('Editar');
    }
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
  
  // Carga el documento para ser vizualizado    
  async visualizar(documento){

    let array = Object.entries(documento);
    let url: any;
    let id: any;
    let titulo;
    //Obtener id de nuxeo para traer el documento
    array.forEach(dato=>{
      if(dato[0]==='Id'){
        id=dato[1];
      }
      if(dato[0]==='Nombre'){
        titulo=dato[1];
      }
      if(dato[0]=='Descripcion'){
        this.descripcion=dato[1];
      }
    });
    url = await this.gestionService.obtenerDocumento(id, this.gestionService);
    // Volver la url segura para Angular
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.visualizando=true;

    this.windowRef=this.windowService.open(
      this.vizualizarDocTemplate,
      { title: titulo, hasBackdrop: true, closeOnEsc: false},
    );
  }

  // Recibe el tipo de accion y el documento
  // Si se esta actualizado, modifica los datos en la tabla de busqueda por los actualizados
  // Cierra la ventana
  completarEdicion(mapa){
    let documento =mapa.get('documento');
    if(mapa.get('acciones')==='actualizando'){
      let dato = this.dataSource.filteredData.find(element => element['_id'] === documento.IdApi);
      for (const[clave, valor] of Object.entries(documento)){
        // IdApi no se actualiza, es el id asignado por la base de datos
        if(clave !== 'IdApi')
          dato[clave] = valor;
      }
    }else{
      this.dataSource.filteredData.splice(
        this.dataSource.filteredData.findIndex(
          element => element['_id'] === documento.IdApi
        ), 1
      );
    }
    this.windowRef.close();
  }

  // boton de editar documento en resultados
  async editar(documento){
    let array = Object.entries(documento);
    let titulo, id;
    array.forEach(dato=>{
      if(dato[0]==='Nombre'){
        titulo=dato[1];
      }
      if(dato[0]==='Id'){
        id=dato[1];
      }
    });
    this.nombreArchivo = await this.gestionService.obtenerNombreDocumento(id, this.gestionService);
    this.editando=true;
    this.documentoEditar=documento;
    this.windowRef=this.windowService.open(
      this.editarDocTemplate,
      { title: 'Editando '+titulo, hasBackdrop: true, closeOnEsc: false},
    );
  }
}
