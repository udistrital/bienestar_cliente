import { Component, EventEmitter, HostListener, Input, OnInit, Pipe, PipeTransform, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NbGlobalLogicalPosition, NbToastrService, NbWindowRef, NbWindowService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { DocumentoGestion } from '../../../@core/data/models/documento/documento_Gestion';
import { GestionService } from '../gestion-documental.service';
import { DocumentoService } from '../../../@core/data/documento.service';

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
  private loading=false;
  private facultades: any;
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
  @ViewChild('visualizarDoc',{ static: false }) vizualizarDocTemplate: TemplateRef<any>;
  @ViewChild('editarDoc',{ static: false }) editarDocTemplate: TemplateRef<HTMLElement>;
  @ViewChild('aviso',{ static: true }) avisoTemplate : TemplateRef<any>;

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
      (height-height*0.4)+ 'px';
      frame.style.width  = 
      100+'%';
    }
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  dataSource: any;
  // TODO: Este se tomaria del servicio del OAS, validar
  columnas: string[]=['Nombre','Descripcion','Serie',
  'SubSerie','Fecha','Facultad','Ver','Editar'];

  private windowRef: any;

  constructor(
    private gestionService: GestionService, 
    private sanitizer: DomSanitizer,
    private windowService: NbWindowService,
    private dialog: MatDialog,
    private documentoService: DocumentoService){}


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
      this.dataSource = new MatTableDataSource<any>(changes.documentos.currentValue);
      this.dataSource.paginator = this.paginator;
      // Se sobrescribe la funcion nativa de MatTableDataSource para las columnas de los datos
      // que esta en Metadatos se puedan ordenar
      this.dataSource.sortingDataAccessor = (item, property) => {
        if(property==='Nombre' || property==='Descripcion'){ 
          return item[property];
        }else{
          return item.Metadatos[property];
        }
      };
      this.dataSource.sort= this.sort;
    }
  }

  // Evalua un documento y obtener el valor de una columna para mostrarlo en la tabla
  evaluar(documento, columna){
    if(columna!='Nombre'&& columna!='Descripcion'){
      return documento.Metadatos[columna];
    }else{
      return documento[columna];
    }
  }
   
  /**
   * Carga el documento para ser vizualizado
   * @param documento Documento a visualizar
   */    
  async visualizar(documento){
    this.loading=true;
    let url: any;
    //Obtener id de nuxeo para traer el documento
    url = await this.gestionService.obtenerDocumento(documento.Enlace, this.gestionService);
    // Volver la url segura para Angular
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.visualizando=true;
    this.loading=false;
    this.windowRef=this.dialog.open(
      this.vizualizarDocTemplate,
      { data: documento, 
        hasBackdrop: true, 
        autoFocus: true, 
        disableClose: false, 
        width:'90%',
        height:'100%',
        panelClass: 'my-dialog',}
    );
  }

  
  /**
   * Recibe el tipo de accion y el documento
   * Si se esta actualizado, modifica los datos en la tabla de busqueda por los actualizados
   * Cierra la ventana
   * @param mapa 
   */
  completarEdicion(mapa){
    let documento =mapa.get('documento');
    const accion=mapa.get('acciones')
    if(accion==='cancelar'){
      this.windowRef.close();
      return;
    }
    if(accion==='actualizando'){
      /* if(typeof documento.Metadatos ===  JSON) */
      documento.Metadatos=JSON.parse(documento.Metadatos);
      let dato = this.dataSource.filteredData.find(element => element['Id'] === documento.Id);
      dato=documento;
    }else{
      this.dataSource.filteredData.splice(
        this.dataSource.filteredData.findIndex(
          element => element['Id'] === documento.Id
        ), 1
      );
    }
    this.windowRef.close();
  }
  
  /**
   * Boton de editar documento en resultados
   * @param documento 
   */
  async editar(documento){
    try{
      this.nombreArchivo=undefined;
      let titulo=documento.Nombre;
      this.nombreArchivo = await this.gestionService.obtenerNombreDocumento(documento.Enlace, this.gestionService);
      this.editando=true;
      this.documentoEditar=documento;
      this.windowRef=this.windowService.open(
        this.editarDocTemplate,
        { title: 'Editando '+titulo, hasBackdrop: true, closeOnEsc: false},
      );
    }catch (error){
      if(!this.nombreArchivo){
        this.windowRef = this.dialog.open(this.avisoTemplate,
          {data: documento,hasBackdrop: true, autoFocus: true, disableClose: true});
      }
    }
  }

  /**
   * Al dar si en el cuadro de dialogo (No se encontto docuemnto en nuxeo)
   * se continua con la eliminacion de el registro en API OAS
   * @param documento 
   */
  aceptar(documento){
    console.log(documento);
    this.gestionService.deletDocumento(documento,this.documentoService);
    this.dataSource.filteredData.splice(
      this.dataSource.filteredData.findIndex(
        element => element['Id'] === documento.Id
      ), 1
    );
    this.windowRef.close()
  }
}