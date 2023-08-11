import { Component, OnInit,Input } from '@angular/core';


@Component({
  selector: 'ngx-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.scss']
})
export class AtencionComponent implements OnInit {


@Input() atencion!: any;



ngOnInit() {
  
}


  facultades: string[] = ["Facultad de Ingeniería", "Sede Bosa", "Facultad del Medio Ambiente y Recursos Naturales (Vivero)",
  "Facultad Tecnológica", "Facultad de Ciencias y Educación (Macarena)", "Facultad de Artes - ASAB"];
  facultad : string = ""
  periodo: string[] = ["2021-1","2022-2"];

  //pasar tipo de atencion al servicio
 
}
