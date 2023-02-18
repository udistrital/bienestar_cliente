import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentoG } from '../../../@core/data/models/documento/documento_Gestion';
import { NbDateService } from '@nebular/theme';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../../@core/data/documento.service';
import { Subject } from 'rxjs/Subject';
import * as Nuxeo from 'nuxeo';
import { GestionService } from '../gestion-documental.service';
import { TipoDocumento } from '../../../@core/data/models/documento/tipo_documento';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-cargar',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.scss']
})
export class CargarComponent implements OnInit {

  @ViewChild('labelImport',{static: false})
  labelImport: ElementRef;

  // Estos datos se pueden traer de BD, para poder agregar mas
  tiposDocumento: String [] = ["Acta", "Resolución", "Comunicado", "Contrato"];
  

  // Para cargar a nuxeo
  documento: DocumentoG = new DocumentoG;
  private blobDocument$ = new Subject<[object]>();
  private blobDocument: object;
  private nuxeo: Nuxeo;
  
  // Para formularios
  private docForm: FormGroup;
  private control: FormControl;
  private validado: Boolean;
  private clickeado: Boolean;
  
  //Rango de fechas de la carga
  private min: Date;
  private max: Date;
  
  constructor(protected dateService: NbDateService<Date>, private gestionService: GestionService, private fb: FormBuilder) {
    gestionService= new GestionService;
    this.documento.TipoDocumento = new TipoDocumento;
    this.blobDocument = {};
    this.validado = true;
    this.clickeado= false;
    this.min = this.dateService.addYear(this.dateService.today(), -20);
    this.max = this.dateService.addMonth(this.dateService.today(), 1);
    this.iniciarFormulario();
  }

  iniciarFormulario(){
    this.docForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      titulo: ['', Validators.required] ,
      serie: ['', Validators.required] ,
      subSerie: ['', Validators.required],
      fecha:['', [Validators.required, this.checkDate(this.min,this.max, this.dateService) ]],
      descripcion: ['', Validators.required],
      archivo: ['', Validators.required]
    });
    //Fecha por defecto
    //this.docForm.get('fecha').setValue(this.dateService.format(this.dateService.today(),'dd/MM/yyyy'));
    this.docForm.get('fecha').setValue(this.dateService.today());
    //this.docForm.get('fecha').valid;
    console.log('valid:' + this.docForm.get('fecha').valid);
    this.docForm.controls.fecha.hasError('onRange');
    
  }

  checkDate(min: Date, max: Date, date: NbDateService<Date>){
    // Resta y suma un dia para que la validacion concuerde con el datapicker
    // min = date.addDay(min, -1);
    // max = date.addDay(max, 1);
    console.log(this);
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && !(date.isBetween(new Date(control.value),min, max) )) {
        return { 'onRange': true };
      }
      return null;
    };
  }

  ngOnInit() { }
  
  cargarFormulario(){
    // documento.TipoDocumento.Nombre se debe manejar por sistemas de OAS
    if( this.docForm.invalid || this.docForm.controls.fecha.invalid){
      this.validado= false;
      return;
    }
    this.documento.TipoDocumento.Nombre=this.docForm.get('tipoDocumento').value;
    this.documento.Nombre=this.docForm.get('titulo').value;
    this.documento.Serie=this.docForm.get('serie').value;
    this.documento.SubSerie=this.docForm.get('subSerie').value;
    this.documento.Fecha=this.docForm.get('fecha').value;
    this.documento.Descripcion=this.docForm.get('descripcion').value;
    this.documento.Archivo=this.docForm.get('archivo').value;
    console.log("carga realizandose...");
    /* this.gestionService.crearFolder();
    this.gestionService.crearDocumento(this.documento); */
    console.log("carga realizada");

    this.docForm.reset();
    this.labelImport.nativeElement.innerText = 'Seleccione Archivo';
    this.clickeado=false;
    this.validado=true;
  }

  // On file Select change placeholder
  onChange(files: FileList) {
    //this.documento.Archivo = event.target.files[0];
    this.labelImport.nativeElement.innerText= Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.documento.Archivo = files.item(0);
  }

  //validación de los inputs con caso especial de la fecha implementando validacion checkDate
  validateInput(input: string){
    if(input === 'fecha'){
      return (this.clickeado && this.docForm.controls[input].untouched) ||
      (this.docForm.controls[input].invalid && this.docForm.controls[input].touched && this.docForm.controls.fecha.hasError('onRange'));
    }else if(input === 'tipoDocumento'){
      return (this.clickeado && this.docForm.controls[input].invalid && !this.docForm.controls[input].dirty);
    }
    else{
      return (this.clickeado && this.docForm.controls[input].invalid && this.docForm.controls[input].untouched) ||
      (this.docForm.controls[input].invalid && this.docForm.controls[input].touched);
    } 
  }
}
