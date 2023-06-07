import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-acreditaciones-reportes',
  templateUrl: './acreditaciones-reportes.component.html',
  styleUrls: ['./acreditaciones-reportes.component.scss']
})
export class AcreditacionesReportesComponent implements OnInit {

  single: any[];
  view: any[] = [700, 400];

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


  constructor() { 
  //  Object.assign(this, { single });
  }

  ngOnInit() {
  }

  print(){
    console.log("hola mundo");
    
  }
}
