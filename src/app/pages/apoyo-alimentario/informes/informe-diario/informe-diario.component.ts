import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ListService } from '../../../../@core/store/list.service';
import { UtilService } from '../../../../shared/services/utilService';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'ngx-informe-diario',
  templateUrl: './informe-diario.component.html',
  styleUrls: ['./informe-diario.component.scss']
})
export class InformeDiarioComponent implements OnInit {

  periodo: Periodo;
  myDate = formatDate(new Date(), "dd-MM-yyyy", "en");
  
  constructor(
    private listService: ListService,
    private utilsService: UtilService
  ){
    this.listService.findParametrosByPeriodoTipoEstado(null,environment.IDS.IDSERVICIOAPOYO,true).then((resp)=>{
      if(resp.length>0){
        this.periodo=resp[0].PeriodoId;
      }else{
        this.periodo=null;
      }
    }).catch((err)=>this.utilsService.showSwAlertError("Cargar periodo",err));
   }
  
  ngOnInit() {
  }
  
}
