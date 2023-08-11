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
    { nombre:"Atención Bienestar Permanencia",id:57},

    {nombre:"Atención Bienestar Derechos humanos ",id:59},
    
    {nombre:"Atención Bienestar ICETEX",id:65},

    {nombre:"Atención Bienestar Jóvenes En Acción",id:62},

    {nombre:"Atención Bienestar Excusas",id:70},

    {nombre:"Atención Bienestar Psicología",id:72},

    {nombre:"Atención Bienestar Trabajo Social ",id:75}
  ];


  atencion =null



  solicitudesExt: string [] = [];

 // single: any[]=[];



 constructor(private AtencionesService:AtencionesService) { 
  
}


  ngOnInit() {
  }


  // funciones
  buscarSolicitudes(){
 this.solicitudesExt=["",""]
 console.log(this.atencion);

 this.AtencionesService.setTipoAtencion(this.atencion)
 this.AtencionesService.buscarSolicitudes();
 

 
  }
}
