import { Component, OnInit, ɵɵpureFunction1 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ListService } from '../../../../@core/store/list.service';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';

@Component({
  selector: 'ngx-paciente-cita',
  templateUrl: './paciente-cita.component.html',
  styleUrls: ['./paciente-cita.component.scss']
})
export class PacienteCitaComponent implements OnInit {

  constructor(private fb: FormBuilder, private toastr: ToastrService, private listService: ListService, private personaService: EstudiantesService, private saludService: SaludService) { }
  cita: any = [];
  estado: boolean;

  ngOnInit() {
    this.listService.getInfoEstudiante().then((resp) => {
      //console.log(resp);
      this.personaService.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        //console.log(res);
        this.saludService.getCita(res[0].TerceroId.Id).subscribe((data) => {
          //console.log(data);
          if (data) {
            if (JSON.stringify(data['Data'][0]) != '{}') {
              this.estado = true;
              for (let i in data['Data']) {
                let fechaCita = new Date(data['Data'][i].Fecha);
                let horaCita = new Date(data['Data'][i].Hora);
                horaCita.setHours(horaCita.getHours() + 5);
                let fechaActual = new Date();
                let horaActual = fechaActual.getHours();
                let minutosActual = fechaActual.getMinutes();
                fechaCita.setHours(0, 0, 0, 0);
                fechaActual.setHours(0, 0, 0, 0);
                if (fechaActual.getTime() == fechaCita.getTime()) {
                  if (horaActual < horaCita.getHours()) {
                    this.cita.push(data['Data'][i]);
                  }
                  else if (horaActual == horaCita.getHours()) {
                    if (minutosActual <= horaCita.getMinutes()) {
                      this.cita.push(data['Data'][i]);
                    }
                  }
                } else if (fechaActual.getTime() < fechaCita.getTime()) {
                  this.cita.push(data['Data'][i]);
                }
              }
              //console.log(this.cita);
              for (let i in this.cita) {
                this.personaService.getVinculacion(this.cita[i].IdProfesional).subscribe((res) => {
                  //console.log(res);
                  this.cita[i].NombreProfesional = res[0].TerceroPrincipalId.NombreCompleto;
                });
                this.personaService.getParametro(this.cita[i].TipoServicio).subscribe((res) => {
                  this.cita[i].TipoEspecialista = res['Data'].Nombre;
                });
              }
            } else {
              this.estado = false;
            }
          }
        });
      });
    });
  }

}
