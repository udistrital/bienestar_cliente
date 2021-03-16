import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'
import { pipe } from 'rxjs';
import { FechaModel } from '../../../../@core/data/models/fecha/fecha.model';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { PeriodosService } from '../../servicios/periodos.service';
import { FechasService } from '../../servicios/fechas.service'
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../@core/store/app.state';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-fecha-crud',
  templateUrl: './fecha-crud.component.html',
  styleUrls: ['./fecha-crud.component.scss']
})
export class FechaCrudComponent implements OnInit {

  fecha = new FechaModel();
  fechas: FechaModel[]=[];
  periodos: Periodo[] = [];
  periodo: Periodo = null;

  //periodoActual: PeriodoModel;

  constructor(private periodosService: PeriodosService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<IAppState>,
    private listService: ListService,
    private toastrService: NbToastrService,) {
    this.listService.findPeriodosAcademico();
    this.loadLists();
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

  ngOnInit() {
    
  }

  showToast() {
    this.toastrService.show('Se registro correctamente', `Fecha Creada`,{position: NbGlobalPhysicalPosition.TOP_RIGHT , status: 'success' , duration: 2000 , icon: 'checkmark-square-outline'});
  }

}
