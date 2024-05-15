import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ListService } from '../../../../@core/store/list.service';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { UtilService } from '../../../../shared/services/utilService';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ngx-buscar-solicitud',
  templateUrl: './buscar-solicitud.component.html',
  styleUrls: ['./buscar-solicitud.component.scss']
})
export class BuscarSolicitudComponent implements OnInit {

  periodos = [];
  tercero: Tercero;
  periodo: number = 0;
  codigo = "";
  solicitudes: Solicitud[]=[];
    
  estadosSolicitud=[[environment.IDS.IDSOLICITUDRADICADA,"Radicada"],
                    [environment.IDS.IDSOLICITUDACEPTADA,"Aceptada"],
                    [environment.IDS.IDSOLICITUDNOACEPTADA,"Rechazada"],
                    [environment.IDS.IDSOLICITUDPREPARADA,"Preparada para presentar a comité"]]

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


  /**
   *Busca solicitudes relacionadas a un estudiante
   *
   * @param {NgForm} form
   * @return {*} 
   * @memberof BuscarSolicitudComponent
   */
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
            this.tercero=terceroReg;
            this.solicitudes=[];
            for (const solicitante of resp) {
              this.estadosSolicitud.forEach((element:any)=>{
                  let estado:number = solicitante.SolicitudId.EstadoTipoSolicitudId.Id;
                  if(estado==element[0]){
                    solicitante.SolicitudId.EstadoTipoSolicitudId.EstadoId.Nombre=element[1];
                  }  
              });
              this.solicitudes.push(solicitante.SolicitudId);
            }
            if (this.solicitudes.length == 0) {
              this.utilService.showSwAlertError("Solicitudes no encontrados", `No se encontraron solicitudes de ${terceroReg.NombreCompleto} para ${this.periodo>=0 ? this.periodos[this.periodo].Nombre : "ningun periodo"}`);
            }
          }
        ).catch((error)=>console.error(error));
      } else {
        this.utilService.showSwAlertError("Estudiante no encontrado",'No se encuentra el tercero');
      }
    }).catch(
      (error) => {
        this.utilService.showSwAlertError("Estudiante no encontrado",`<p>${error}</p>`);
      }
    );
  }
}


