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
import { cloneDeep } from 'lodash';

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
  private facultades=['ASAB','Ingeníera','Medioambiente y recursos naturales', 'Tecnológica','Ciencias y educación'];

  // Para cargar a nuxeo
  documento: DocumentoGestion = new DocumentoGestion;
  private documentoMostrar: any;
  private file: File;
  // Para formularios
  private docForm: FormGroup;
  private formReferencia:any;
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
    this.iniciarFormulario();
  }


  /**
   * Inicia el formulario con las validaciones,
   * si se esta editando un documento cargara los datos de este 
   */
  async iniciarFormulario(){
    //Inicializar el formulario
    this.initForm();
    this.tiposDocumento = await this.gestionService.consultarTiposDocumento(this.documentoService);
    this.docForm.controls.fecha.hasError('onRange');
    //Si se esta editando un documento se carga la informacion que este tenga en el formulario
    if(this.editando && this.documentoEditar!==undefined){
      // Un bug causa que el nb-select no se actualice, por lo que se usa setTimeout para que funcione
      this.docForm.get('nombre').setValue(this.documentoEditar.Nombre);
      this.docForm.get('fecha').setValue(this.documentoEditar.Metadatos.Fecha);
      this.docForm.get('descripcion').setValue(this.documentoEditar.Descripcion);
      this.docForm.get('serie').setValue(this.documentoEditar.Metadatos.Serie);
      this.docForm.get('subSerie').setValue(this.documentoEditar.Metadatos.SubSerie);
      this.docForm.get('facultad').setValue(this.documentoEditar.Metadatos.Facultad);
      setTimeout(() => {
        this.docForm.get('tipoDocumento').setValue(this.documentoEditar.TipoDocumento.Id);
        this.formReferencia = cloneDeep(this.docForm);
      }, 0);
    }
    else{
      // Asigna la fecha actual si se esta cargando un nuevo documento
      this.docForm.get('fecha').setValue(new Date().toISOString().split('T')[0]);
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
    
    //Editando documento
    if(this.editando){
      if(this.docForm.dirty){
        this.prepararDocumento(this.documentoEditar);
        this.gestionService.actualizarDocumento(this.documentoEditar,this.file,
          this.gestionService,this.documentoService, this.archivoCambiado);
      }
      // Actualizando documento
    }else{
      this.prepararDocumento(this.documento);
      this.initForm();
      this.labelUpoadFile.nativeElement.innerText = 'Seleccione Archivo';
      this.resultadosElement.nativeElement.scrollIntoView({ behavior: 'smooth' });

      this.documentoMostrar = await this.gestionService.crearDocumento(this.file,this.documento,this.gestionService,this.documentoService);
      this.documentoMostrar.TipoDocumento.Nombre=Object.keys(this.tiposDocumento).
        find(valor => this.tiposDocumento[valor]===this.documentoMostrar.TipoDocumento.Id);
      this.documentoMostrar=[this.documentoMostrar];
      this.clickeado=false;
      this.validado=true;
      this.archivoCambiado=false;
      this.loading=false;
    }
  }
  
  /**
   * Prepara el documento para ser editado.
   */
  prepararDocumento(doc){
    doc.TipoDocumento.Id=this.docForm.get('tipoDocumento').value;
    doc.Nombre=this.docForm.get('nombre').value;
    doc.Descripcion=this.docForm.get('descripcion').value;
    doc.Activo=true;
    let usuario=  new ImplicitAutenticationService;
    let nomUsuario;
    let autentificando=true;
    while(autentificando){
      if(usuario.getPayload().sub){
        nomUsuario=usuario.getPayload().sub;
        autentificando=false;
      }
    }
    let registro:any={};
    let info='';
    if(this.editando){
      //Recorre los cambios realizados por medio del form control
      Object.keys(this.docForm.controls).forEach(key => {
        if(this.docForm.controls[key].dirty){
          // Si se realiza un cambio en un campo se añade un log del cambio
          if(this.docForm.controls[key].value!==this.formReferencia.controls[key].value){
            if(key==='tipoDocumento'){
              const valorDespues=Object.keys(this.tiposDocumento).find(valor => this.tiposDocumento[valor]===this.docForm.controls[key].value);
              const valorAntes=Object.keys(this.tiposDocumento).find(valor => this.tiposDocumento[valor]===this.formReferencia.controls[key].value)
              info=info+key+'('+valorAntes + ' por '+
              valorDespues+'), ';
            }else if(key==='archivo'){
              info=info+' Se actualizo el archivo,';
            }else{
              info=info+key+'('+this.docForm.controls[key].value + ' por '+
              this.formReferencia.controls[key].value+'), ';
            }
          }
        }
      });
      registro=doc.Metadatos.Registros;
      //Se crea el registro utilizando la fecha como llave
      registro[new Date().toString()]=nomUsuario +' ha actualizado el documento en los campos: '+info;
    }else{
      registro[new Date().toString()]=nomUsuario +' ha creado el documento';
    }
    let metadatos = {
      Uploader: nomUsuario,
      Serie: this.docForm.get('serie').value,
      SubSerie: this.docForm.get('subSerie').value,
      Fecha:this.docForm.get('fecha').value,
      Facultad:this.docForm.get('facultad').value,
      Registros: registro
    }
    doc.Metadatos=JSON.stringify(metadatos);
  }

   /**
   * Ejecuta una ventana de dialogo pra validar si se desea eliminar
   */ 
  validarEliminar(){
    let dato ={
      accion: 'eliminando',
      nombre: this.documento.Nombre,
    }
    this.dialogRef = this.dialog.open(this.avisoTemplate,
      { data: dato, hasBackdrop: true, autoFocus: true, disableClose: true});
  }
  initForm(){
    this.docForm=this.fb.group({
      tipoDocumento: ['', Validators.required],
      nombre: ['', Validators.required] ,
      serie: ['', Validators.required] ,
      subSerie: ['', Validators.required],
      fecha:['', Validators.required],
      descripcion: ['', Validators.required],
      archivo: ['', Validators.required],
      facultad: [[],Validators.required]
    });
  }

  /**
   * Ejecuta una ventana de dialogo pra validar si se desea actualizar
   */  
  validarActualizar(){
    let dato ={
      accion: 'actualizando',
      nombre: this.documento.Nombre,
    }
    this.dialogRef = this.dialog.open(this.avisoTemplate,
      { data: dato, hasBackdrop: true, autoFocus: true, disableClose: true});
  }
  
  /** 
   * Si se da "Si" en la ventana de dialogo se continuar eliminando/actualizando
  */
  aceptar(accion){
    if(accion === 'actualizando'){
      this.cargarFormulario();
    }else{
      this.eliminarDocumento();
    }
    this.dialogRef.close();
    let mapa =new Map;
    if(!this.docForm.dirty){
      mapa.set('acciones', 'cancelar');
    }else{
      mapa.set('acciones', accion);
    }
    mapa.set('documento',this.documentoEditar);
    this.terminarEvent.emit(mapa);
  }

  //Eliminar registro del documento en nuxeo  api/base de datos
  eliminarDocumento(){
    this.gestionService.eliminarDocumento(this.documentoEditar, this.gestionService, this.documentoService)
  }

  //abrir documento cargado
  async verDocumento(){
    let url = await this.gestionService.obtenerDocumento(this.documentoEditar.Enlace,this.gestionService);
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
