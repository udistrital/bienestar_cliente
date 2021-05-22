import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ListService } from '../../../../@core/store/list.service';
import Swal from 'sweetalert2';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { UtilService } from '../../../../shared/services/utilService';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ApoyoAlimentario } from '../../../../@core/data/models/apoyo-alimentario';


@Component({
  selector: 'ngx-estudiante-periodo',
  templateUrl: './estudiante-periodo.component.html',
  styleUrls: ['./estudiante-periodo.component.scss']
})
export class EstudiantePeriodoComponent implements OnInit {

  periodos: Periodo[] = [];
  periodo: number = 0;
  codigo = "";
  tercero: Tercero = undefined;
  solicitud: Solicitud = undefined;
  regApoyoAlimentario: ApoyoAlimentario[] = []
  sedesAcceso = new Map();
  

  constructor(
    private utilService: UtilService,
    private listService: ListService,
  ) {
    this.listService.findPeriodosAcademico().then((resp) => {
      this.periodos = resp;
    }).catch((err) => this.utilService.showSwAlertError("Cargar periodos", err));

    this.listService.cargarSedesApoyo()
      .then((sedes) => {
        for (const sede of sedes) {
          this.sedesAcceso.set(sede.Id,sede.Nombre)
        }
      })
      .catch((error) => {
        Swal.close();
        Swal.fire("Error", `<p>${error}</p>`, "error");
      });
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
      this.tercero = resp;
      if (this.tercero !== undefined) {
        let nombrePeriodo: string = null
        if (this.periodo >= 0) {
          nombrePeriodo = this.periodos[this.periodo].Nombre;
        }
        /* this.listService.loadSolicitanteByIdTercero(this.tercero.Id,null,nombrePeriodo,null).then(
          (resp)=>{
            let solicitudes=[];
            for (const solicitante of resp) {
              this.solicitud= solicitante.SolicitudId
            }
          }
        ).catch((error)=>console.error(error)); */
        this.listService.consutarRegitroApoyo(this.tercero.Id, null, null, this.periodos[this.periodo].Id, true, null).then((regApoyo) => {
          if (regApoyo != null) {
            this.regApoyoAlimentario = regApoyo;
          }
        })
      } else {
        this.utilService.showSwAlertError("Estudiante no encontrado", 'No se encuentra el tercero');
      }
    }).catch(
      (error) => {
        this.utilService.showSwAlertError("Estudiante no encontrado", `<p>${error}</p>`);
        /* Swal.fire("Error",
          `<p>${error}</p>`, "error"); */
      }
    );

  }

  borrarBusqueda() {
    this.tercero = undefined
    this.regApoyoAlimentario = []

  }


}


