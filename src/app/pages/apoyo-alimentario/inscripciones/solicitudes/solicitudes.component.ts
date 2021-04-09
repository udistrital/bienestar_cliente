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
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'ngx-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  filSols: Solicitud[] = [];
  filtroPeriodo:boolean = false;
  periodos: Periodo[] = [];
  periodo: Periodo = null;  
  busqueda:string;
  pagActual:number=1;
  contPag:number=0;
  itemsPag:number[]=[1,5,10,15,20,25,50,75,100];
  itemSelect:number=10;
  constructor(
    private store: Store<IAppState>,
    private listService: ListService,
  ) { 
    //this.listService.findPeriodosAcademico();
    this.listService.findParametroPeriodo(environment.IDS.IDINSCRIPCIONES);
    this.loadPeriodo();
    //this.loadPeriodos();
    //this.loadPeriodoSp();

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
              console.log('referencia',refSol);
              console.log('periodo',this.periodo.Nombre);
              if( refSol.Periodo===this.periodo.Nombre){
                this.solicitudes.push(listSR[0][i]);
                for (let j = 0; j <240; j++) {
                  this.solicitudes.push(listSR[0][i]);
                }
                this.filSols=this.solicitudes;
                break;
              }
            }catch{
              console.error("Problema con la referencia de la solicitud")
            }

          }
        }
      },
    );
  }

  public loadPeriodos() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listPA = list.listPeriodoAcademico
        if (listPA.length > 0 ) {
          const periodos = <Array<Periodo>>listPA[0]['Data'];
          periodos.forEach(element => {
            this.periodos.push(element);
          })
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

  public loadPeriodo() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listaParam = list.listParametros;
        if (listaParam.length > 0 && this.periodo === null) {
          console.info(listaParam)
          let parametros = <Array<ParametroPeriodo>>listaParam[0]['Data'];
          console.log(parametros);
          
          for(let param of parametros){
            //console.log(param);
            this.periodos.push(param.PeriodoId);
          }
          this.periodo= parametros[0].PeriodoId
          console.info(this.periodo)
          this.listService.findSolicitudesRadicadas();
          this.loadLists();
        }
      },
    );   
  }

  onSelect($event){
    console.log("Hola, Solicitudes nuevas de este periodo papuuuu");
    this.solicitudes=[];
    this.filSols=[];
    for (let j = 0; j <240; j++) {
      this.solicitudes.pop();
      this.filSols.pop();
    }
    
    this.loadLists();
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let filtro = filterValue.trim().toLowerCase();
    console.log(filtro);
    this.filSols=[];
    
    for (let i of this.solicitudes){
      if(i.EstadoTipoSolicitudId.EstadoId.Nombre==filterValue){
        this.filSols.push(i); 
      }
    }  
    console.log(this.solicitudes);
    
    
  }
 

  ngOnInit() {
  }

}
