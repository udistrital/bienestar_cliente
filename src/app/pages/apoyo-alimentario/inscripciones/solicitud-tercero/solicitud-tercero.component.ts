import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ListService } from '../../../../@core/store/list.service';
import { IAppState } from '../../../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { delay, switchMap } from 'rxjs/operators';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';


@Component({
  selector: 'ngx-solicitud-tercero',
  templateUrl: './solicitud-tercero.component.html',
  styleUrls: ['./solicitud-tercero.component.scss']
})
export class SolicitudTerceroComponent implements OnInit {
  solicitud: Solicitud = null;
  periodo: Periodo = null;

  constructor(private router: Router,
    private listService: ListService,
    private store: Store<IAppState>) {
      listService.findParametroPeriodo(environment.IDS.IDINSCRIPCIONES);
      this.loadPeriodo();
     }
    public loadPeriodo() {
      this.store.select((state) => state).subscribe(
        (list) => {
          const listaParam = list.listParametros;
          if (listaParam.length > 0 && this.periodo === null) {
            console.info("Periodo")
            console.info(listaParam)
            let parametros = <Array<ParametroPeriodo>>listaParam[0]['Data'];
            this.periodo= parametros[0].PeriodoId
          }
        },
      );   
    }

  ngOnInit() {
  }

  registrar(){
    var codigoValue = (<HTMLInputElement>document.getElementById("codigo")).value;
    console.log(codigoValue);
    Swal.fire({
      title: 'Está seguro?',
      text: `Dessea solicitar apoyo alimentario para ${codigoValue}`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }
    ).then(async resp => {
      if (resp.value) {
        /* if(parametro==="inscripciones"){
          this.listService.inciarParametroPeriodo(periodo,this.idInscripciones);             
        }else if(parametro==="servicio"){
          this.listService.inciarParametroPeriodo(periodo,this.idServicio);             
        } */

        Swal.fire({
          title: 'Espere',
          text:'Procesando su solicitud',
          type: 'question',
          allowOutsideClick: false,
        });
        Swal.showLoading();
          
        
        
        (async () => { 
          // Do something before delay
          this.listService.findSolicitudTercero(+codigoValue);
          await this.store.select((state) => state).subscribe(
            (list) => {
              const listaSolTercero = list.listSolicitudTercero;
              if (listaSolTercero.length > 0) {
                console.info("Existe una solicitud");
                this.solicitud=listaSolTercero[0];
                console.info(listaSolTercero[0]);
              }else{
                console.info("No existe una solicitud");
              }
            },
          );   
          if(this.solicitud==null){
            console.log("Se crea solicitud")
            this.listService.crearSolicitudApoyoAlimentario(+codigoValue);
          }else{
            console.log("ya existe no se crea")
          }
        })();

        
    
        
        
        
        Swal.fire({
          title: "titulo",
          text: 'Se cargaron los datos de forma correcta',
          type: 'success'
        });
        
      }
    });
    

    return false;
    
  }

}
