import { Component, OnInit } from '@angular/core';
import { Atenciones } from '../../interfaces/atenciones';
import { AtencionesService } from '../../services/atenciones.service';



@Component({
  selector: 'ngx-acreditaciones-reportes',
  templateUrl: './acreditaciones-reportes.component.html',
  styleUrls: ['./acreditaciones-reportes.component.scss']
})



export class AcreditacionesReportesComponent implements OnInit {




  //comenzamos por aqui 
  atenciones: Atenciones[] = [
    { nombre:"Bienestar Permanencia",id:57},

    {nombre:"Bienestar Derechos humanos ",id:59},
    
    {nombre:"Bienestar ICETEX",id:65},

    {nombre:"Bienestar Jóvenes En Acción",id:62},

    {nombre:"Bienestar Excusas",id:70},

    {nombre:"Bienestar Psicología",id:72},

    {nombre:"Bienestar Trabajo Social ",id:75}
  ];


  selectorAtencion =null



  solicitudesExt: string [] = [];

 // single: any[]=[];



 constructor(private AtencionesService:AtencionesService) { 
  
}


  ngOnInit() {
  }


  // funciones
  buscarSolicitudes(){
    let atencion = this.selectorAtencion.id
 this.solicitudesExt=["",""]
 console.log(atencion);

 this.AtencionesService.setTipoAtencion(atencion)
 this.AtencionesService.buscarSolicitudes();
 

 
  }
}
