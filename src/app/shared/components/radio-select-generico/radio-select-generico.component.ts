import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-radio-select-generico',
  templateUrl: './radio-select-generico.component.html',
  styleUrls: ['./radio-select-generico.component.scss']
})
export class RadioSelectGenericoComponent implements OnInit, OnDestroy, OnChanges {
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
  @Input() deshabilitado = false;
  @Output() modeloChange = new EventEmitter<any>();
  @Output() eventoErrorInput = new EventEmitter<any>();

  subscriptor: any = {};

  objetos = [];


  constructor() { }

  ngOnInit(): void {
    this.obtenerData();
  }

  ngOnChanges(changes: any){
    if (changes.grupo) {
      this.grupo.addControl(this.nombreInput, new FormControl(''));
    }
    if (changes.servicio) {
      this.obtenerData();
    }
    if (changes.parametros) {
      this.obtenerData();
    }
    if(changes.validar){
      this.inputTieneErrores();
    }
    this.setValidatorsInput(changes);
  }


  setValidatorsInput(changes: any) {
    const validators: any = [];
    if(this.requerido){
      validators.push(Validators.required);
    }
    this.grupo.get(this.nombreInput).setValidators(validators);
  }


  obtenerData(){
    if(this.servicio){
      this.subscriptor.combo = this.servicio[this.metodo](this.parametros).subscribe((res)=>{
        this.objetos = res;
      },
      (error)=>{
  
      });
    }
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