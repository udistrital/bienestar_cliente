import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PopUpManager } from '../../../@core/managers/popUpManager';
import { ApiConstanst } from '../../constants/api.constans';
import { ParametriasService } from '../../services/parametrias.service';

@Component({
  selector: 'ngx-parametria-periodo',
  templateUrl: './parametria-periodo.component.html',
  styleUrls: ['./parametria-periodo.component.scss']
})
export class ParametriaPeriodoComponent implements OnInit {

  @Output() cerrar = new EventEmitter<any>();

  parametria: any = {};

  constructor(private parametriaService: ParametriasService, private pUpManager: PopUpManager) { }

  ngOnInit() {
    this.obtenerParametria();
  }

  obtenerParametria(){
    this.parametriaService.getParametriaPeriodoObservable(ApiConstanst.PARAMETRIAS.FORMULARIO_RELIQUIDACION).subscribe((res)=>{
      this.parametria = res.Data;
      this.parametria.fechaInicio = new Date(this.parametria.InicioVigencia);
      this.parametria.fechaFin= new Date(this.parametria.FinVigencia);
    })
  }

  actualizarParametria(){
    const parametriaAux = this.parametria;
    this.parametria.InicioVigencia = this.parametria.fechaInicio;
    this.parametria.FinVigencia=this.parametria.fechaFin;
    this.parametriaService.actualizarPeriodo(parametriaAux).subscribe((res)=>{
      this.pUpManager.showInfoToast('Parametría actualizada con éxito');
      this.cerrar.emit();
    })
  }
}
