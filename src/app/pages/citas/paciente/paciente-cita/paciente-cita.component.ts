import { Component, OnInit } from '@angular/core';
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

  ngOnInit() {
    this.listService.getInfoEstudiante().then((resp) => {
      //console.log(resp);
      this.personaService.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        //console.log(res);
        this.saludService.getCita(res[0].TerceroId.Id).subscribe((data) => {
          //console.log(data);
          if (data) {
            this.cita = data;
            for (let i in this.cita) {
              this.personaService.getVinculacion(this.cita[i].IdProfesional).subscribe((res) => {
                this.cita[i].NombreProfesional = res[0].TerceroPrincipalId.NombreCompleto;
                //console.log(res);
              });
              this.personaService.getParametro(this.cita[i].TipoServicio).subscribe((res) => {
                this.cita[i].TipoEspecialista = res['Data'].Nombre;
              });
            }
          }
        });
      });
    });
  }

}
