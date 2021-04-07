import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Store } from '@ngrx/store';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { IAppState } from '../../../../@core/store/app.state';
import { ListService } from '../../../../@core/store/list.service';
import { FechaModel } from '../../modelos/fecha.model';


@Component({
  selector: 'ngx-informe-diario',
  templateUrl: './informe-diario.component.html',
  styleUrls: ['./informe-diario.component.scss']
})
export class InformeDiarioComponent implements OnInit {

  periodo: Periodo;
  myDate = formatDate(new Date(), "dd-MM-yyyy", "en");
  
  constructor(
    private store: Store<IAppState>,
    private listService: ListService,
  ){
    this.listService.findParametros();
    this.loadPeriodo();
   }
  
  ngOnInit() {
  }
  
  public loadPeriodo() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listaParam = list.listParametros;
        if (listaParam.length > 0) {
          for (let parametro of <Array<ParametroPeriodo>>listaParam[0]["Data"]){
            console.log(parametro);
            if(parametro.Activo){
              this.periodo = parametro.PeriodoId;
              break;
            }
          }
        }
    });
  }
}
