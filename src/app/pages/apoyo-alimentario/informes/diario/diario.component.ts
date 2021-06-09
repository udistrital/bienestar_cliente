import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { UtilService } from '../../../../shared/services/utilService';

@Component({
  selector: 'ngx-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.scss']
})
export class DiarioComponent implements OnInit {

  periodo: Periodo;

  constructor(
    private router: Router,
    private utilService :UtilService,
  ) {

   }

  ngOnInit() {
  }

  navigateInformeDiario(fechaInforme: string){
    
    if(fechaInforme!=""){

      fechaInforme+="T00:00:00"; //Se ajusta la hora para que al convertir a date no tome el dia anterior

      let dateActual = new Date();
      let dateInforme = new Date(fechaInforme);
      
      if(dateInforme.getTime()>dateActual.getTime()){
        this.utilService.showToastError("Fecha Invalida","La fecha ingresada no es valida");
        return false;
      }else{
        let date=formatDate(dateInforme, "dd-MM-yyyy", "en");
        this.router.navigate([`/pages/apoyo-alimentario/informes/diario/${date}`]);
        return true;
      }
    }else{
      this.utilService.showToastError("Consultar Fecha","Ingrese una fecha antes de consultar","alert-circle-outline");
    }
  }

}
