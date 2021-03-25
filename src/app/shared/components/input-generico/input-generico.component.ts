import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-input-generico',
  templateUrl: './input-generico.component.html',
  styleUrls: ['./input-generico.component.scss']
})
export class InputGenericoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() nombreInput: any;
  @Input() grupo: FormGroup;
  @Input() validar: any;
  @Input() etiqueta: any;
  @Input() mostrarSeleccione = true;
  @Input() patron: any;
  @Input() tipo: any;
  @Input() requerido = false;
  @Input() deshabilitado = false;
  @Input() modelo: any;
  @Output() modeloChange = new EventEmitter<any>();
  subscriptor: any = {};

  objetos = [];
  opcionSeleccione = {};


  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes: any){
    if (changes.grupo) {
      this.grupo.addControl(this.nombreInput, new FormControl(''));
    }
    this.setValidatorsInput(changes);
  }

  setValidatorsInput(changes: any) {
    const validators: any = [];
    if(changes.patron){
      validators.push(Validators.pattern(this.patron));
    }
    if(changes.requerido){
      validators.push(Validators.required);
    }
    this.grupo.get(this.nombreInput).setValidators(validators);
  }

  ngOnDestroy(){
    Object.keys(this.subscriptor).forEach((key)=>{
      this.subscriptor[key].unsubscribe();
    })
  }

}

