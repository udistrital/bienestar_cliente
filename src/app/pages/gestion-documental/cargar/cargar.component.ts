import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DocumentoGestion } from '../../../@core/data/models/documento/documento_Gestion';
import { NbDateService, NbDialogService, NbWindowService } from '@nebular/theme';
import { DocumentoService } from '../../../@core/data/documento.service';
import { GestionService } from '../gestion-documental.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiRestService } from '../api-rest.service';
import { MatDialog } from '@angular/material';
import { ImplicitAutenticationService } from '../../../@core/utils/implicit_autentication.service';
import { TipoDocumento } from '../../../@core/data/models/documento/tipo_documento';

@Component({
  selector: 'ngx-cargar',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.scss'],
})
export class CargarComponent implements OnInit {

  @ViewChild('labelUpoadFile',{static: false}) labelUpoadFile: ElementRef;
  @ViewChild('aviso',{ static: true }) avisoTemplate : TemplateRef<any>;
  @ViewChild('resultados', { static: true }) resultadosElement: ElementRef;
  
  // Cuando se esta cargando el formulario para editar
  @Input() documentoEditar: any;
  @Input() editando: Boolean;
  @Input() nombreArchivo: any;
  @Output() terminarEvent = new EventEmitter<Map<string,any>>();

  // Estos datos se traen de BD, para poder agregar mas
  private tiposDocumento: { [key: string]: Number };
  private facultades=['ASAB','Ingeníera','Medioambiente y recursos naturales', 'Tecnológica','Ciencias y educación',]

  // Para cargar a nuxeo
  documento: DocumentoGestion = new DocumentoGestion;
  private documentoMostrar: any;
  private file: File;
  // Para formularios
  private docForm: FormGroup;
  private control: FormControl;
  private validado: Boolean;//saber cuando el formulario es validado
  private clickeado: Boolean;//Saber cuando el boton de subir es oprimido para las validaciones
  private archivoCambiado: Boolean;
  private loading: Boolean;
  
  //Rango de fechas de la carga
  private min: Date;
  private max: Date;

  dialogRef: any;
  
  constructor(protected dateService: NbDateService<Date>, private gestionService: GestionService,
     private fb: FormBuilder, private apiRestService: ApiRestService, private dialog: MatDialog
     ,private host: ElementRef<HTMLElement>, private documentoService: DocumentoService) {

    // this.documento.TipoDocumento = new TipoDocumento;
    this.validado = true;
    this.clickeado= false;
    this.archivoCambiado=false;
    this.min = this.dateService.addYear(this.dateService.today(), -20);
    this.max = this.dateService.addMonth(this.dateService.today(), 1);
  }

  ngOnInit() {
    this.documento.TipoDocumento=new TipoDocumento;
    this.obtenerTiposDocumentos();
    this.iniciarFormulario();
  }

  async obtenerTiposDocumentos(){
    this.tiposDocumento = await this.gestionService.consultarTiposDocumento(this.documentoService);
  }

