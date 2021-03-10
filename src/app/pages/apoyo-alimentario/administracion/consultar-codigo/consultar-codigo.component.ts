import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'ngx-consultar-codigo',
  templateUrl: './consultar-codigo.component.html',
  styleUrls: ['./consultar-codigo.component.scss']
})
export class ConsultarCodigoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  consultar(){
    var codigoValue = (<HTMLInputElement>document.getElementById("codigo")).value;
    console.log(codigoValue);
    this.router.navigate(['/pages/apoyo-alimentario/administracion/consulta-codigo/'+codigoValue]);
    return false;
  }
 
}
