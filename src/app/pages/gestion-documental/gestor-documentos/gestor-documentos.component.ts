import { ChangeDetectionStrategy } from '@angular/compiler/src/compiler_facade_interface';
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { ImplicitAutenticationService } from '../../../@core/utils/implicit_autentication.service';
import { AlertToastService } from '../alert-toast.service';
import { GestionService } from '../gestion-documental.service';
import { ListService } from '../../../@core/store/list.service';

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
  @ViewChild('editar', { static: true }) editarElement: ElementRef;
  private autenticacion = new ImplicitAutenticationService;
  private rutaActual:[{id: any, nombre: any}]=[{id: '', nombre: ''}];
  private documentos: any=[];
  
//Variables del spinner
  private loading: boolean;
  private mensajeSpiner: string;
  
  private editandoDocumento: boolean;
  private documentosAMover: any[]=[];
  dialogRef: any;
  private documentoEditor: any=undefined;

  // we create an object that contains coordinates
  menuTopLeftPosition =  {x: 0, y: 0}
  
  constructor(private gestionService: GestionService, public toastrService: AlertToastService,
    private dialog: MatDialog, private listService: ListService) { }

  async ngOnInit() {
    // TODO: por ahora se toma el correo, se debe ver si cada usuario tiene algun identificador unico (Cedula, etc..)
    // Y ese sera el nombre de la carpeta en nuxeo
    let userName:string="";
    let intentos=0;

    let roles: any[]=[]
    
    await this.listService.getInfoEstudiante().then().then((resp) => {
      userName=resp.email;
      roles = resp.role;
    });
    
    if(roles.includes('FUNCIONARIO_DOCUMENTAL')){
        await this.obtenerRaiz(userName);
    }
    if(roles.includes('SUPERADMIN_DOCUMENTAL') ){
      this.rutaActual.pop();
      this.obtenerRaiz('');
    }
    this.editandoDocumento=false;
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
   * @param event: MouseEvent evento del mouseF
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
        this.matMenuTrigger.menuData = {opciones: ['Mover','Eliminar','Descargar'],};
        // we open the menu
        this.matMenuTrigger.openMenu();
    }
    event.stopPropagation();
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
      let opcionesMenu = ['Mover','Mover Aqui','Cambiar Nombre','Eliminar','Descargar']
      if(item){
        // Cuando se selecciona documento. Se agregan las opciones de la data que utilizará el menu
        // Cuando tiene extenciión html se agrega la opcion editar
        let nombreArchivo=!item.isFolder() ? item.properties['file:content']['name']: undefined;
        if(nombreArchivo != undefined && nombreArchivo.substring(nombreArchivo.lastIndexOf('.'), nombreArchivo.length) === '.html'){
          opcionesMenu.push('Editar');
          let opcionesMenuFiltradas=opcionesMenu;
          if(this.documentoEditor && item.uid===this.documentoEditor.uid){
            opcionesMenu.splice(opcionesMenu.indexOf('Eliminar'),1);
            opcionesMenu.splice(opcionesMenu.indexOf('Editar'),1);
            opcionesMenu.splice(opcionesMenu.indexOf('Cambiar Nombre'),1);
          }  
        }
        this.matMenuTrigger.menuData = {opciones: opcionesMenu,item: item};
          // Se abre el menu de acuerdo a las opciones e items
        this.matMenuTrigger.openMenu();
        let checks=document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
        checks.forEach(element =>{
          document.getElementById("file-item-"+element.id).classList.remove('file-item-select');
          element.checked = false;
        });      
      }else if(this.documentosAMover.length>0){
        
        //Cuando se selecciona fuera de calquier docuemto. Se agregan las opciones de la data que utilizará el menu
        this.matMenuTrigger.menuData = {opciones: ['Mover Aqui']};
        // Se abre el menu de acuerdo a las opciones e items
        this.matMenuTrigger.openMenu();
      }
      event.stopPropagation();
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
  abrirEditor(){
    this.editandoDocumento=true;
    this.editarElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: "end" });
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
   */
  async obtenerRepositorio(id, validar?){
    this.mensajeSpiner='Cargando repositorio..';
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
  async cargarDocumento(event, input: HTMLInputElement){
    this.mensajeSpiner='Creando documento..';
    this.loading=true;
    // Si input no trae nada termina
    if(input[0]=== undefined)
      return;
    let nombreOriginal=input[0].name; 
    let nombreCopia =this.crearNombreCopia(nombreOriginal);
    
    // Genera archivo con nuevo nombre si es necesario.
    let file = (nombreCopia !== nombreOriginal) ? new File([input[0]], nombreCopia, { type: input[0].type }): input[0]
    let id=this.rutaActual[this.rutaActual.length-1]['id'];
    await this.gestionService.crearDocumentoGestor(file, id, this.gestionService);
    await this.obtenerRepositorio(id);
    event.stopPropagation();
 
    // Limpia el target del evento (permite que change funcione cuando se van a cargar varios archivos)
    event.target.value=null;
    this.loading=false;
  }
  /**
   * Genera el nombre del documento, validando si ya existe en el
   * directorio o no.
   * @param nombreOriginal nombre original del archivo.
   * @return nombre del archivo, si ya existe agregara un numero al final del nombre.
   */
  crearNombreCopia(nombreOriginal){
    let nombreCopia=nombreOriginal;
    let copias=1;
    //Se cambia el nombre del nuevo archivo, si este ya existe
    while(this.existeNombre(nombreCopia,'File')){
      nombreCopia=nombreOriginal.substring(0, nombreOriginal.indexOf('.'))+
        '('+copias+')'+nombreOriginal.substring(nombreOriginal.lastIndexOf('.'), nombreOriginal.length);
      copias++;
    }
    return nombreCopia;
  }
  /**
   * Abre el template de nombre de carpeta a crear.
   */
  mostrarInputCrear(){
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
    if(nombreCarpeta!=='' && !this.existeNombre(nombreCarpeta, 'Folder')){
      let newId=await this.gestionService.crearFolder(nombreCarpeta,this.gestionService,this.rutaActual[this.rutaActual.length-1]['id']);
      this.rutaActual.push({id: newId,nombre: nombreCarpeta});
      this.obtenerRepositorio(newId);
      this.dialogRef.close();
    }else if(nombreCarpeta === ''){
      this.toastrService.mostrarAlerta('Ingrese un nombre para la carpeta.','warning');
    }else{
      this.toastrService.mostrarAlerta('Ya existe una carpeta con ese nombre','warning');
    }
  }
  /**
   * Valida si existe un archivo/carpeta con el mismo nombre.
   * @param nuevoNombre nombre del archivo/carpeta.
   * @param tipo tipo del archivo/carpeta ('File', 'Folder').
   * @return verdadero si ya existe, falso si no existe.
   */
  existeNombre(nuevoNombre: string, tipo: string){
    let existe=false;
    this.documentos.forEach(element => {
      if(element.type===tipo && element.title===nuevoNombre){
        existe=true;
      }
    });
    return existe;
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
   * Descargar elementos
   * @param item? documento a descargar si se han seleccionado uno/varios 
   */
  async descargar(item?){
    let seleccionados=[];
    // Si viene item, se dio clic derecho a un documento
    if(item){
      if(!item.isFolder()){  
        //Descarga el archivo
        item.fetchBlob().then(async function (blob) {
          await blob.blob().then(function (responseblob) {
            let url = URL.createObjectURL(responseblob);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(responseblob);
            link.download = item.title;
            link.click();
          });
        });
      }else{
        this.gestionService.crearZip([item]);
      }
    // Si no viene item, la descarga se realiza sobre algunos documentos seleccionados
    }else{
      let checks=document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
      checks.forEach(element =>{
        if(element.checked){
          seleccionados.push(element.id);
        }
      });
      if(seleccionados.length==0){
        this.gestionService.toastrService.mostrarAlerta('No ha seleccionado ningún elemento');
        return;
      }
      let documentosSeleccionados=[];
      for(let i=0;i<seleccionados.length;i++){
        let id=parseInt(seleccionados[i]);
        documentosSeleccionados.push(this.documentos[id]);
      }
      await this.gestionService.crearZip(documentosSeleccionados);
    }
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
        this.documentosAMover.forEach( (documento, index)=>{
          if(this.documentos[id].uid===documento.uid){
            this.documentosAMover.splice(index,1);
          }
        });
      }
    // individual Si se selecciona uno o mas documentos
    }else{
      await this.gestionService.eliminarElementoGestor(item.uid,this.gestionService);
      this.documentosAMover.forEach( (documento, index)=>{
        if(item.uid===documento.uid){
          this.documentosAMover.splice(index,1);
        }
      });
    }
    this.obtenerRepositorio(this.rutaActual[this.rutaActual.length-1]['id']);
    if(this.dialogRef)
      this.dialogRef.close();
  }
  /**
   * Cambia el nombre del elemento seleccionado por el valor ingresado
   * @param item? documento al que se le cambiara el nombre
   */
  async cambiarNombre(item){
    let nombre=(document.getElementsByName('nombreCambiar')[0] as HTMLInputElement).value;
    if(!nombre){
      this.gestionService.toastrService.mostrarAlerta('Nombre vacio','warning');
      return;
    }
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
      this.documentos.forEach( (documento,index)=>{
        if(documento.uid === item.uid){
          let select = document.getElementById('file-item-'+index) as HTMLDivElement;
          select.classList.add('file-item-select');
          let input = document.getElementById(index) as HTMLInputElement;
          input.checked = true;
        }
      });
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
   * Mueve el documeto al directorio seleccionado, si hay un documento almacenado
   * para ser movido.
   */
  async moverAqui(documento?){
    let idPadre: any;
    this.mensajeSpiner='Moviendo elemento/s..';
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
  /**
   * Asigna un icono deacuerdo a la extension del archivo por medio de la clase
   * @param nombreArchivo nombre del documento.
   */
  obtenerIcono(nombreArchivo: String){
    let extension = nombreArchivo.substring(nombreArchivo.lastIndexOf('.'), nombreArchivo.length);
    let clase: string = "fas ";
    function comparation(text){
       return text.indexOf(extension.toLowerCase()) > -1
    };
    switch(true){
      case comparation('.pdf'):
        return clase + 'fa-file-pdf text-danger' 
      break;
      case comparation(['.ini', '.cfg' , '.conf', '.txt']):
        return clase + 'fa-file-alt text-secondary' 
      break;
      case comparation(['.xlsx', '.xls', '.ods']):
        return clase +'fa-file-excel text-success' 
      break;
      case comparation(['.docx', '.doc', '.odt', '.rtf']):
        return clase + 'fa-file-word text-blue' 
      break;
      case comparation(['.pptx', '.ppt', '.odp']):
        return clase + 'fa-file-powerpoint text-orange' 
      break;
      case comparation(['jpg', '.png', '.gif', '.bmp']):
        return clase + 'fa-file-image text-secondary' 
      break;
      case comparation(['.mp4', '.avi', '.wmv', '.mov']):
        return clase + 'fa-file-video text-secondary'
      break;
      case comparation(['.mp3', '.wav', '.wma', '.aac']):
        return clase + 'fa-file-audio text-secondary'
      break;
      case comparation(['.zip', '.rar', '.7z']):
        return clase + 'fa-file-archive text-warning'
      break;
      case comparation(['.js', '.html', '.htm', '.css', '.ts', '.py' , '.java', '.cs', '.rb', '.php', '.json', '.xml', '.sql']):
        return clase + 'fa-file-code text-secondary'
      break;
      default:
        return clase + 'fa-file text-secondary'
    }
  }
  /**
   * Asigna estilo al div del documento seleccionado
   * @param posicion del documento seleccionado.
   * @param evento Evento del clic
   */
  seleccionDiv(posicion: Number, evento){
    // Al seleccionar checkbox se puede dar click en el span o en el label
    if((evento.target.tagName === 'SPAN' || evento.target.tagName === 'LABEL') && posicion !== -1){
      let check=document.getElementById(posicion.toString()) as HTMLInputElement;
      let divSelected=document.getElementById("file-item-"+posicion);
      if(check.checked){
        divSelected.classList.remove('file-item-select');
      }else{
        divSelected.classList.add('file-item-select');
      }
    }else if(evento.target.tagName === 'DIV' && posicion !== -1){
      let checks=document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
      checks.forEach(element =>{
        let selected=document.getElementById("file-item-"+element.id);
        if(element.id !== posicion.toString()){
          element.checked = false;
          selected.classList.remove('file-item-select');
        }else{
          element.checked = true;
          selected.classList.add('file-item-select');
        }
      });
    }else if (evento.target.tagName !== 'INPUT'){
      let checks=document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
      checks.forEach(element =>{
        let selected=document.getElementById("file-item-"+element.id);
          element.checked = false;
          selected.classList.remove('file-item-select');
      });
    }
    evento.stopPropagation();
  }
  /**
   * Gerena un texto para el toltip de doumentos a mover
   * @return Texto con los documentos seleccionados a mo
   */
  textoSeleccionados(): string{
    let texto='';
    this.documentosAMover.forEach(documento=>{
      texto=texto+' \n '+documento.title;
    });
    return 'Documentos a mover: '+texto;
  }
  /**
   * Abre el editor desde el menu cargado en un documento editable
   * @param documento: documento que se cargará en el editor, viene del data del menu
   */
  editarDocumento(documento){
    this.documentoEditor=documento;
    this.abrirEditor();
  }
  /**
   * Realiza acciones por medio del emit del editor
   * @param acciones: mapa que contiene la acción, el documento a guardar/eliminar/actualizar y el contenido del documento
   */
  async accionEditor(acciones){
    let accion=acciones.get('accion');
    //Si da click en Cancelar
    if(accion==='cancelar'){
      this.editandoDocumento=false;
      this.documentoEditor=undefined;
      return;
    }else if(acciones.get('documento') && this.obtenerRepositorio(acciones.get('documento').uid, true)=== undefined){
      this.gestionService.toastrService.mostrarAlerta('El documento no existe', 'danger');
      return;
    }
    this.mensajeSpiner='Modificando documento..';
    this.loading=true;
    //Si da click en Guardar
    if(accion==='guardar'){
      let blob = new Blob([acciones.get('contenido')],{type: 'text/plain'});
      // Si existe acciones.get('documento'), se esta editando un documento existente
      if(acciones.get('documento')){
        await this.gestionService.actualizarDocumentoGestor(blob,acciones.get('nombre')+'.html',acciones.get('documento'),this.gestionService);
      }else{
        let file = new File([blob],this.crearNombreCopia(acciones.get('nombre')+'.html'),{type: 'text/plain'});
        await this.gestionService.crearDocumentoGestor(file,this.rutaActual[this.rutaActual.length-1]['id'],this.gestionService)
      }
      this.obtenerRepositorio(this.rutaActual[this.rutaActual.length-1]['id']);
    }
    //Si da click en Eliminar
    if(accion =='eliminar'){
      this.eliminar(acciones.get('documento'));
    }
    this.editandoDocumento=false;
    this.documentoEditor=undefined;

    this.loading=false;
    setTimeout(() => {
      // Your code here
    }, 2000);
  }
}
