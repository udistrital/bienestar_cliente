import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo'
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { IAppState } from '../../../../@core/store/app.state';
import { Store } from '@ngrx/store';

import Swal from 'sweetalert2';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ngx-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  periodo: Periodo = null;  
  constructor(
    private store: Store<IAppState>,
    private listService: ListService,
  ) { 
    this.loadPeriodoSp();
  }
  public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listSR = list.listSolicitudesRadicadas;
        if (listSR.length > 0 && this.solicitudes.length === 0) {
          console.log(listSR[0].length);
          for (let i = 0; i < listSR[0].length; i++) {
            try{
              let refSol :ReferenciaSolicitud =JSON.parse(listSR[0][i].Referencia);
              if( refSol.Periodo===this.periodo.Nombre){
                this.solicitudes.push(listSR[0][i]);
              }
            }catch{
              console.error("Problema con la referencia de la solicitud")
            }

          }
        }
      },
    );
  }
  public loadPeriodoSp() {
    this.listService.findParametroPeriodoSp(environment.IDS.IDINSCRIPCIONES)
      .subscribe(
        (result: any[]) => {
          console.info('Entro')
          if (result['Data'].length > 0) {
            this.periodo = result['Data'][0].PeriodoId;
            this.listService.findSolicitudesRadicadas();
            this.loadLists();
          }
        },
        error => {
          this.periodo = null;
        },
      );
  }

  ngOnInit() {
  }

}
