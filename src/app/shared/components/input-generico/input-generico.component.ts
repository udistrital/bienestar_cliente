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
  @Output() eventoErrorInput = new EventEmitter<any>();
  subscriptor: any = {};

  objetos = [];
  opcionSeleccione = {};


  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: any) {
    if (changes.grupo) {
      this.grupo.addControl(this.nombreInput, new FormControl(null));
    }
    if (changes.validar) {
      this.inputTieneErrores();
    }
    if (changes.modelo && changes.modelo.currentValue) {
      this.grupo.get(this.nombreInput).setValue(changes.modelo.currentValue);
    }
    this.setValidatorsInput(changes);
  }

  setValidatorsInput(changes: any) {
    const validators: any = [];
    if (this.patron) {
      validators.push(Validators.pattern(this.patron));
    }
    if (this.requerido) {
      validators.push(Validators.required);
    }
    this.grupo.get(this.nombreInput).setValidators(validators);
  }

  emitirModelo(evento) {
    this.modelo = evento !== '' ? evento : undefined;
    this.modeloChange.emit(this.modelo);
    this.inputTieneErrores();
  }

  inputTieneErrores() {
    this.grupo.get(this.nombreInput).updateValueAndValidity();
    if (this.grupo.get(this.nombreInput).invalid && this.grupo.get(this.nombreInput).dirty || this.validar && this.grupo.get(this.nombreInput).invalid) {
      this.eventoErrorInput.emit(true);
    }
  }

  ngOnDestroy() {
    Object.keys(this.subscriptor).forEach((key) => {
      this.subscriptor[key].unsubscribe();
    })
  }

}

