import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { IAppState } from '../../../../@core/store/app.state';
import { ListService } from '../../../../@core/store/list.service';

@Component({
  selector: 'ngx-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent implements OnInit {
  periodos: Periodo[] = [];
  parametros: ParametroPeriodo[] = [];
  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private listService: ListService) {
    this.listService.findPeriodosAcademico();
    this.listService.findParametros();
    this.loadLists();
    this.loadParametros();
  }

  ngOnInit(): void {
  }

  public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listPA = list.listPeriodoAcademico
        if (listPA.length > 0 && this.periodos.length === 0) {
          const periodos = <Array<Periodo>>listPA[0]['Data'];
          periodos.forEach(element => {
            this.periodos.push(element);
          })
        }
      },
    );
  }
  public loadParametros() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listaParam = list.listParametros;
        if (listaParam.length > 0 && this.parametros.length === 0) {
          const parametros = <Array<ParametroPeriodo>>listaParam[0]['Data'];
          if (parametros != undefined) {
            parametros.forEach(element => {
              this.parametros.push(element);
            });
          }
        }
      },
    );
  }

  public mostrarInforme(index){
    for (let parametro of this.parametros) {
      if (parametro.PeriodoId.Id === this.periodos[index].Id) {
        if (parametro.ParametroId.Id == environment.IDS.IDCIERREPERIODO) {
          if (parametro.Activo)
            return true
        }
      }
    }
    return false;
  }

  navigateInformePeriodo(idPeriodo){
    this.router.navigate([`/pages/apoyo-alimentario/informes/periodo/${idPeriodo}`]);
    return false;
  }

}
