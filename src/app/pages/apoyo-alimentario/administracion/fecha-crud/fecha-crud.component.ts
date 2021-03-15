import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'
import { pipe } from 'rxjs';
import { FechaModel } from '../../../../@core/data/models/fecha/fecha.model';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { PeriodosService } from '../../servicios/periodos.service';
import { FechasService } from '../../servicios/fechas.service'

@Component({
  selector: 'ngx-fecha-crud',
  templateUrl: './fecha-crud.component.html',
  styleUrls: ['./fecha-crud.component.scss']
})
export class FechaCrudComponent implements OnInit {

  fecha = new FechaModel();
  fechas: FechaModel[]=[];
  //periodoActual: PeriodoModel;

  constructor() { }

  ngOnInit() {
  }

}
