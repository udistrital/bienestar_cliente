import { Component, OnInit } from '@angular/core';
import { ApoyoAlimentario } from '../../../../@core/data/models/apoyo-alimentario';
import { ListService } from '../../../../@core/store/list.service';
import { UtilService } from '../../../../shared/services/utilService';

@Component({
  selector: 'ngx-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss']
})
export class ConsultarComponent implements OnInit {


  registros : ApoyoAlimentario[] = [];

  constructor(
    private listService: ListService,
    private utilService: UtilService
  ) { 
    this.listService.findApoyoAlimentario().then((result) =>{
      console.log(result);
      
      this.registros=result;
      /* for(let res in result){
        this.registros.push(res);
      } */
      console.log(this.registros);
      
    }).catch((err)=>this.utilService.showSwAlertError("titutlo",err));
  }

  ngOnInit() {
  }

}
