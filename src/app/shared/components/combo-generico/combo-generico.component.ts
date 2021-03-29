import { Component, OnInit, OnDestroy, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-combo-generico',
  templateUrl: './combo-generico.component.html',
  styleUrls: ['./combo-generico.component.scss']
})
export class ComboGenericoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() nombreInput: any;
  @Input() campoCodigo: any;
  @Input() campoValor: any;
  @Input() servicio: any;
  @Input() metodo: any;
  @Input() parametros: any;
  @Input() grupo: FormGroup;
  @Input() validar: any = false;
  @Input() etiqueta: any;
  @Input() mostrarSeleccione = true;
  @Input() requerido = false;
  @Input() deshabilitado = false;
  @Input() esAnidado = false;
  @Input() camposValorAnidado = [];
  @Input() modelo: any;
  @Input() campoListado: any;
  @Output() modeloChange = new EventEmitter<any>();
  @Output() eventoErrorInput = new EventEmitter<any>();
  subscriptor: any = {};

  objetos = [];
  opcionSeleccione = {};


  constructor() { }

  ngOnInit(): void {
    this.obtenerData();
  }

  ngOnChanges(changes: any){
    if (changes.grupo) {
      this.grupo.addControl(this.nombreInput, new FormControl(null));
    }
    if (changes.servicio) {
      this.obtenerData();
    }
    if (changes.parametros) {
      this.obtenerData();
    }
    if (changes.requerido) {
      this.grupo.get(this.nombreInput).setValidators([Validators.required]);
    }
    if (changes.modelo){
      this.setModelo();
    }
    if(changes.validar){
      this.inputTieneErrores();
    }
  }


  

  obtenerData(){
    if(this.servicio){
      this.subscriptor.combo = this.servicio[this.metodo](this.parametros).subscribe((res)=>{
        this.objetos = (this.campoListado ? res[this.campoListado] : res);
        this.setModelo();
      },
      (error)=>{
  
      });
    }
  }

  setModelo() {
    if(this.modelo){
      this.grupo.get(this.nombreInput).setValue(this.modelo);
    }
  }

  emitirModelo(evento){
    this.modelo = evento;
    if(this.modelo!==''){
      this.modeloChange.emit(this.modelo);
    }
    this.inputTieneErrores();
  }

  obtenerDatoAnidado(elemento){
    if(elemento){
      let dato: any = elemento;
      for(const campo of this.camposValorAnidado){
        dato = dato[campo];
      }
      return dato;
    }
    return '';
  }

  inputTieneErrores() {
    this.grupo.get(this.nombreInput).updateValueAndValidity();
    if(this.grupo.get(this.nombreInput).invalid && this.grupo.get(this.nombreInput).dirty || this.validar && this.grupo.get(this.nombreInput).invalid){
      this.eventoErrorInput.emit(true);
    }
  }

  ngOnDestroy(){
    Object.keys(this.subscriptor).forEach((key)=>{
      this.subscriptor[key].unsubscribe();
    })
  }

}
