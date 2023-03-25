import { ChangeDetectionStrategy } from '@angular/compiler/src/compiler_facade_interface';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { ImplicitAutenticationService } from '../../../@core/utils/implicit_autentication.service';
import { AlertToastService } from '../alert-toast.service';
import { GestionService } from '../gestion-documental.service';

@Component({
  selector: 'ngx-gestor-documentos',
  templateUrl: './gestor-documentos.component.html',
  styleUrls: ['./gestor-documentos.component.scss']
})


export class GestorDocumentosComponent implements OnInit {
  @ViewChild( MatMenuTrigger, {static: true} ) matMenuTrigger: MatMenuTrigger;
  @ViewChild('input',{ static: true }) inputTemplate : TemplateRef<any>;
  
  private autenticacion = new ImplicitAutenticationService;
  private rutaActual: string[]=[];
  private documentos: any=[];
  private opciones=['Mover','Renombrar','Copiar','Eliminar'];
  private loading: boolean;
  
  dialogRef: any;

  // we create an object that contains coordinates
  menuTopLeftPosition =  {x: 0, y: 0}
  
  constructor(private gestionService: GestionService, public toastrService: AlertToastService,private dialog: MatDialog
    , private crd: ChangeDetectorRef) { }

  ngOnInit() {
    // TODO: por ahora se toma el correo, se debe ver si cada usuario tiene algun identificador unico (Cedula, etc..)
    // Y ese sera el nombre de la carpeta en nuxeo
    let userName=this.autenticacion.getPayload().sub.split('@').shift().toLowerCase();
    this.obtenerRepositorio(userName);
    this.rutaActual.push(userName);
    this.gestionService.toastrService.mostrarAlerta('Repositorio obtenido','success');
  }

  /**
   * Abre el menu al presionar clic para las obciones adicionales 
   * del gestor
   *
   * @param event: MouseEvent evento del mouse
   */
  onClick(event: MouseEvent){
    // preventDefault evita que se muestre el menu del navegador
    event.preventDefault();
     // Almacena la posicion del mouse
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;
    // Se agregan las opciones de la data que utilizará el menu
    this.matMenuTrigger.menuData = {opciones: this.opciones,};
    // we open the menu
    this.matMenuTrigger.openMenu();
    
  }
  
  /**
   * Modifica la ruluta, para ir a un derectorio previo
   *
   * @param posicion la posicion a la cual se regresar
   */
  backRute(posicion){
    this.rutaActual=this.rutaActual.slice(0,posicion+1);
    this.obtenerRepositorio(this.crearPath());
  }
  
  /**
   * Modifica la ruluta, para ir a un derectorio seleccionado
   *
   * @param ruta directorio al cual se dirije
   */
  forwardRute(ruta){
    this.rutaActual.push(ruta);
    this.obtenerRepositorio(this.crearPath());
  }

  /**
   * Abre el menu al presionar clic derecho sobre un elemnto del repositorio 
   * del funcionanrio
   *
   * @param event: MouseEvent evento del mouse
   * @param item Objeto Document del folder o el file
   */
  onRightClick(event: MouseEvent, item) {
    // preventDefault evita que se muestre el menu del navegador
    event.preventDefault();
    // Almacena la posicion del mouse
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;
    // Se agregan las opciones de la data que utilizará el menu
    this.matMenuTrigger.menuData = {opciones: this.opciones,item: item};
    // Se abre el menu
    this.matMenuTrigger.openMenu();
}

  /**
   * Obtiene los documentos nuxeo del directorio enviado
   * selected for upload.
   *
   * @param path Ruta de la cual se obtiene el repositorio
   * @param validar? Parametro opcional, si viene solo valida si un folde existe 
   * @return verdadero si existe el directorio y falso si no ex
   * */
  async obtenerRepositorio(path, validar?){
    this.loading=true;
    let respuesta= await this.gestionService.obtenerDirectorio(path,this.gestionService,validar);
    let existe = await respuesta.get('existe');
    if(existe && !validar){
      //Si existe el directorio y no se esta validando, se reemplaza el contenido de documentos
      this.documentos=await respuesta.get('valores');
    }else if (!validar){
      //Si no se esta validando y no existe el directorio, se crea un nuevo directorio
      this.toastrService.mostrarAlerta('Creando repositorio');
      this.gestionService.crearFolder(path,this.gestionService);
    }
    // Se retorna la comprobación del directorio
    this.loading=false;
     return await existe;
  }
  /**
   * Crea un nuevo documento en la carpeta actual
   *
   * @param input input del documento a cargar
   */
  async cargarDocumento(input: HTMLInputElement){
    // Si input no trae nada termina
    if(input[0]=== undefined)
      return;
    await this.gestionService.crearDocumentoGestor(input[0], this.rutaActual, this.gestionService);
    await this.obtenerRepositorio(this.crearPath());
  }

  // Abre el template de nombre de carpeta a crear
  mostarInput(){
    this.dialogRef = this.dialog.open(this.inputTemplate,
      { hasBackdrop: true, autoFocus: true, disableClose: true});
  }

  async crearFolder(){
    let nombre=(document.getElementsByName('nombre')[0] as HTMLInputElement).value;
    let existeFolder = await this.obtenerRepositorio(this.crearPath()+'/'+nombre, true)
    if(nombre!=='' && !existeFolder){
      await this.gestionService.crearFolder(nombre,this.gestionService,this.crearPath());
      this.rutaActual.push(nombre);
      this.obtenerRepositorio(this.crearPath());
      this.dialogRef.close();
    }else if(nombre === ''){
      this.toastrService.mostrarAlerta('Ingrese un nombre para la carpeta.','warning')
    }else{
      this.toastrService.mostrarAlerta('Ya existe una carpeta con ese nombre','warning')
    }
  }
  /**
   * Crea un string concatenado con los elementos de rutaActual
   *
   * @return El string con la ruta concatenada y separada por '/'
   */
  crearPath(){
    return this.rutaActual.join('/');
  }

  /**
   * Cierra la ventana de dialogo
   * 
   */
  cancelar(){
    this.dialogRef.close();
  }
}
