import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FechaModel } from '../../../../@core/data/models/fecha/fecha.model';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';

@Component({
  selector: 'ngx-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.scss']
})
export class DiarioComponent implements OnInit {

  periodo: Periodo;
  fecha = new FechaModel();
  //myDate = formatDate(new Date(), "yyyy-MM-dd", "en");

  constructor(
    private router: Router,
  ) {

   }

  ngOnInit() {
  }

  navigateInformeDiario(){
    let date=formatDate(this.fecha.fechaDia, "dd-MM-yyyy", "en");
    console.log(date);
    this.router.navigate([`/pages/apoyo-alimentario/informes/diario/${date}`]);
    return false;
  }




}
