import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { SedeModel } from '../../modelos/sede.model'
import { RegistroInscritoModel } from '../../modelos/registroInscrito.model'
import { FechaModel } from '../../modelos/fecha.model';
import { FechasService } from '../../servicios/fechas.service'
import { RegistrosInscritosService } from '../../servicios/registros-inscritos.service'
import { SedesService } from '../../servicios/sedes.service'
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { IAppState } from '../../../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'ngx-inscritos',
  templateUrl: './inscritos.component.html',
  styleUrls: ['./inscritos.component.scss']
})
export class InscritosComponent implements OnInit {

  inscritos: boolean;
  sedesTemp: SedeModel[] = [];
  /* sedesAccesso: SedeModel[] = [] */
  sedesAccesso = ["Calle 40","Macarena","Vivero", "Bosa", "Tecnologica"];
  registosAprovados: string[] = [];
  registroBase = new RegistroInscritoModel();
  periodo: Periodo = null;
  fechaActual = new FechaModel();
  myDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

  constructor(private fechasService: FechasService,
    private registroInscritoService: RegistrosInscritosService,
    private sedesService: SedesService,
    private router: Router, private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private datePipe: DatePipe,
    private store: Store<IAppState>,
    private listService: ListService) { 
      this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
      this.listService.findParametroPeriodo(environment.IDS.IDSERVICIOAPOYO);
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

  async ngOnInit() {
    this.inscritos = true;
    let tipo = this.route.snapshot.paramMap.get('tipo');
    console.info(tipo);
    this.fechaActual.fechaDia=new Date();
    if (tipo === "no-inscritos") {
      this.inscritos = false;
    } else {
      if (tipo === "inscritos") {
        this.inscritos = true;
      }
    }


    /* this.fechasService.getFechas()
      .subscribe(async resp => {
        this.fechaActual = this.buscarFechaActiva(resp);

        if (this.fechaActual == null) {
          
          this.router.navigateByUrl('');
        } else {
          
          this.registroBase.codigo = "";
          this.registroBase.sede = "";
          this.registroBase.fecha = this.fechaActual.fechaDia;

        }
      }); */



   /*  this.sedesService.getSedes()
      .subscribe(resp => {
        this.sedesAccesso = resp;
      }); */

  }

  OnChanges() {
    console.log("cambios")
  }

  guardar(form: NgForm) {

    if (form.invalid || this.sedesAccesso.length === 0) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.registroBase.sede = form.value['sede'];


    /* this.registroInscritoService.crearRegistro(this.registroBase)
      .subscribe(resp => {

        this.registosAprovados.push(this.registroBase.codigo);
        let tempSedeTemp = this.registroBase.sede;
        this.registroBase = new RegistroInscritoModel()
        this.registroBase.codigo = "";
        this.registroBase.codigo = "";
        this.registroBase.sede = tempSedeTemp;
        this.registroBase.fecha = this.fechaActual.fechaDia;
      }); */

    Object.values(form.controls).forEach(control => {
      control.markAsUntouched();
    });
  }


  buscarFechaActiva(fechas: FechaModel[]) {

    if (fechas === null) { return null; }

    let fechasAct: FechaModel;

    Object.keys(fechas).forEach(key => {
      const fecha: FechaModel = fechas[key];
      if (this.fechaActiva(fecha.fechaDia)) {
        fechasAct = fecha;
      }
    });
    return fechasAct;
  }

  fechaActiva(fecha: Date) {

    let f1 = new Date(fecha); // Fecha ingresada por el usuario
    let f2 = new Date(Date.now()); //Fecha actual
    f1.setHours(0, 0, 0, 0);
    f1.setDate(f1.getDate() + 1);
    f2.setHours(0, 0, 0, 0);
    if (f1.getTime() == f2.getTime()) {
      return true;
    }
    return false;
  }
  cargarSedes() { //temporal
    let ingenieria = new SedeModel();
    ingenieria.id = "1";
    ingenieria.nombre = "Ingenieria";

    let macarena = new SedeModel();
    macarena.id = "2";
    macarena.nombre = "Macarena";

    let vivero = new SedeModel();
    vivero.id = "3";
    vivero.nombre = "Vivero";
/* 
    this.sedesAccesso.push(ingenieria);
    this.sedesAccesso.push(macarena);
    this.sedesAccesso.push(vivero); */

  }

  showToast() {
    let estudiante = this.registosAprovados.reverse();
    this.toastrService.show('Se registro correctamente', `Estudiante: ${this.registroBase.codigo}`,{position: NbGlobalPhysicalPosition.TOP_RIGHT , status: 'success' , duration: 2000 , icon: 'checkmark-square-outline'});
  }
}