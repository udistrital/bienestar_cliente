import { ChangeDetectionStrategy } from '@angular/compiler/src/compiler_facade_interface';
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { ImplicitAutenticationService } from '../../../@core/utils/implicit_autentication.service';
import { AlertToastService } from '../alert-toast.service';
import { GestionService } from '../gestion-documental.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  private loading: boolean;
  private editandoDocumento: boolean;
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
      if(item){
        // Cuando se selecciona documento. Se agregan las opciones de la data que utilizará el menu
        this.matMenuTrigger.menuData = {opciones: ['Mover','Mover Aqui','Cambiar Nombre','Eliminar'],item: item};
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
  editarBoton(){
    this.editandoDocumento=true;
    this.editarElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
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
  async cargarDocumento(event, input: HTMLInputElement){
    // Si input no trae nada termina
    if(input[0]=== undefined)
      return;
    let id=this.rutaActual[this.rutaActual.length-1]['id'];
    await this.gestionService.crearDocumentoGestor(input[0], id, this.gestionService);
    await this.obtenerRepositorio(id);
    event.stopPropagation();
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
   * Asigna estilo al div del documetno seleccionado
   * @param posicion del documento seleccionado.
   * @param evento Evento del clic
   */
  seleccionDiv(posicion: Number, evento){
    console.log(evento.target.tagName);
    console.log('posicion: ' + posicion);
    // Al seleccionar checkbox se puede dar click en el span o en el label
    if((evento.target.tagName === 'SPAN' || evento.target.tagName === 'LABEL') && posicion !== -1){
      let check=document.getElementById(posicion.toString()) as HTMLInputElement;
      let divSelected=document.getElementById("file-item-"+posicion);
      if(check.checked){
        divSelected.classList.remove('file-item-select');
        // divSelected.classList.add('file-item');
      }else{
        // divSelected.classList.remove('file-item');
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
    // let checks=document.querySelectorAll("[id='"+posicion+"']") as NodeListOf<HTMLInputElement>;
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
  accionEditor(acciones){
    let accion=acciones.get('accion');
    if(accion==='guardar'){
      
    }
    console.log('realizando accion: ', acciones);
    console.log('documento: ', acciones.get('documento'));

    const docDefinition = {
      content: [
        {
          stack: [
            { text: 'My Document', style: 'header' },
            { html: acciones.get('documento') }
          ]
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }
      }
    };
    // const docDefinition = { content: [{ html: acciones.get('documento') }] };
   /*  const pdfDoc = pdfMake.createPdf(docDefinition); */
   const parser = new DOMParser();
    const doc = parser.parseFromString(acciones.get('documento'), 'text/html');
    console.log(doc.documentElement);
    const textContent = doc.documentElement.textContent;
   /* const pdfDoc = pdfMake.createPdf({
      content:  doc.documentElement
    }); */
    console.log(doc.documentElement.outerHTML);
    console.log(doc.documentElement.innerHTML);
    console.log(doc.documentElement.textContent);
    const pdfDoc = pdfMake.createPdf( {content: doc.documentElement.outerHTML});
    // Download the PDF document
   pdfDoc.download('my-document.pdf'); 

    // const blob = new Blob([acciones.get('documento')], { type: 'application/pdf' });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'archivo.pdf';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // window.URL.revokeObjectURL(url);
  }
}
