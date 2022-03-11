import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ListService } from '../../../../@core/store/list.service';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
//import { ToastrService } from 'ngx-toastr';
//import { CitasService } from 'src/app/services/citas.service';

@Component({
  selector: 'ngx-listar-cita',
  templateUrl: './listar-cita.component.html',
  styleUrls: ['./listar-cita.component.scss']
})
export class ListarCitaComponent implements OnInit {
  cita: any= [];
  displayedColumns = [   'nombre', 'fecha','hora','facultad'];
  estado: boolean;

  constructor( private listService: ListService, private toastr: ToastrService, private personaService: EstudiantesService, private saludService: SaludService) { }

  ngOnInit() {
    this.listService.getInfoEstudiante().then((resp) => {
      //console.log(resp);
      this.personaService.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        //console.log(res);
        this.saludService.getCitaEspecialista(res[0].TerceroId.Id).subscribe((data) => {
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
            for (let i in this.cita) {
              this.personaService.getPaciente(this.cita[i].IdPaciente).subscribe((res) => {
                this.cita[i].NombrePaciente= res["NombreCompleto"];
                //console.log(res);
              });
            }
          }else{
            this.estado = false;
          }
          }
        });
      });
    });
  }

}
