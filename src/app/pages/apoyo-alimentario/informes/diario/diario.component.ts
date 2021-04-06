import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { IAppState } from '../../../../@core/store/app.state';
import { ListService } from '../../../../@core/store/list.service';
import { FechaModel } from '../../modelos/fecha.model';

@Component({
  selector: 'ngx-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.scss']
})
export class DiarioComponent implements OnInit {

  periodo: Periodo;
  fechaActual = new FechaModel();
  myDate = formatDate(new Date(), "dd-MM-yyyy", "en");

  constructor(
    private store: Store<IAppState>,
    private listService: ListService,
  ) {
    this.loadPeriodo();
   }

  ngOnInit() {
    this.fechaActual.fechaDia = new Date();
  }

  public loadPeriodo() {
    this.store
      .select((state) => state)
      .subscribe((list) => {
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
