import { Component, OnInit,Input } from '@angular/core';
import { AtencionesService } from '../../../../services/atenciones.service';
import { DateCustomPipePipe } from '../../../../../../shared/pipes/date-custom-pipe.pipe';
import { FormsModule } from '../../../../../forms/forms.module';
FormsModule

@Component({
  selector: 'ngx-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.scss']
})
export class AtencionComponent implements OnInit {

fechaInicio=""
fechaFinal=""
facultades: string[] = ["FACULTAD DE INGENIERIA", "FACULTAD DE CIENCIAS Y EDUCACION", "FACULTAD DE MEDIO AMBIENTE",
"FACULTAD TECNOLOGICA", "FACULTAD DE CIENCIAS MATEMATICAS Y NATURALES", "FACULTAD DE ARTES -  ASAB"];
facultad= ""

  constructor(private AtencionesService:AtencionesService,
    private dateCustomPipe: DateCustomPipePipe,) { 
  
  }


@Input() atencion!: any;



ngOnInit() {
  
}




  //pasar tipo de atencion al servicio
  BuscarSolicitud(){
    let fechaI = this.fechaInicio ? this.dateCustomPipe.transform(this.fechaInicio) : ""
    let fechaF = this.fechaInicio ? this.dateCustomPipe.transform(this.fechaFinal) : ""
    
   
  
 this.AtencionesService.setFiltroFacultad(this.facultad,fechaI,fechaF)
  
}
  
 
}
