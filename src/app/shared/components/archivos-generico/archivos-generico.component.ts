import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentoService } from '../../../@core/data/documento.service';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';

@Component({
  selector: 'ngx-archivos-generico',
  templateUrl: './archivos-generico.component.html',
  styleUrls: ['./archivos-generico.component.scss']
})
export class ArchivosGenericoComponent implements OnInit, OnChanges {
  @Input() nombreInput: any;
  @Input() campoCodigo: any;
  @Input() campoValor: any;
  @Input() servicio: any;
  @Input() metodo: any;
  @Input() parametros: any;
  @Input() grupo: FormGroup;
  @Input() validar: any;
  @Input() etiqueta: any;
  @Input() requerido = false;
  @Input() modelo: any;
  @Input() codigoDocumento: any;
  @Input() documentos: any = [];
  @Input() documentosCargados: any;
  @Input() deshabilitarUpload = false;
  @Input() mostrarResubir = false;
  @Output() modeloChange = new EventEmitter<any>();
  @Output() documentosChange = new EventEmitter<any>();
  @Output() descargarArchivo = new EventEmitter<any>();
  @Output() eventoErrorInput = new EventEmitter<any>();

  mostrar: any = {};

  constructor(public nuxeoService: NuxeoService, public documentoService: DocumentoService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes.grupo) {
      this.grupo.addControl(this.nombreInput, new FormControl(''));
    }
    this.setValidators();
    if(changes.validar){
      this.inputTieneErrores();
    }
    this.mostrarDescargar();
  }

  setValidators() {
    let validators: any = [];
    if (this.requerido && !this.mostrarResubir) {
      validators.push(Validators.required);
    }
    if(this.requerido && this.mostrarResubir){
      validators = [];
    }
    this.grupo.get(this.nombreInput).setValidators(validators);
  }

  mostrarDescargar() {
    this.mostrar = 'subir';
    if (this.documentosCargados && this.documentosCargados[this.nombreInput]) {
      this.mostrar = 'descargar';
    }
    if(this.mostrarResubir && this.documentosCargados[this.nombreInput]){
      this.mostrar = 'resubir';
    }
  }


  onFileSelectedDownload() {
    this.documentosCargados[this.nombreInput].key = this.nombreInput;
    this.descargarArchivo.emit(this.documentosCargados[this.nombreInput]);
  }

  inputTieneErrores() {
    this.grupo.get(this.nombreInput).updateValueAndValidity();
    if(this.grupo.get(this.nombreInput).invalid && this.grupo.get(this.nombreInput).dirty || (this.validar && this.grupo.get(this.nombreInput).invalid && this.documentosCargados[this.nombreInput]===null)){
      this.eventoErrorInput.emit(true);
    }
  }

  archivoEsRequerido(): any{
    if(this.mostrarResubir){
      return false;
    }
    return this.requerido;
  }

  onFileSelected(event) {
    let file = event.target.files[0];
    let fileTemporal: any = {};
    fileTemporal.nombre = file.name;
    fileTemporal.IdDocumento = this.codigoDocumento;
    fileTemporal.file = file;
    fileTemporal.key = this.nombreInput;
    if (!this.documentos) {
      this.documentos = [];
    }
    this.inputTieneErrores();
    this.documentos.push(fileTemporal);
    this.documentosChange.emit(this.documentos);
  }
}
