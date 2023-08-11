import { Component, OnInit } from '@angular/core';
import { AtencionesService } from '../../../services/atenciones.service';

@Component({
  selector: 'ngx-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {

  // single: any[]=[];
view: [number,number] = [700, 700];

// options
gradient: boolean = true;
showLegend: boolean = true;
showLabels: boolean = true;
isDoughnut: boolean = false;

colorScheme = {
  domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
};



onSelect(data): void {
  console.log('Item clicked', JSON.parse(JSON.stringify(data)));
}

onActivate(data): void {
  console.log('Activate', JSON.parse(JSON.stringify(data)));
}

onDeactivate(data): void {
  console.log('Deactivate', JSON.parse(JSON.stringify(data)));
}


constructor(private AtencionesService:AtencionesService) { 
//  Object.assign(this, { single });

}

get single(){
  //return this.AtencionesService.atencionesData;
  return this.AtencionesService.atencionesDataAxS;
  
}

  ngOnInit() {
  }

}