  /**
   * Inicia el formulario con las validaciones,
   * si se esta editando un documento cargara los datos de este 
   */
  iniciarFormulario(){
    this.docForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      nombre: ['', Validators.required] ,
      serie: ['', Validators.required] ,
      subSerie: ['', Validators.required],
      fecha:['', Validators.required],
      descripcion: ['', Validators.required],
      archivo: ['', Validators.required],
      facultad: ['',Validators.required]
    });
    //Asignar fecha por defecto
    //this.docForm.get('fecha').setValue(this.dateService.today());
    //this.docForm.get('fecha').valid;
    this.docForm.controls.fecha.hasError('onRange');
    if(this.editando && this.documentoEditar!==undefined){
      //****** pendiente, al editar documento *****/
      /* this.documento=this.gestionService.convertirDocumento(this.documentoEditar); */
      this.docForm.get('nombre').setValue(this.documento.Nombre);
      this.docForm.get('fecha').setValue(this.documento.FechaCreacion);
      this.docForm.get('descripcion').setValue(this.documento.Descripcion);
      /* this.docForm.get('serie').setValue(this.documento.Serie);
      this.docForm.get('subSerie').setValue(this.documento.SubSerie);
      this.docForm.get('tipoDocumento').setValue(this.documento.Tipo); */
    }
  }
  
  /**
   * Permite subir/modificar formulario a nuxeo y Api Documentos OAS
   */
  async cargarFormulario(){
    this.loading=true;
    // documento.TipoDocumento.Nombre se debe manejar por sistemas de OAS
    if( this.docForm.invalid || this.docForm.controls.fecha.invalid ){
      this.validado= false;
      this.loading=false;
      return;
    }
    this.documento.TipoDocumento.Id=this.docForm.get('tipoDocumento').value;
    this.documento.Nombre=this.docForm.get('nombre').value;
    this.documento.Descripcion=this.docForm.get('descripcion').value;
    this.documento.Activo=true;
    let usuario=  new ImplicitAutenticationService;
    let metadatos = {
      Uploader: usuario.getPayload().sub,
      Serie: this.docForm.get('serie').value,
      SubSerie: this.docForm.get('subSerie').value,
      Fecha:this.docForm.get('fecha').value,
      Facultad:this.docForm.get('facultad').value
    }
    this.documento.Metadatos=JSON.stringify(metadatos);
    
    //Editando documento
    if(this.editando){
      if(this.docForm.dirty){
        this.gestionService.actualizarDocumento(this.documento,this.gestionService,this.apiRestService, this.archivoCambiado);
      }
      // Actualizando documento
    }else{
      let documentoCreado = await this.gestionService.crearDocumento(this.file,this.documento,this.gestionService,this.documentoService);
      this.docForm.reset();
      this.labelUpoadFile.nativeElement.innerText = 'Seleccione Archivo';
      this.resultadosElement.nativeElement.scrollIntoView({ behavior: 'smooth' });

      this.clickeado=false;
      this.validado=true;
      this.archivoCambiado=false;
      this.loading=false;
    }
    /*  this.documentoMostrar= await [this.gestionService.convertirADiccionario(documentoCreado)]; */
      //Se agrega manualmente el id para no agregarel _id (id del API) convertirADiccionario() pues para el PUT agregaria una nueva 
     /*  this.documentoMostrar[0]['_id'] =  documentoCreado.IdApi; */
      // Moverse automaticamente al resultado
  }

  // Ejecuta una ventana de dialogo pra validar si se desea eliminar
  validarEliminar(){
    let dato ={
      accion: 'eliminando',
      nombre: this.documento.Nombre,
    }
    this.dialogRef = this.dialog.open(this.avisoTemplate,
      { data: dato, hasBackdrop: true, autoFocus: true, disableClose: true});
  }

  // Ejecuta una ventana de dialogo pra validar si se desea actualizar
  validarActualizar(){
    let dato ={
      accion: 'actualizando',
      nombre: this.documento.Nombre,
    }
    this.dialogRef = this.dialog.open(this.avisoTemplate,
      { data: dato, hasBackdrop: true, autoFocus: true, disableClose: true});
  }
  
  // Se ejecuta si se desea continuar eliminando/actualizando
  aceptar(accion){
    if(accion === 'actualizando'){
      this.cargarFormulario();
    }else{
      this.eliminarDocumento();
    }
    this.dialogRef.close();
    console.log('emiter objeto:',this.terminarEvent);
    if(this.docForm.dirty){
      let mapa =new Map;
      mapa.set('acciones', accion);
      mapa.set('documento',this.documento);
      this.terminarEvent.emit(mapa);
    }else{
      let mapa =new Map;
      mapa.set('acciones', accion);
      mapa.set('documento',this.documento);
      this.terminarEvent.emit(mapa);
    }
  }

  // Se ejecuta si no se continua eliminando/actualizando
  denegar(){
    this.dialogRef.close();
  }
  //Eliminar registro del documento en nuxeo  api/base de datos
  eliminarDocumento(){
    this.gestionService.eliminarDocumento(this.documento, this.gestionService, this.apiRestService)
  }

  //abrir documento cargado
  async verDocumento(){
    let url = await this.gestionService.obtenerDocumento(this.documento.Id,this.gestionService);
    /* this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url); */
    window.open(url);
  }

  // On file Select change placeholder
  onChange(files: FileList) {
    //this.documento.Archivo = event.target.files[0];
    this.labelUpoadFile.nativeElement.innerText= Array.from(files)
      .map(f => f.name)
      .join(', ');
      this.file= files.item(0);
    this.archivoCambiado=true;
  }

  //validación de los inputs con caso especial de la fecha implementando validacion checkDate
  invalidInput(input: string){
    if(input === 'archivo' && this.editando){
      this.docForm.get(input).clearValidators();
      this.docForm.get(input).updateValueAndValidity();
      return false;
    }else if(input === 'tipoDocumento' || input === 'facultad'){
      return (this.clickeado && this.docForm.controls[input].invalid && !this.docForm.controls[input].dirty);
    }else{
      return (this.clickeado && this.docForm.controls[input].invalid && this.docForm.controls[input].untouched) ||
      (this.docForm.controls[input].invalid && this.docForm.controls[input].touched);
    } 
  }
}
