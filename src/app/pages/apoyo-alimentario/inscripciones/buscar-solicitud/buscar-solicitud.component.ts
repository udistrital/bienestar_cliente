import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ListService } from '../../../../@core/store/list.service';
import Swal from 'sweetalert2';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { UtilService } from '../../../../shared/services/utilService';

@Component({
  selector: 'ngx-buscar-solicitud',
  templateUrl: './buscar-solicitud.component.html',
  styleUrls: ['./buscar-solicitud.component.scss']
})
export class BuscarSolicitudComponent implements OnInit {

  periodos = [];
  periodo: number = 0;
  codigo = "";
  solicitudes: Solicitud[]=null;

  constructor(
    private utilService: UtilService,
    private listService: ListService,
  ) {
    this.listService.findPeriodosAcademico().then((resp)=>{
      this.periodos=resp;
    }).catch((err)=>this.utilService.showSwAlertError("Cargar periodos",err));
  }


  ngOnInit() {
  }

  buscar(form: NgForm) {
    if (form.invalid || this.periodos.length === 0) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.listService.loadTerceroByDocumento(this.codigo).then((resp) => {
      const terceroReg: Tercero = resp;
      if (terceroReg !== undefined) {
        let nombrePeriodo: string=null
        if(this.periodo>=0){
          nombrePeriodo=this.periodos[this.periodo].Nombre;
        }
        this.listService.loadSolicitanteByIdTercero(terceroReg.Id,null,nombrePeriodo,null).then(
          (resp)=>{
            this.solicitudes=[];
            for (const solicitante of resp) {
              this.solicitudes.push(solicitante.SolicitudId);
            }
          }
        ).catch((error)=>console.error(error));
      } else {
        Swal.fire("Error",
          `<p>No se encuentra el tercero</p>`, "error");
      }
    }).catch(
      (error) => {
        Swal.fire("Error",
          `<p>${error}</p>`, "error");
      }
    );

  }

}


