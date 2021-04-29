import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ListService } from '../../../../@core/store/list.service';
import { UtilService } from '../../../../shared/services/utilService';

@Component({
  selector: 'ngx-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent implements OnInit {
  periodos: Periodo[] = [];
  parametros: ParametroPeriodo[] = [];
  constructor(
    private router: Router,
    private listService: ListService,
    private utilService: UtilService) {
    this.listService.findParametrosByPeriodoTipoEstado(null,environment.IDS.IDCIERREPERIODO,true).then((resp)=>{
      this.parametros=resp;
      this.loadPeriodos();
    }).catch((err)=>this.utilService.showSwAlertError("Carga de parametos",err));

  }
  loadPeriodos() {
    for (const parametro of this.parametros) {
      console.log(parametro);
      this.periodos.push(parametro.PeriodoId);
    }
    console.log(this.periodos);
    
  }

  ngOnInit(): void {
  }

  navigateInformePeriodo(idPeriodo){
    this.router.navigate([`/pages/apoyo-alimentario/informes/periodo/${idPeriodo}`]);
    return false;
  }

}
