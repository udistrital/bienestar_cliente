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
  @ViewChild('inputCrear',{ static: true }) inputCrearCarpeta : TemplateRef<any>;
  @ViewChild('aviso',{ static: true }) avisoTemplate : TemplateRef<any>;
  @ViewChild('inputCambiar',{ static: true }) inputCambiarNombre : TemplateRef<any>;
  private autenticacion = new ImplicitAutenticationService;
  private rutaActual:[{id: any, nombre: any}]=[{id: '', nombre: ''}];
  private documentos: any=[];
  private loading: boolean;
  private documentosAMover: any[]=[];
  dialogRef: any;

  // we create an object that contains coordinates
  menuTopLeftPosition =  {x: 0, y: 0}
  
  constructor(private gestionService: GestionService, public toastrService: AlertToastService,private dialog: MatDialog
    , private crd: ChangeDetectorRef) { }

  ngOnInit() {
    // TODO: por ahora se toma el correo, se debe ver si cada usuario tiene algun identificador unico (Cedula, etc..)
    // Y ese sera el nombre de la carpeta en nuxeo
    let userName:string=this.autenticacion.getPayload().sub.split('@').shift().toLowerCase();
    this.obtenerRaiz(userName);
    /* await new Promise(resolve => setTimeout(resolve, 10000)); */
  }

  async obtenerRaiz(userName){
    let respuesta=await this.gestionService.obtenerDirectorioByPath(userName,this.gestionService);
    let id=respuesta.get('id')
    if (id){
      this.documentos=await respuesta.get('valores');
      this.rutaActual[0]={id: respuesta.get('id'),nombre: userName};
      this.gestionService.toastrService.mostrarAlerta('Repositorio obtenido','success');
    }else{
      //Si no existe el directorio, se crea un nuevo directorio para el usuario
      this.toastrService.mostrarAlerta('Creando repositorio');
      let newId=await this.gestionService.crearFolder(userName,this.gestionService);
      this.rutaActual[0]={id: newId,nombre: userName};
    }
  }

  /**
   * Abre el menu al presionar clic para las obciones adicionales 
   * del gestor
   * @param event: MouseEvent evento del mouse
   */
  onClick(event: MouseEvent){
    let seleccion: boolean=false;
    let checks=document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
    checks.forEach(element =>{
      if(element.checked)
        seleccion=true
    });
    if(seleccion){
        // preventDefault evita que se muestre el menu del navegador
        event.preventDefault();
        // Almacena la posicion del mouse
        this.menuTopLeftPosition.x = event.clientX;
        this.menuTopLeftPosition.y = event.clientY;
        // Se agregan las opciones de la data que utilizará el menu
        this.matMenuTrigger.menuData = {opciones: ['Mover','Eliminar'],};
        // we open the menu
        this.matMenuTrigger.openMenu();
    }  
    
    
  }
    /**
   * Abre el menu al presionar clic derecho sobre un elemnto del repositorio 
   * del funcionanrio.
   * @param event: MouseEvent evento del mouse
   * @param item Objeto Document del folder o el file
   */
    onRightClick(event: MouseEvent, item?) {
      // preventDefault evita que se muestre el menu del navegador
      event.preventDefault();
      // Almacena la posicion del mouse
      this.menuTopLeftPosition.x = event.clientX;
      this.menuTopLeftPosition.y = event.clientY;
      if(item){
        // Cuando se selecciona documento. Se agregan las opciones de la data que utilizará el menu
        this.matMenuTrigger.menuData = {opciones: ['Mover','Mover Aqui','Cambiar Nombre','Eliminar'],item: item};
        // Se abre el menu de acuerdo a las opciones e items
        this.matMenuTrigger.openMenu();
        let checks=document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
        checks.forEach(element =>{
          element.checked = false;
        });      
      }else if(this.documentosAMover.length>0){
        
        //Cuando se selecciona fuera de calquier docuemto. Se agregan las opciones de la data que utilizará el menu
        this.matMenuTrigger.menuData = {opciones: ['Mover Aqui']};
        // Se abre el menu de acuerdo a las opciones e items
        this.matMenuTrigger.openMenu();
      }

  }
  /**
   * Modifica la ruluta, para ir a un derectorio previo.
   * @param posicion la posicion a la cual se regresar
   */
  backRute(posicion){
    for(let i=this.rutaActual.length-1; i>posicion; i--){
      this.rutaActual.pop();
    }
    this.obtenerRepositorio(this.rutaActual[posicion]['id']);
  }

  desabilitarClicDerecho(event: MouseEvent):void{
    event.preventDefault();
    event.stopPropagation();
  }
  
  /**
   * Modifica la ruluta, para ir a un derectorio seleccionado.
   * @param documento Objeto Document que se selecciono
   */
  forwardRute(documento){
    this.rutaActual.push({id: documento.uid, nombre: documento.title});
    this.obtenerRepositorio(documento.uid);
  }

  /**
   * Obtiene los documentos nuxeo del directorio enviado.
   * @param id id del repositorio 
   * @param validar? Parametro opcional, si viene solo valida si un folde existe 
   * @return verdadero si existe el directorio y falso si no ex
   * */
  async obtenerRepositorio(id, validar?){
    this.loading=true;
    let respuesta= await this.gestionService.obtenerDirectorioByID(id,this.gestionService,validar);
    if(respuesta!==undefined && !validar){
      //Si existe el directorio y no se esta validando, se reemplaza el contenido de documentos
      this.documentos=await respuesta;
    }
    // Se retorna la comprobación del directorio
    this.loading=false;
     return await respuesta;
  }
  /**
   * Crea un nuevo documento en la carpeta actual.
   * @param input input del documento a cargar
   */
  async cargarDocumento(input: HTMLInputElement){
    // Si input no trae nada termina
    if(input[0]=== undefined)
      return;
    let id=this.rutaActual[this.rutaActual.length-1]['id'];
    await this.gestionService.crearDocumentoGestor(input[0], id, this.gestionService);
    await this.obtenerRepositorio(id);
  }

  /**
   * Abre el template de nombre de carpeta a crear.
   */
  mostarInputCrear(){
    this.dialogRef = this.dialog.open(this.inputCrearCarpeta,
      { hasBackdrop: true, autoFocus: true, disableClose: true});
  }

  /**
   * Abre template para cambiar nombre de elementos.
   */
  mostarInputCambiar(itemCambiar: Document){
    let dato ={
      item: itemCambiar,
    }
    this.dialogRef = this.dialog.open(this.inputCambiarNombre,
      {data: dato, hasBackdrop: true, autoFocus: true, disableClose: true});
    let input=document.getElementById('nombreCambiar') as HTMLInputElement;
    input.value=itemCambiar.title;
    input.setSelectionRange(0,itemCambiar.title.lastIndexOf('.'));
  }

  /**
   * Ejecuta una ventana de dialogo pra validar si se desea eliminar.
   */
  validarEliminar(itemEliminar){
    let dato ={
      item: itemEliminar,
    }
    this.dialogRef = this.dialog.open(this.avisoTemplate,
      {data: dato, hasBackdrop: true, autoFocus: true, disableClose: true});
  }
  /**
   * Crea una carpeta con el nombre asignad
   */
  async crearFolder(){
    let nombreCarpeta=(document.getElementsByName('nombreCarpeta')[0] as HTMLInputElement).value;
    let respuesta = await this.gestionService.obtenerDirectorioByPath(this.crearPath()+'/'+nombreCarpeta,this.gestionService,true);
    if(nombreCarpeta!=='' && respuesta['id']===undefined){
      let newId=await this.gestionService.crearFolder(nombreCarpeta,this.gestionService,this.rutaActual[this.rutaActual.length-1]['id']);
      this.rutaActual.push({id: newId,nombre: nombreCarpeta});
      this.obtenerRepositorio(newId);
      this.dialogRef.close();
    }else if(nombreCarpeta === ''){
      this.toastrService.mostrarAlerta('Ingrese un nombre para la carpeta.','warning')
    }else{
      this.toastrService.mostrarAlerta('Ya existe una carpeta con ese nombre','warning')
    }
  }
  /**
   * Crea un string concatenado con los nombres de rutaActual
   *
   * @return El string con la ruta concatenada y separada por '/'
   */
  crearPath(){
    let nombres=[];
    this.rutaActual.forEach(element=>{ 
      nombres.push(element['nombre']);
    })
    return nombres.join('/');
  }

  /**
   * Cierra la ventana de dialogo
   */
  cancelar(){
    this.dialogRef.close();
  }

  /**
   * Eliminar uno o varios documentos
   * @param item? documento a eliminar si se han seleccionado uno/varios 
   */
  async eliminar(item?){
    let seleccionados=[];
    // Menu general, si se selecciona uno o mas documentos
    if(!item){
      let checks=document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
      checks.forEach(element =>{
        if(element.checked){
          seleccionados.push(element);
        }
      });
      if(seleccionados.length==0){
        this.gestionService.toastrService.mostrarAlerta('No ha seleccionado ningún elemento');
        return;
      }
      for(let i=0;i<seleccionados.length;i++){
        let id=parseInt(seleccionados[i].id);
        await this.gestionService.eliminarElementoGestor(
          this.documentos[id].uid,this.gestionService);
      }
    // individual Si se selecciona uno o mas documentos
    }else{
      await this.gestionService.eliminarElementoGestor(item.uid,this.gestionService);
    }
    this.obtenerRepositorio(this.rutaActual[this.rutaActual.length-1]['id']);
    this.dialogRef.close();
  }
  /**
   * Cambia el nombre del elemento seleccionado por el valor ingresado
   * @param item? documento al que se le cambiara el nombre
   */
  async cambiarNombre(item){
    let nombre=(document.getElementsByName('nombreCambiar')[0] as HTMLInputElement).value;
    await this.gestionService.actualizarNombre(item, nombre,this.gestionService);
    this.dialogRef.close();
    this.obtenerRepositorio(this.rutaActual[this.rutaActual.length-1]['id']);
  }
  /**
   * Abrir documento seleccionado
   * @param documento? documento que se quiere visualizar
   */
  async verDocumento(documento){
    let url = await this.gestionService.obtenerDocumento(documento.uid,this.gestionService);
    /* this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url); */
    window.open(url);
  }
  /**
   * Almacena el documento que se selecciona para ser movido.
   * @param item? documento que se quiere mover.
   */
  moverGuardar(item?){
    this.documentosAMover=[];
    if(!item){
      let checks=document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
      checks.forEach(element =>{
        if(element.checked){
          this.documentosAMover.push(this.documentos[parseInt(element.id)]);
        }
      });
      if(this.documentosAMover.length==0){
        this.gestionService.toastrService.mostrarAlerta('No ha seleccionado ningún elemento');
        return;
      }
    // individual Si se selecciona uno o mas documentos
    }else{
      this.documentosAMover.push(item);
    }
  }
  /**
   * Valida que el id recibido no se encuentre dentro de los elementos
   * a mover, para no permitir mover una carpeta a si misma
   * @param id id del documento donde se quiere mover.
   * @return 'true' si no hay coincidencias y 'false' existe
   */
  validarMover(id){
    for(let i=0;i<this.documentosAMover.length;i++){
      if(id==this.documentosAMover[i].uid){
        return false;
      }
    }
    return true;
  }

  /**
   * MMueve el documeto al directorio seleccionado, si hay un documento almacenado
   * para ser movido.
   */
  async moverAqui(documento?){
    let idPadre: any;
    this.loading=true;
    if(documento){
      idPadre=documento.uid;
    }else{
      idPadre=this.rutaActual[this.rutaActual.length-1]['id'];
    }
    for(let i=0;i<this.documentosAMover.length;i++){
      await this.gestionService.moverDocumento(idPadre,this.documentosAMover[i].uid,this.gestionService);
    }
    //donde lo quere mover
    await this.obtenerRepositorio(this.rutaActual[this.rutaActual.length-1]['id']);
    this.documentosAMover=[];
    this.loading=false;
  }
}
