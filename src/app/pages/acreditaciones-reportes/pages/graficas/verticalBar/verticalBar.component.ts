import { Component, OnInit } from '@angular/core';
import { AtencionesService } from '../../../services/atenciones.service';

@Component({
  selector: 'ngx-verticalBar',
  templateUrl: './verticalBar.component.html',
  styleUrls: ['./verticalBar.component.scss']
})
export class VerticalBarComponent implements OnInit {



  multi: any[];

  view = "[containerRef.offsetWidth, 400]"

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Facultades';
  showYAxisLabel = true;
  yAxisLabel = 'Numero de Servicios';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor(private AtencionesService:AtencionesService) { }

  
  
  get single(){
    //if(this.AtencionesService.atencionesAxF.length <0)
    return this.AtencionesService.atencionesDataAxF
   
    
  }
    
  ngOnInit() {
  }

}
