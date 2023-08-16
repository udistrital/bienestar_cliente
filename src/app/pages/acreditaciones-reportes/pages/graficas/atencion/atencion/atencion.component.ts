import { Component, OnInit,Input } from '@angular/core';
import { AtencionesService } from '../../../../services/atenciones.service';
import { DateCustomPipePipe } from '../../../../../../shared/pipes/date-custom-pipe.pipe';

@Component({
  selector: 'ngx-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.scss']
})
export class AtencionComponent implements OnInit {

fechaInicio=""
fechaFinal=""

  constructor(private AtencionesService:AtencionesService,
    private dateCustomPipe: DateCustomPipePipe,) { 
  
  }


@Input() atencion!: any;



ngOnInit() {
  
}


  facultades: string[] = ["FACULTAD DE INGENIERIA", "FACULTAD DE CIENCIAS Y EDUCACION", "FACULTAD DE MEDIO AMBIENTE",
  "FACULTAD TECNOLOGICA", "FACULTAD DE CIENCIAS MATEMATICAS Y NATURALES", "FACULTAD DE ARTES -  ASAB"];
  facultad : string = ""
  periodo: string[] = ["2021-1","2022-2"];

  //pasar tipo de atencion al servicio
  BuscarSolicitud(){
    let fechaI = this.dateCustomPipe.transform(this.fechaInicio)
    let fechaF = this.dateCustomPipe.transform(this.fechaFinal)
    
   // this.fecha =this.dateCustomPipe.transform(this.fecha)
    console.log("fecha inicio",this.fechaInicio);
    console.log("fecha final",this.fechaFinal);
    
    console.log("fecha iniciof",fechaI);
    console.log("fecha finalf",fechaF);
    
  
 this.AtencionesService.setFiltroFacultad(this.facultad,fechaI,fechaF)
  
}
  
 
}
