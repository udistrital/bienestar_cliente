import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ListService } from '../../../../@core/store/list.service';
import { UtilService } from '../../../../shared/services/utilService';

@Component({
  selector: 'ngx-informe-periodo',
  templateUrl: './informe-periodo.component.html',
  styleUrls: ['./informe-periodo.component.scss']
})
export class InformePeriodoComponent implements OnInit {

  periodo: Periodo;

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private utilService: UtilService,
  ) {
    let idPeriodo: number;
    this.route.params.subscribe(params => {
      idPeriodo = params['idPeriodo'];
    });
    this.listService.findPeriodoAcademico(idPeriodo).then((resp) => {

      if (resp != undefined) {
        this.periodo = resp;
      } else {
        this.periodo = null;
        this.utilService.showSwAlertError("Cargar periodo", "No se encontraron periodos");
      }
    }).catch((err) => this.utilService.showSwAlertError("Cargar periodo", err));
  }



  ngOnInit() {
  }


}
