import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ListService } from '../../../../@core/store/list.service';
import { UtilService } from '../../../../shared/services/utilService';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'ngx-informe-diario',
  templateUrl: './informe-diario.component.html',
  styleUrls: ['./informe-diario.component.scss']
})
export class InformeDiarioComponent implements OnInit {

  periodo: Periodo;
  myDate : string;
  
  constructor(
    private listService: ListService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilService
  ){
    this.listService.findParametrosByPeriodoTipoEstado(null,environment.IDS.IDSERVICIOAPOYO,true).then((resp)=>{
      if(resp.length>0){
        this.periodo=resp[0].PeriodoId;
        this.activatedRoute.params.subscribe(params => {
          this.myDate=params['fecha'];
        });
      }else{
        this.periodo=null;
      }
    }).catch((err)=>this.utilsService.showSwAlertError("Cargar periodo",err));
   }
  
  ngOnInit() {
    
  }
  
}
