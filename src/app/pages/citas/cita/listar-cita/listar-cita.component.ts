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
  cargando = true;

  constructor( private listService: ListService, private toastr: ToastrService, private personaService: EstudiantesService, private saludService: SaludService) { }

  ngOnInit() {
    this.listService.getInfoEstudiante().then((resp) => {
      //console.log(resp);
      this.personaService.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        //console.log(res);
        this.saludService.getCitaEspecialista(res[0].TerceroId.Id).subscribe((data) => {
          //console.log(data);
          if (data) {
            this.cita = data;
            for (let i in this.cita) {
              this.personaService.getPaciente(this.cita[i].IdPaciente).subscribe((res) => {
                this.cita[i].NombrePaciente= res["NombreCompleto"];
                //console.log(res);
              });
            }
          }
        });
      });
    });
  }

}
