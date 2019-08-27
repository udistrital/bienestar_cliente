import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-gestion-apropiaciones',
  templateUrl: './gestion-apropiaciones.component.html',
  styleUrls: ['./gestion-apropiaciones.component.scss']
})
export class GestionApropiacionesComponent implements OnInit {
  private opcionSeleccionada: boolean;
  private opcion:string;
  constructor() {
    this.opcionSeleccionada = false;
    this.opcion = '';
  }

  ngOnInit() {
  }
  routeView(opc){
    console.info(opc);
    this.opcionSeleccionada = true;
    this.opcion = opc;

  }
  backView(){
    this.opcionSeleccionada = false;
    this.opcion = '';
  }
}
