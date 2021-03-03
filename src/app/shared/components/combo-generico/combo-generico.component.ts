import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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
  @Input() validar: any;
  @Input() etiqueta: any;

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

  ngOnDestroy(){
    Object.keys(this.subscriptor).forEach((key)=>{
      this.subscriptor[key].unsubscribe();
    })
  }

}
