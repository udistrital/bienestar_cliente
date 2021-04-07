import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { IAppState } from '../../../../@core/store/app.state';
import { ListService } from '../../../../@core/store/list.service';

@Component({
  selector: 'ngx-informe-periodo',
  templateUrl: './informe-periodo.component.html',
  styleUrls: ['./informe-periodo.component.scss']
})
export class InformePeriodoComponent implements OnInit {

  periodo: Periodo;

  constructor(
    private store: Store<IAppState>,
    private listService: ListService,
    private route: ActivatedRoute
  ) {
    this.listService.findPeriodosAcademico();
    this.loadPeriodo();
   }

  ngOnInit() { 
  }

  public loadPeriodo() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listPA = list.listPeriodoAcademico
        if (listPA.length > 0 ) {
          let idPeriodo :number;
          this.route.params.subscribe(params => {
            idPeriodo=params['idPeriodo'];
          });
          const periodos = <Array<Periodo>>listPA[0]['Data'];
          periodos.forEach(element => {
            if(idPeriodo==element.Id){
              this.periodo=element;
            }
          })
        }
      },
    );
  }

}
