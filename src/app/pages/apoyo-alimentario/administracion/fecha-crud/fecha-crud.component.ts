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
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';

@Component({
  selector: 'ngx-fecha-crud',
  templateUrl: './fecha-crud.component.html',
  styleUrls: ['./fecha-crud.component.scss']
})
export class FechaCrudComponent implements OnInit {

  fecha = new FechaModel();
  fechas: FechaModel[]=[];
  periodo: Periodo = null;

  //periodoActual: PeriodoModel;

  constructor(private periodosService: PeriodosService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<IAppState>,
    private listService: ListService,
    private toastrService: NbToastrService,) {
    this.listService.findServicioApoyo()
    this.loadPeriodo();
  }

  public loadPeriodo() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listaParam = list.listServicioApoyo;
        if (listaParam.length > 0 && this.periodo === null) {
          console.info("Periodo Fecha")
          console.info(listaParam)
          let parametros = <Array<ParametroPeriodo>>listaParam[0]['Data'];
          this.periodo= parametros[0].PeriodoId
          console.info(this.periodo)
        }
      },
    );   
  }

  guardar(form:NgForm){
    if(form.invalid){
      Object.values(form.controls).forEach(control =>{
        control.markAsTouched();
      });
      return;
    }
    
    /* Swal.fire({
      title: 'Espere',
      text:'Guardando información',
      icon: 'info',
      allowOutsideClick: false,
    });

    Swal.showLoading();

    let peticion: Observable<any>;

    if(!this.fechasService.fechaActual(this.fecha.fechaDia)){
      Swal.fire({
        title: `Error en la Fecha: ${ this.fecha.fechaDia } `,
        text: `Por favor agregue una fecha mayor o igual a la del dia actual `,
        icon: 'error',
        showConfirmButton: true,
      });
      return;
    }
    if(!this.fechaDiferente(this.fecha.fechaDia)){
      Swal.fire({
        title: `Error en la Fecha: ${ this.fecha.fechaDia } `,
        text: `Ya existe una fecha para este Día`,
        icon: 'error',
        showConfirmButton: true,
      });
      return;
    } 
    if(this.fecha.id){
      
      peticion = this.fechasService.actualizar(this.fecha); 
    }else{
      
      this.fecha.estado="pendiente";
      peticion = this.fechasService.crearFecha(this.fecha);
    }
    

    peticion.subscribe(resp => {
      
      Swal.fire({
        title: this.fecha.fechaDia,
        text: 'Se actualizo correctamente',
        icon: 'success'
      });
      this.router.navigateByUrl('/fechas');

    });  */
    
  }

  ngOnInit() {
    
  }

  showToast() {
    this.toastrService.show('Se registro correctamente', `Fecha Creada`,{position: NbGlobalPhysicalPosition.TOP_RIGHT , status: 'success' , duration: 2000 , icon: 'checkmark-square-outline'});
  }

}
