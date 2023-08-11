import { Component, OnInit } from '@angular/core';
import { AtencionesService } from '../../../services/atenciones.service';

@Component({
  selector: 'ngx-horizontalBar',
  templateUrl: './horizontalBar.component.html',
  styleUrls: ['./horizontalBar.component.scss']
})
export class HorizontalBarComponent implements OnInit {
  
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Tipo de Servicio';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Numero de Servicios';

  colorScheme = {

    
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']

    
  };


  constructor(private AtencionesService:AtencionesService) { }
  
  get single(){
    //return this.AtencionesService.atencionesData;
    return this.AtencionesService.atencionesDataAxS;
    
  }
  ngOnInit() {
  }

}
